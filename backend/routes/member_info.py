from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


@router.post("/clans/{clan_id}/members/{member_id}")
async def member_info(clan_id: int, member_id: int, data: dict):
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

    current_member = cur.fetchone()
    current_user_role = current_member[0]

    if not current_member:
        return {
            "ok": False,
            "error": "Вы не состоите в этом клане"
        }

    cur.execute("""
    SELECT
        user_telegram_id,
        game_nickname,
        role,
        dkp,
        joined_at
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        member_id
    ))

    member = cur.fetchone()

    if not member:
        return {
            "ok": False,
            "error": "Участник не найден"
        }

    return {
        "ok": True,
        "current_user_role": current_user_role,
        "member": {
            "user_telegram_id": member[0],
            "game_nickname": member[1],
            "role": member[2],
            "dkp": member[3],
            "joined_at": str(member[4]),
        }
    }