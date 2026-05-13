import os
import psycopg2

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

cur.execute("""
CREATE TABLE IF NOT EXISTS clans (
    id SERIAL PRIMARY KEY,
    public_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    leader_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id),
    created_at TIMESTAMP DEFAULT NOW()
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS clan_members (
    id SERIAL PRIMARY KEY,
    clan_id INTEGER NOT NULL REFERENCES clans(id),
    user_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id),
    game_nickname TEXT,
    role TEXT NOT NULL,
    dkp INTEGER NOT NULL DEFAULT 0,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (clan_id, user_telegram_id)
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS clan_requests (
    id SERIAL PRIMARY KEY,
    clan_id INTEGER NOT NULL REFERENCES clans(id),
    user_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id),
    game_nickname TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (clan_id, user_telegram_id)
)
""")

cur.execute("""
ALTER TABLE clan_requests
DROP CONSTRAINT IF EXISTS clan_requests_clan_id_user_telegram_id_key
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS dkp_logs (
    id SERIAL PRIMARY KEY,
    clan_id INTEGER NOT NULL REFERENCES clans(id),
    user_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id),
    changed_by_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id),
    event_id INTEGER,
    amount INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
)
""")

conn.commit()