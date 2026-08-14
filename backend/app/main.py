from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import Base
from app.database.session import engine

# Models
from app.models.user import User
from app.models.device import Device
from app.models.automation import Automation

# Routers
from app.api.auth import router as auth_router
from app.api.devices import router as device_router
from app.api.chat import router as chat_router
from app.api.automation import router as automation_router

# Scheduler
from app.services.scheduler_service import (
    start_scheduler,
    stop_scheduler,
)


# =====================================================
# Database
# =====================================================

Base.metadata.create_all(bind=engine)


# =====================================================
# Lifespan
# =====================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    start_scheduler()

    yield

    stop_scheduler()


# =====================================================
# FastAPI
# =====================================================

app = FastAPI(
    title="Smart Home Control Agent",
    version="1.0.0",
    description="AI Powered Smart Home Control Agent",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://smart-home-control-agent-m07t0pc6-bhgs-projects-019873cb.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Routers
# =====================================================

app.include_router(auth_router)
app.include_router(device_router)
app.include_router(chat_router)
app.include_router(automation_router)


# =====================================================
# Root
# =====================================================

@app.get("/")
def root():

    return {
        "message": "Smart Home Control Agent API is running.",
        "version": "1.0.0",
        "scheduler": "Running",
    }