from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2
import json
from urllib.parse import parse_qsl

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    telegram_id BIGINT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    premium_until TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)
""")
conn.commit()


class AuthRequest(BaseModel):
    initData: str


@app.post("/auth/telegram")
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