from pydantic import BaseModel, Field
from typing import List, Optional


class QuestionGenerateRequest(BaseModel):
    technology: str = Field(..., description="Target technology (e.g. Java, Python, JavaScript, React, SQL)")
    difficulty: str = Field(default="Intermediate", description="Difficulty level (Beginner, Intermediate, Advanced)")
    interviewType: str = Field(default="Technical", description="Interview round type (Technical, HR, Mixed)")
    numberOfQuestions: int = Field(default=5, ge=1, le=15, description="Number of questions to generate (1-15)")


class QuestionItem(BaseModel):
    questionId: str = Field(..., description="Unique question identifier")
    questionText: str = Field(..., description="The interview question text")
    topic: str = Field(..., description="Conceptual topic or domain")
    difficulty: str = Field(..., description="Assigned difficulty tier")
    expectedConcepts: List[str] = Field(default_factory=list, description="List of expected keywords/concepts")
    sampleIdealAnswer: Optional[str] = Field(default=None, description="Benchmark model answer for review")


class QuestionGenerateResponse(BaseModel):
    status: str = "success"
    provider: str
    technology: str
    difficulty: str
    interviewType: str
    count: int
    questions: List[QuestionItem]
