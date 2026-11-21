from typing import List
from app.models.question import QuestionGenerateRequest, QuestionItem
from app.services.ai_provider import get_ai_provider


class QuestionService:
    @staticmethod
    async def generate_questions(request: QuestionGenerateRequest) -> List[QuestionItem]:
        provider = get_ai_provider()
        return await provider.generate_questions(
            technology=request.technology,
            difficulty=request.difficulty,
            interview_type=request.interviewType,
            number_of_questions=request.numberOfQuestions
        )
