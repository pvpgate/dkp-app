from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/reset-dkp")
async def reset_clan_dkp(clan_id: int, data: dict):
    init_data = data.get("initData")
    confirm_text = data.get("confirmText")

    if confirm_text != "DELETE-ALL-DKP":
        return {
            "ok": False,
            "error": "Текст подтверждения введён неверно"
        }

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
            "error": "Вы не состоите в этом клане"
        }

    role = member[0]

    if role != "leader":
        return {
            "ok": False,
            "error": "Обнулить DKP может только лидер клана"
        }

    cur.execute("""
    UPDATE clan_members
    SET dkp = 0
    WHERE clan_id = %s
    """, (clan_id,))

    conn.commit()

    return {
        "ok": True
    }