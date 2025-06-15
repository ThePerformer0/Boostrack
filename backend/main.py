# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import task_routes, note_routes
from contextlib import asynccontextmanager

from db.db import create_db_and_tables

# Lifespan = hook exécuté au démarrage et à l'arrêt de l'app
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# CORS: autoriser React à accéder à l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Port par défaut de Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(note_routes.router)
app.include_router(task_routes.router)
