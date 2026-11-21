import time
from fastapi import APIRouter
from app.config.settings import settings

router = APIRouter(tags=["Health"])

START_TIME = time.time()


@router.get("/health")
async def health_check():
    """Health check endpoint confirming AI microservice operational status"""
    uptime_seconds = int(time.time() - START_TIME)
    return {
        "status": "UP",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "provider": settings.AI_PROVIDER,
        "model": settings.GEMINI_MODEL if settings.AI_PROVIDER == "gemini" else "rule-based-mock",
        "demoMode": settings.DEMO_MODE,
        "uptimeSeconds": uptime_seconds
    }
