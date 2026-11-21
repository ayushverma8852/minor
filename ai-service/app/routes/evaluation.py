from fastapi import APIRouter, HTTPException, status
from app.models.evaluation import EvaluationRequest, EvaluationResponse
from app.services.evaluation_service import EvaluationService

router = APIRouter(prefix="/api/v1/evaluation", tags=["Evaluation"])


@router.post("/evaluate", response_model=EvaluationResponse, status_code=status.HTTP_200_OK)
async def evaluate_answer(request: EvaluationRequest):
    """
    Evaluate student's answer against expected concepts and question context.
    Input:
      - question: str
      - expectedConcepts: List[str]
      - studentAnswer: str
      - technology: str
    Output:
      - score: int (0 - 100)
      - correctness: int (0 - 25)
      - relevance: int (0 - 25)
      - completeness: int (0 - 25)
      - strengths: List[str]
      - weaknesses: List[str]
      - improvementSuggestions: List[str]
      - modelAnswer: str
      - matchedConcepts: List[str]
      - missedConcepts: List[str]
    """
    if not request.question or not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question text cannot be empty."
        )

    try:
        response = await EvaluationService.evaluate_answer(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Evaluation failed: {str(e)}"
        )
