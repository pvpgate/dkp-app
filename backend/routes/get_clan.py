from fastapi import APIRouter
from pydantic import BaseModel
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


class GetClanRequest(BaseModel):
    initData: str


@router.post("/clans/{clan_id}")
async def get_clan(clan_id: int, data: GetClanRequest):
    parsed = dict(parse_qsl(data.initData))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT
        c.id,
        c.public_id,
        c.name,
        c.leader_telegram_id,
        c.created_at,
        cm.role
    FROM clans c
    JOIN clan_members cm
        ON cm.clan_id = c.id
    WHERE c.id = %s
      AND cm.user_telegram_id = %s
    """, (
        clan_id,
        user_id
    ))

    clan = cur.fetchone()

    if not clan:
        return {
            "ok": False,
            "error": "Clan not found or access denied"
        }

    return {
        "ok": True,
        "clan": {
            "id": clan[0],
            "public_id": clan[1],
            "name": clan[2],
            "leader_telegram_id": clan[3],
            "created_at": str(clan[4]),
            "role": clan[5],
        }
    }