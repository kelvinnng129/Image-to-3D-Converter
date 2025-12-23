from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import init_db
from app.models import Job 
from app.api import router as api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    init_db()
    print("✓ Database initialized")
    yield
    print("Shutting down...")


# FastAPI app
app = FastAPI(
    title="Image to 3D API",
    description="Convert 2D images into 3D models",
    version="1.0.0",
    lifespan=lifespan
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "processor": settings.processor_type
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Image to 3D API",
        "docs": "/docs",
        "health": "/health"
    }
