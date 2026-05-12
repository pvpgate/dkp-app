from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/requests/{request_id}/process")
async def process_request(request_id: int, data: dict):
    init_data = data.get("initData")
    action = data.get("action")

    if action not in ["accept", "reject"]:
        return {
            "ok": False,
            "error": "Неверное действие"
        }

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT
        cr.id,
        cr.clan_id,
        cr.user_telegram_id,
        cr.game_nickname,
        cr.status
    FROM clan_requests cr
    WHERE cr.id = %s
    """, (request_id,))

    request = cur.fetchone()

    if not request:
        return {
            "ok": False,
            "error": "Заявка не найдена"
        }

    request_id_db = request[0]
    clan_id = request[1]
    applicant_telegram_id = request[2]
    game_nickname = request[3]
    status = request[4]

    if status != "pending":
        return {
            "ok": False,
            "error": "Заявка уже обработана"
        }

    cur.execute("""
    SELECT role
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        user_id
    ))

    current_member = cur.fetchone()

    if not current_member:
        return {
            "ok": False,
            "error": "Вы не состоите в этом клане"
        }

    current_role = current_member[0]

    if current_role not in ["leader", "officer"]:
        return {
            "ok": False,
            "error": "Недостаточно прав"
        }

    if action == "accept":
        cur.execute("""
        INSERT INTO clan_members (
            clan_id,
            user_telegram_id,
            role,
            dkp,
            game_nickname
        )
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (clan_id, user_telegram_id) DO NOTHING
        """, (
            clan_id,
            applicant_telegram_id,
            "member",
            0,
            game_nickname
        ))

        cur.execute("""
        UPDATE clan_requests
        SET status = 'accepted'
        WHERE id = %s
        """, (request_id_db,))

    if action == "reject":
        cur.execute("""
        UPDATE clan_requests
        SET status = 'rejected'
        WHERE id = %s
        """, (request_id_db,))

    conn.commit()

    return {
        "ok": True
    }