from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


def role_level(role):
    if role == "leader":
        return 3
    if role == "officer":
        return 2
    return 1


@router.post("/clans/{clan_id}/members/{member_id}/kick")
async def kick_member(clan_id: int, member_id: int, data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    current_user_id = user_data["id"]

    cur.execute("""
    SELECT role
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        current_user_id
    ))

    current_member = cur.fetchone()

    if not current_member:
        return {"ok": False, "error": "Вы не состоите в этом клане"}

    current_role = current_member[0]

    cur.execute("""
    SELECT role
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        member_id
    ))

    target_member = cur.fetchone()

    if not target_member:
        return {"ok": False, "error": "Участник не найден"}

    target_role = target_member[0]

    if target_role == "leader":
        return {"ok": False, "error": "Нельзя исключить лидера"}

    if role_level(current_role) <= role_level(target_role):
        return {
            "ok": False,
            "error": "Нельзя исключить участника с такой же или более высокой ролью"
        }

    cur.execute("""
    DELETE FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        member_id
    ))

    conn.commit()

    return {"ok": True}