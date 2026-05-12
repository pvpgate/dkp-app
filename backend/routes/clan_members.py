from fastapi import APIRouter
from pydantic import BaseModel
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


class ClanMembersRequest(BaseModel):
    initData: str


@router.post("/clans/{clan_id}/members")
async def get_clan_members(clan_id: int, data: ClanMembersRequest):
    parsed = dict(parse_qsl(data.initData))
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

    current_member = cur.fetchone()

    if not current_member:
        return {
            "ok": False,
            "error": "Access denied"
        }

    cur.execute("""
    SELECT
        user_telegram_id,
        game_nickname,
        role,
        dkp
    FROM clan_members
    WHERE clan_id = %s
    ORDER BY
        CASE role
            WHEN 'leader' THEN 1
            WHEN 'officer' THEN 2
            ELSE 3
        END,
        dkp DESC
    """, (clan_id,))

    rows = cur.fetchall()

    members = []
    for row in rows:
        members.append({
            "user_telegram_id": row[0],
            "game_nickname": row[1],
            "role": row[2],
            "dkp": row[3],
        })

    return {
        "ok": True,
        "members": members
    }