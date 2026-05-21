from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/events/{event_id}/delete")
async def delete_event(clan_id: int, event_id: int, data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT role
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (clan_id, user_id))

    member = cur.fetchone()

    if not member:
        return {"ok": False, "error": "Вы не состоите в этом клане"}

    current_user_role = member[0]

    cur.execute("""
    SELECT created_by_telegram_id
    FROM events
    WHERE id = %s
      AND clan_id = %s
    """, (event_id, clan_id))

    event = cur.fetchone()

    if not event:
        return {"ok": False, "error": "Событие не найдено"}

    created_by_telegram_id = event[0]

    if current_user_role != "leader" and created_by_telegram_id != user_id:
        return {"ok": False, "error": "Недостаточно прав"}

    cur.execute("""
    DELETE FROM events
    WHERE id = %s
      AND clan_id = %s
    """, (event_id, clan_id))

    conn.commit()

    return {"ok": True}