from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/join-request")
async def join_clan_request(data: dict):
    print("JOIN RAW DATA:", data)

    init_data = data.get("initData")
    public_id = data.get("publicId")
    game_nickname = data.get("gameNickname")

    if not init_data:
        return {
            "ok": False,
            "error": "Нет данных Telegram"
        }

    if not public_id:
        return {
            "ok": False,
            "error": "Введите ID клана"
        }

    if not game_nickname:
        return {
            "ok": False,
            "error": "Введите игровой ник"
        }

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    user_id = user_data["id"]

    if not public_id.isdigit() or len(public_id) != 6:
        return {
            "ok": False,
            "error": "ID клана должен состоять из 6 цифр"
        }

    if not game_nickname.isalnum():
        return {
            "ok": False,
            "error": "Игровой ник может содержать только буквы и цифры"
        }

    if len(game_nickname) < 2 or len(game_nickname) > 16:
        return {
            "ok": False,
            "error": "Длина игрового ника может быть от 2 до 16 символов"
        }

    cur.execute("""
    SELECT id
    FROM clans
    WHERE public_id = %s
    """, (public_id,))

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
        game_nickname
    ))

    conn.commit()

    return {
        "ok": True
    }