from app.models.evaluation import EvaluationRequest, EvaluationResponse
from app.services.ai_provider import get_ai_provider


class EvaluationService:
    @staticmethod
    async def evaluate_answer(request: EvaluationRequest) -> EvaluationResponse:
        provider = get_ai_provider()
        return await provider.evaluate_answer(
            question=request.question,
            expected_concepts=request.expectedConcepts,
            student_answer=request.studentAnswer,
            technology=request.technology
        )
