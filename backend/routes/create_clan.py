from fastapi import APIRouter
from pydantic import BaseModel
import json
import random
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


class CreateClanRequest(BaseModel):
    initData: str
    name: str


def generate_public_id():
    return str(random.randint(100000, 999999))


@router.post("/clans/create")
async def create_clan(data: CreateClanRequest):
    parsed = dict(parse_qsl(data.initData))
    user_data = json.loads(parsed["user"])

    user_id = user_data["id"]

    while True:
        public_id = generate_public_id()

        cur.execute(
            "SELECT id FROM clans WHERE public_id = %s",
            (public_id,)
        )

        existing_clan = cur.fetchone()

        if existing_clan is None:
            break

    cur.execute("""
    INSERT INTO clans (public_id, name, leader_telegram_id)
    VALUES (%s, %s, %s)
    RETURNING id, public_id, name, leader_telegram_id, created_at
    """, (
        public_id,
        data.name,
        user_id
    ))

    clan = cur.fetchone()
    clan_id = clan[0]

    cur.execute("""
    INSERT INTO clan_members (clan_id, user_telegram_id, role)
    VALUES (%s, %s, %s)
    ON CONFLICT (clan_id, user_telegram_id) DO NOTHING
    """, (
        clan_id,
        user_id,
        "leader"
    ))

    conn.commit()

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