import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.ai_provider import GeminiAIProvider

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert "uptimeSeconds" in data
    assert data["provider"] in ["mock", "gemini"]


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "/health" in data["endpoints"]["health"]


def test_generate_questions_java():
    payload = {
        "technology": "Java",
        "difficulty": "Intermediate",
        "interviewType": "Technical",
        "numberOfQuestions": 3
    }
    response = client.post("/api/v1/questions/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["technology"] == "Java"
    assert len(data["questions"]) == 3
    first_q = data["questions"][0]
    assert "questionId" in first_q
    assert "questionText" in first_q
    assert "topic" in first_q
    assert isinstance(first_q["expectedConcepts"], list)


def test_generate_questions_python():
    payload = {
        "technology": "Python",
        "difficulty": "Beginner",
        "interviewType": "Technical",
        "numberOfQuestions": 2
    }
    response = client.post("/api/v1/questions/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["questions"]) == 2


def test_evaluate_answer_thorough():
    payload = {
        "question": "What is the difference between HashMap and ConcurrentHashMap?",
        "expectedConcepts": ["thread safety", "synchronization", "segment locking", "performance", "null keys"],
        "studentAnswer": "HashMap is not synchronized and not thread safe. In contrast, ConcurrentHashMap achieves thread safety through segment locking and bucket level synchronization, allowing concurrent reads and writes without locking the whole map.",
        "technology": "Java"
    }
    response = client.post("/api/v1/evaluation/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["score"] <= 100
    assert 0 <= data["correctness"] <= 100
    assert 0 <= data["relevance"] <= 100
    assert 0 <= data["completeness"] <= 100
    assert len(data["strengths"]) > 0
    assert "modelAnswer" in data
    assert "explanation" in data
    assert len(data["matchedConcepts"]) >= 2
    assert "missingConcepts" in data


def test_evaluate_answer_empty():
    payload = {
        "question": "Explain React hooks.",
        "expectedConcepts": ["useState", "useEffect", "lifecycle"],
        "studentAnswer": "",
        "technology": "React"
    }
    response = client.post("/api/v1/evaluation/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 0
    assert len(data["weaknesses"]) > 0


def test_evaluate_invalid_request():
    payload = {
        "question": "",
        "expectedConcepts": ["useState"],
        "studentAnswer": "answer",
        "technology": "React"
    }
    response = client.post("/api/v1/evaluation/evaluate", json=payload)
    assert response.status_code == 400


@pytest.mark.anyio
async def test_gemini_provider_fallback_on_invalid_key():
    provider = GeminiAIProvider(api_key="INVALID_TEST_KEY", model_name="gemini-1.5-flash")
    questions = await provider.generate_questions("Java", "Intermediate", "Technical", 2)
    assert len(questions) == 2
    assert "questionText" in questions[0].model_dump()
