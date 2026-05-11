from fastapi import APIRouter
from pydantic import BaseModel
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


class DeleteClanRequest(BaseModel):
    initData: str
    clanName: str


@router.delete("/clans/{clan_id}")
async def delete_clan(clan_id: int, data: DeleteClanRequest):
    parsed = dict(parse_qsl(data.initData))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT id, name, leader_telegram_id
    FROM clans
    WHERE id = %s
    """, (clan_id,))

    clan = cur.fetchone()

    if not clan:
        return {
            "ok": False,
            "error": "Clan not found"
        }

    clan_name = clan[1]
    leader_telegram_id = clan[2]

    if leader_telegram_id != user_id:
        return {
            "ok": False,
            "error": "Only leader can delete clan"
        }

    if data.clanName != clan_name:
        return {
            "ok": False,
            "error": "Clan name does not match"
        }

    cur.execute("""
    DELETE FROM clan_members
    WHERE clan_id = %s
    """, (clan_id,))

    cur.execute("""
    DELETE FROM clans
    WHERE id = %s
    """, (clan_id,))

    conn.commit()

    return {
        "ok": True
    }