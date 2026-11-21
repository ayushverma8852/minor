from fastapi import APIRouter, HTTPException, status
from app.models.question import QuestionGenerateRequest, QuestionGenerateResponse
from app.services.question_service import QuestionService
from app.config.settings import settings

router = APIRouter(prefix="/api/v1/questions", tags=["Questions"])


@router.post("/generate", response_model=QuestionGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_questions(request: QuestionGenerateRequest):
    """
    Generate technology-specific interview questions.
    Input:
      - technology: str (Java, Python, JavaScript, React, SQL, etc.)
      - difficulty: str (Beginner, Intermediate, Advanced)
      - interviewType: str (Technical, HR, Mixed)
      - numberOfQuestions: int (1 - 15)
    Output:
      Structured JSON containing list of QuestionItems with IDs, topics, expected concepts, and sample answers.
    """
    try:
        questions = await QuestionService.generate_questions(request)
        return QuestionGenerateResponse(
            status="success",
            provider=settings.AI_PROVIDER,
            technology=request.technology,
            difficulty=request.difficulty,
            interviewType=request.interviewType,
            count=len(questions),
            questions=questions
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate questions: {str(e)}"
        )
