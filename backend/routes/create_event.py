from fastapi import APIRouter
import json
import random
import string
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


def generate_public_id():
    symbols = string.ascii_uppercase + string.digits
    return "".join(random.choice(symbols) for _ in range(5))


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

    while True:
        public_id = generate_public_id()

        cur.execute("""
        SELECT id
        FROM events
        WHERE public_id = %s
        """, (public_id,))

        existing_event = cur.fetchone()

        if existing_event is None:
            break

    cur.execute("""
    INSERT INTO events (
        clan_id,
        public_id,
        title,
        dkp_reward,
        created_by_telegram_id
    )
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id, public_id, title, dkp_reward, is_closed, created_at
    """, (
        clan_id,
        public_id,
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
            "public_id": event[1],
            "title": event[2],
            "dkp_reward": event[3],
            "is_closed": event[4],
            "created_at": str(event[5])
        }
    }