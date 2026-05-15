from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/events/create")
async def create_event(clan_id: int, data: dict):
    init_data = data.get("initData")
    title = data.get("title")
    dkp_reward = data.get("dkpReward")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    if not title or len(title) < 2 or len(title) > 32:
        return {
            "ok": False,
            "error": "Название события должно быть от 2 до 32 символов"
        }

    try:
        dkp_reward = int(dkp_reward)
    except:
        return {
            "ok": False,
            "error": "DKP должно быть числом"
        }

    if dkp_reward <= 0:
        return {
            "ok": False,
            "error": "DKP должно быть больше 0"
        }

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

    role = member[0]

    if role not in ["leader", "officer"]:
        return {
            "ok": False,
            "error": "Недостаточно прав"
        }

    cur.execute("""
    INSERT INTO events (
        clan_id,
        title,
        dkp_reward,
        created_by_telegram_id
    )
    VALUES (%s, %s, %s, %s)
    RETURNING id, title, dkp_reward, is_closed, created_at
    """, (
        clan_id,
        title,
        dkp_reward,
        user_id
    ))

    event = cur.fetchone()
    conn.commit()

    return {
        "ok": True,
        "event": {
            "id": event[0],
            "title": event[1],
            "dkp_reward": event[2],
            "is_closed": event[3],
            "created_at": str(event[4])
        }
    }