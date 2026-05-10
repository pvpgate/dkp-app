from fastapi import APIRouter
from pydantic import BaseModel
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


class AuthRequest(BaseModel):
    initData: str


@router.post("/auth/telegram")
async def auth(data: AuthRequest):
    parsed = dict(parse_qsl(data.initData))
    user_data = json.loads(parsed["user"])

    cur.execute("""
    INSERT INTO users (telegram_id, username, first_name)
    VALUES (%s, %s, %s)
    ON CONFLICT (telegram_id) DO NOTHING
    """, (
        user_data["id"],
        user_data.get("username"),
        user_data.get("first_name")
    ))

    conn.commit()

    print("USER SAVED:", user_data)

    return {
        "ok": True,
        "user": user_data
    }