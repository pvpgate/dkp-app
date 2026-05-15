from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


@router.post("/clans/{clan_id}/events/{event_id}")
async def get_event(clan_id: int, event_id: int, data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT id
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

    cur.execute("""
    SELECT
        id,
        title,
        dkp_reward,
        is_closed,
        created_at
    FROM events
    WHERE id = %s
      AND clan_id = %s
    """, (
        event_id,
        clan_id
    ))

    event = cur.fetchone()

    if not event:
        return {
            "ok": False,
            "error": "Событие не найдено"
        }

    return {
        "ok": True,
        "event": {
            "id": event[0],
            "title": event[1],
            "dkp_reward": event[2],
            "is_closed": event[3],
            "created_at": str(event[4])
        }
    }