from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/leave")
async def leave_clan(clan_id: int, data: dict):
    init_data = data.get("initData")
    clan_name = data.get("clanName")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT name
    FROM clans
    WHERE id = %s
    """, (clan_id,))

    clan = cur.fetchone()

    if not clan:
        return {
            "ok": False,
            "error": "Клан не найден"
        }

    real_clan_name = clan[0]

    if clan_name != real_clan_name:
        return {
            "ok": False,
            "error": "Название клана введено неверно"
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

    member = cur.fetchone()

    if not member:
        return {
            "ok": False,
            "error": "Вы не состоите в этом клане"
        }

    role = member[0]

    if role == "leader":
        return {
            "ok": False,
            "error": "Лидер не может покинуть клан. Можно только удалить клан."
        }

    cur.execute("""
    DELETE FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        user_id
    ))

    conn.commit()

    return {
        "ok": True
    }