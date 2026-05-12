from fastapi import APIRouter
from pydantic import BaseModel
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


class JoinClanRequest(BaseModel):
    initData: str
    publicId: str
    gameNickname: str


@router.post("/clans/join-request")
async def join_clan_request(data: JoinClanRequest):
    print("JOIN REQUEST HIT")
    parsed = dict(parse_qsl(data.initData))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    if not data.publicId.isdigit() or len(data.publicId) != 6:
        return {
            "ok": False,
            "error": "ID клана должен состоять из 6 цифр"
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

    cur.execute("""
    SELECT id
    FROM clans
    WHERE public_id = %s
    """, (data.publicId,))

    clan = cur.fetchone()

    if not clan:
        return {
            "ok": False,
            "error": "Клан не найден"
        }

    clan_id = clan[0]

    cur.execute("""
    SELECT id
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        user_id
    ))

    existing_member = cur.fetchone()

    if existing_member:
        return {
            "ok": False,
            "error": "Вы уже состоите в этом клане"
        }

    cur.execute("""
    INSERT INTO clan_requests (clan_id, user_telegram_id, game_nickname)
    VALUES (%s, %s, %s)
    ON CONFLICT (clan_id, user_telegram_id) DO NOTHING
    """, (
        clan_id,
        user_id,
        data.gameNickname
    ))

    conn.commit()

    return {
        "ok": True
    }