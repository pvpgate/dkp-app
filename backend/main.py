from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AuthRequest(BaseModel):
    initData: str

@app.post("/auth/telegram")
async def auth(data: AuthRequest):
    print("INIT DATA:", data.initData)
    return {"ok": True}