from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


@router.post("/clans/{clan_id}/events")
async def clan_events(clan_id: int, data: dict):
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
        public_id,
        title,
        dkp_reward,
        is_closed,
        created_at
    FROM events
    WHERE clan_id = %s
    ORDER BY created_at DESC
    """, (clan_id,))

    rows = cur.fetchall()

    events = []

    for row in rows:
        events.append({
            "id": row[0],
            "public_id": row[1],
            "title": row[2],
            "dkp_reward": row[3],
            "is_closed": row[4],
            "created_at": str(row[5]),
        })

    return {
        "ok": True,
        "events": events
    }