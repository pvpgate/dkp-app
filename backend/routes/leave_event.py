from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/events/{event_id}/leave")
async def leave_event(clan_id: int, event_id: int, data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT id
    FROM event_participants
    WHERE clan_id = %s
      AND event_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        event_id,
        user_id
    ))

    participant = cur.fetchone()

    if not participant:
        return {
            "ok": False,
            "error": "Вы не участвуете в этом событии"
        }

    cur.execute("""
    DELETE FROM event_participants
    WHERE clan_id = %s
      AND event_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        event_id,
        user_id
    ))

    conn.commit()

    return {
        "ok": True
    }