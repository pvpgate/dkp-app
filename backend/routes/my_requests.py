from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


@router.post("/my-requests")
async def my_requests(data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])

    user_id = user_data["id"]

    cur.execute("""
    SELECT
        clan_requests.id,
        clan_requests.status,
        clan_requests.game_nickname,
        clans.id,
        clans.name,
        clans.public_id
    FROM clan_requests
    JOIN clans
      ON clans.id = clan_requests.clan_id
    WHERE clan_requests.user_telegram_id = %s
      AND clan_requests.status = 'pending'
    ORDER BY clan_requests.created_at DESC
    """, (user_id,))

    rows = cur.fetchall()

    requests = []

    for row in rows:
        requests.append({
            "id": row[0],
            "status": row[1],
            "game_nickname": row[2],
            "clan_id": row[3],
            "clan_name": row[4],
            "clan_public_id": row[5],
        })

    return {
        "ok": True,
        "requests": requests
    }