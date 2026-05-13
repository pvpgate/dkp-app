from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/members/{member_id}/dkp")
async def change_dkp(clan_id: int, member_id: int, data: dict):
    init_data = data.get("initData")
    amount = data.get("amount")
    reason = data.get("reason")

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    changed_by = user_data["id"]

    if amount is None:
        return {
            "ok": False,
            "error": "Укажите количество DKP"
        }

    amount = int(amount)

    if amount == 0:
        return {
            "ok": False,
            "error": "Изменение DKP не может быть 0"
        }

    cur.execute("""
    SELECT role
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        changed_by
    ))

    current_member = cur.fetchone()

    if not current_member:
        return {
            "ok": False,
            "error": "Вы не состоите в этом клане"
        }

    current_role = current_member[0]

    if current_role not in ["leader", "officer"]:
        return {
            "ok": False,
            "error": "Недостаточно прав"
        }

    cur.execute("""
    SELECT dkp
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        member_id
    ))

    target_member = cur.fetchone()

    if not target_member:
        return {
            "ok": False,
            "error": "Участник не найден"
        }

    cur.execute("""
    UPDATE clan_members
    SET dkp = dkp + %s
    WHERE clan_id = %s
      AND user_telegram_id = %s
    RETURNING dkp
    """, (
        amount,
        clan_id,
        member_id
    ))

    new_dkp = cur.fetchone()[0]

    cur.execute("""
    INSERT INTO dkp_logs (
        clan_id,
        user_telegram_id,
        changed_by_telegram_id,
        event_id,
        amount,
        reason
    )
    VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        clan_id,
        member_id,
        changed_by,
        None,
        amount,
        reason
    ))

    conn.commit()

    return {
        "ok": True,
        "dkp": new_dkp
    }