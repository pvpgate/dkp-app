from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/events/{event_id}/join")
async def join_event(clan_id: int, event_id: int, data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    cur.execute("""
    SELECT game_nickname
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

    game_nickname = member[0]

    cur.execute("""
    SELECT id, is_closed
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

    if event[1]:
        return {
            "ok": False,
            "error": "Событие закрыто"
        }

    cur.execute("""
    SELECT id
    FROM event_participants
    WHERE event_id = %s
      AND user_telegram_id = %s
    """, (
        event_id,
        user_id
    ))

    existing_participant = cur.fetchone()

    if existing_participant:
        return {
            "ok": False,
            "error": "Вы уже участвуете в этом событии"
        }

    cur.execute("""
    INSERT INTO event_participants (
        event_id,
        clan_id,
        user_telegram_id,
        game_nickname,
        status
    )
    VALUES (%s, %s, %s, %s, %s)
    """, (
        event_id,
        clan_id,
        user_id,
        game_nickname,
        "pending"
    ))

    conn.commit()

    return {
        "ok": True
    }