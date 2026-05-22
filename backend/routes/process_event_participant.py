from fastapi import APIRouter
import json
from urllib.parse import parse_qsl
from db import conn, cur

router = APIRouter()


@router.post("/clans/{clan_id}/events/{event_id}/participants/{participant_id}/process")
async def process_event_participant(
    clan_id: int,
    event_id: int,
    participant_id: int,
    data: dict
):
    init_data = data.get("initData")
    action = data.get("action")

    if action not in ["accept", "reject"]:
        return {
            "ok": False,
            "error": "Неверное действие"
        }

    parsed = dict(parse_qsl(init_data))
    user_data = json.loads(parsed["user"])
    reviewer_id = user_data["id"]

    cur.execute("""
    SELECT role
    FROM clan_members
    WHERE clan_id = %s
      AND user_telegram_id = %s
    """, (
        clan_id,
        reviewer_id
    ))

    reviewer = cur.fetchone()

    if not reviewer:
        return {
            "ok": False,
            "error": "Вы не состоите в этом клане"
        }

    reviewer_role = reviewer[0]

    if reviewer_role not in ["leader", "officer"]:
        return {
            "ok": False,
            "error": "Недостаточно прав"
        }

    cur.execute("""
    SELECT
        event_participants.user_telegram_id,
        event_participants.status,
        events.dkp_reward
    FROM event_participants
    JOIN events
      ON events.id = event_participants.event_id
    WHERE event_participants.id = %s
      AND event_participants.clan_id = %s
      AND event_participants.event_id = %s
    """, (
        participant_id,
        clan_id,
        event_id
    ))

    participant = cur.fetchone()

    if not participant:
        return {
            "ok": False,
            "error": "Участник события не найден"
        }

    participant_user_id = participant[0]
    participant_status = participant[1]
    dkp_reward = participant[2]

    if participant_status != "pending":
        return {
            "ok": False,
            "error": "Участие уже обработано"
        }

    new_status = "accepted" if action == "accept" else "rejected"

    cur.execute("""
    UPDATE event_participants
    SET status = %s,
        reviewed_by_telegram_id = %s,
        reviewed_at = NOW()
    WHERE id = %s
    """, (
        new_status,
        reviewer_id,
        participant_id
    ))

    if action == "accept":
        cur.execute("""
        UPDATE clan_members
        SET dkp = dkp + %s
        WHERE clan_id = %s
          AND user_telegram_id = %s
        """, (
            dkp_reward,
            clan_id,
            participant_user_id
        ))

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
            participant_user_id,
            reviewer_id,
            event_id,
            dkp_reward,
            "Event reward"
        ))

    conn.commit()

    return {
        "ok": True,
        "status": new_status
    }