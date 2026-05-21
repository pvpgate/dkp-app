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

    current_user_role = member[0]

    cur.execute("""
    SELECT
        id,
        public_id,
        title,
        dkp_reward,
        is_closed,
        created_at,
        created_by_telegram_id
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

    created_by_telegram_id = event[6]

    can_delete =
        current_user_role == "leader" or created_by_telegram_id == user_id

    return {
        "ok": True,
        "can_delete": can_delete,
        "event": {
            "id": event[0],
            "public_id": event[1],
            "title": event[2],
            "dkp_reward": event[3],
            "is_closed": event[4],
            "created_at": str(event[5]),
            "created_by_telegram_id": event[6]
        }
    }