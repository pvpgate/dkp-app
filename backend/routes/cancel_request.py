from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/requests/{request_id}/cancel")
async def cancel_request(request_id: int, data: dict):
    init_data = data.get("initData")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])

    user_id = user_data["id"]

    cur.execute("""
    DELETE FROM clan_requests
    WHERE id = %s
      AND user_telegram_id = %s
    """, (
        request_id,
        user_id
    ))

    conn.commit()

    return {
        "ok": True
    }