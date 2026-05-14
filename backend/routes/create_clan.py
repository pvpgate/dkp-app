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
    gameNickname: str


def generate_public_id():
    return str(random.randint(100000, 999999))


@router.post("/clans/create")
async def create_clan(data: CreateClanRequest):
    parsed = dict(parse_qsl(data.initData))
    user_data = json.loads(parsed["user"])

    user_id = user_data["id"]

    cur.execute("""
    SELECT COUNT(*)
    FROM clans
    WHERE leader_telegram_id = %s
    """, (user_id,))

    clans_count = cur.fetchone()[0]

    if clans_count >= 3:
        return {
            "ok": False,
            "error": "Максимальное количество кланов для одного пользователя: 3. Удалите один из кланов для создания нового."
        }

    if not data.name.isalnum():
        return {
            "ok": False,
            "error": "Имя клана может содержать только буквы и цифры"
        }

    if len(data.name) < 2 or len(data.name) > 16:
        return {
            "ok": False,
            "error": "Длина имени клана может быть от 2 до 16 символов"
        }

    if not data.gameNickname.isalnum():
        return {
            "ok": False,
            "error": "Игровой ник может содержать только буквы и цифры"
        }

    if len(data.gameNickname) < 2 or len(data.gameNickname) > 16:
        return {
            "ok": False,
            "error": "Длина игрового ника может быть от 2 до 16 символов"
        }

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
    INSERT INTO clan_members (clan_id, user_telegram_id, role, dkp, game_nickname)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (clan_id, user_telegram_id) DO NOTHING
    """, (
        clan_id,
        user_id,
        "leader",
        0,
        data.gameNickname
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