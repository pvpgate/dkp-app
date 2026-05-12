from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.create_clan import router as create_clan_router
from routes.my_clans import router as my_clans_router
from routes.get_clan import router as get_clan_router
from routes.delete_clan import router as delete_clan_router
from routes.clan_members import router as clan_members_router
from routes.join_clan_request import router as join_clan_request_router
from routes.my_requests import router as my_requests_router
from routes.cancel_request import router as cancel_request_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(join_clan_request_router)
app.include_router(auth_router)
app.include_router(create_clan_router)
app.include_router(my_clans_router)
app.include_router(get_clan_router)
app.include_router(delete_clan_router)
app.include_router(clan_members_router)
app.include_router(my_requests_router)
app.include_router(cancel_request_router)
