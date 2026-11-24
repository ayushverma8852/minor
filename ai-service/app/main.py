import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.routes import health_router, questions_router, evaluation_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("ai_service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("==================================================")
    logger.info("InterviewPrep AI Microservice Starting Up")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"AI Provider: {settings.AI_PROVIDER}")
    logger.info(f"Demo / Transparent Mock Mode: {settings.DEMO_MODE}")
    logger.info("==================================================")
    yield
    logger.info("InterviewPrep AI Microservice Shutting Down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Dedicated AI Microservice for InterviewPrep AI: Questions Generation and Technical Evaluation Engine",
    lifespan=lifespan
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health_router)
app.include_router(questions_router)
app.include_router(evaluation_router)
from app.routes.live_quiz import router as live_quiz_router
app.include_router(live_quiz_router)
@app.get("/")
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "ONLINE",
        "endpoints": {
            "health": "/health",
            "generate_questions": "POST /api/v1/questions/generate",
            "evaluate_answer": "POST /api/v1/evaluation/evaluate",
            "docs": "/docs",
            "openapi": "/openapi.json"
        },
        "provider": settings.AI_PROVIDER,
        "demoMode": settings.DEMO_MODE
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
