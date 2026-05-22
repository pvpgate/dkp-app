from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import cur

router = APIRouter()


@router.post("/clans/{clan_id}/events/{event_id}/participants")
async def event_participants(clan_id: int, event_id: int, data: dict):
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
    can_manage = current_user_role in ["leader", "officer"]

    if can_manage:
        cur.execute("""
        SELECT
            id,
            game_nickname,
            status,
            created_at,
            user_telegram_id
        FROM event_participants
        WHERE clan_id = %s
          AND event_id = %s
          AND status IN ('accepted', 'pending')
        ORDER BY created_at DESC
        """, (
            clan_id,
            event_id
        ))
    else:
        cur.execute("""
        SELECT
            id,
            game_nickname,
            status,
            created_at,
            user_telegram_id
        FROM event_participants
        WHERE clan_id = %s
          AND event_id = %s
          AND (
            status = 'accepted'
            OR user_telegram_id = %s
          )
        ORDER BY created_at DESC
        """, (
            clan_id,
            event_id,
            user_id
        ))

    rows = cur.fetchall()

    participants = []

    for row in rows:
        participants.append({
            "id": row[0],
            "game_nickname": row[1],
            "status": row[2],
            "created_at": str(row[3]),
            "user_telegram_id": row[4],
        })

    return {
        "ok": True,
        "participants": participants
    }