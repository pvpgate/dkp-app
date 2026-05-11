from fastapi import APIRouter
from db import cur

router = APIRouter()


@router.get("/clans/{clan_id}")
async def get_clan(clan_id: int):
    cur.execute("""
    SELECT id, public_id, name, leader_telegram_id, created_at
    FROM clans
    WHERE id = %s
    """, (clan_id,))

    clan = cur.fetchone()

    if not clan:
        return {
            "ok": False,
            "error": "Clan not found"
        }

    return {
        "ok": True,
        "clan": {
            "id": clan[0],
            "public_id": clan[1],
            "name": clan[2],
            "leader_telegram_id": clan[3],
            "created_at": str(clan[4])
        }
    }