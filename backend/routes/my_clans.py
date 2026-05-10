from fastapi import APIRouter
from pydantic import BaseModel
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


class MyClansRequest(BaseModel):
    initData: str


@router.post("/clans/my")
async def my_clans(data: MyClansRequest):
    parsed = dict(parse_qsl(data.initData))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT
        c.id,
        c.public_id,
        c.name,
        cm.role,
        cm.dkp,
        COUNT(cm2.id) AS members_count
    FROM clan_members cm
    JOIN clans c ON c.id = cm.clan_id
    LEFT JOIN clan_members cm2 ON cm2.clan_id = c.id
    WHERE cm.user_telegram_id = %s
    GROUP BY c.id, c.public_id, c.name, cm.role, cm.dkp
    ORDER BY c.created_at DESC
    """, (user_id,))

    rows = cur.fetchall()

    clans = []
    for row in rows:
        clans.append({
            "id": row[0],
            "public_id": row[1],
            "name": row[2],
            "role": row[3],
            "dkp": row[4],
            "members_count": row[5],
        })

    return {
        "ok": True,
        "clans": clans
    }