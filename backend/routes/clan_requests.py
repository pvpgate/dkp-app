from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


@router.post("/clans/{clan_id}/requests")
async def clan_requests(clan_id: int, data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])

    user_id = user_data["id"]

    cur.execute("""
    SELECT role
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        user_id
    ))

    member = cur.fetchone()

    if not member:
        return {
            "ok": False,
            "error": "Вы не состоите в клане"
        }

    role = member[0]

    if role not in ["leader", "officer"]:
        return {
            "ok": False,
            "error": "Недостаточно прав"
        }

    cur.execute("""
    SELECT
        id,
        game_nickname,
        status,
        created_at
    FROM clan_requests
    WHERE clan_id = %s
      AND status = 'pending'
    ORDER BY created_at DESC
    """, (clan_id,))

    rows = cur.fetchall()

    requests = []

    for row in rows:
        requests.append({
            "id": row[0],
            "game_nickname": row[1],
            "status": row[2],
            "created_at": str(row[3]),
        })

    return {
        "ok": True,
        "requests": requests
    }