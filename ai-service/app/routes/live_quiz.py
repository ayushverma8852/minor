import json
import logging
import os
import random
import re
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from groq import Groq
from pydantic import BaseModel, Field

load_dotenv()

logger = logging.getLogger("ai_service.live_quiz")

router = APIRouter(prefix="/api/v1/live-quiz", tags=["Live Quiz"])

# Best models for this job, in order. Only the ones your Groq key can actually use are tried.
# To force a model first, set GROQ_QUIZ_MODEL=model-name in ai-service/.env
PREFERRED_ORDER = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "moonshotai/kimi-k2-instruct",
    "qwen/qwen3-32b",
    "llama-3.1-8b-instant",
]
# Models that are not text chat models
NON_CHAT_KEYWORDS = (
    "whisper", "tts", "orpheus", "guard", "safeguard", "playai",
    "embed", "compound", "distil-whisper",
)
MAX_MODELS_TO_TRY = 4

_models_cache: Optional[List[str]] = None

# Question 1 is the easiest, question 5 is the hardest
LEVELS = [
    ("Beginner", "basic definitions and syntax that anyone starting the topic should know"),
    ("Easy", "core concepts applied in a simple, direct situation"),
    ("Intermediate", "how things work internally, common pitfalls, or reading a short code snippet"),
    ("Advanced", "tricky edge cases, performance trade-offs, or predicting the output of non-obvious code"),
    ("Expert", "deep internals and subtle gotchas that combine several concepts; hard even for experienced developers"),
]

SYSTEM_PROMPT = (
    "You are a technical interviewer creating a multiple-choice quiz question. "
    "Write ONE concise question on the user's topic with exactly 4 answer options. "
    "Exactly one option is correct; the other three must be plausible but wrong. "
    "Keep the question and every option on a single line of plain text. If you must show code, "
    "write it inline on one line, use single quotes instead of double quotes inside it, and do not "
    "use backticks, code blocks or line breaks. "
    "Respond with ONLY a JSON object, no markdown, in this exact shape: "
    '{"question": "...", "options": ["...", "...", "...", "..."], '
    '"correct_index": 0, "explanation": "one or two sentences on why the answer is correct"}'
)


class LiveQuestionRequest(BaseModel):
    topic: str
    previous_questions: Optional[List[str]] = []
    question_number: int = Field(1, ge=1, le=5)
    total_questions: int = Field(5, ge=1, le=5)


def _get_models(client: Groq) -> List[str]:
    """Ask Groq which models this API key can use, then order them by preference."""
    global _models_cache
    if _models_cache:
        return _models_cache

    forced = os.getenv("GROQ_QUIZ_MODEL", "").strip()

    try:
        available = [m.id for m in client.models.list().data]
    except Exception as e:  # noqa: BLE001
        logger.warning("Could not list Groq models, using defaults: %s", e)
        available = []

    chat_models = [
        m for m in available if not any(k in m.lower() for k in NON_CHAT_KEYWORDS)
    ]

    ordered = [m for m in PREFERRED_ORDER if m in chat_models]
    ordered += [m for m in chat_models if m not in ordered]

    if forced:
        ordered = [forced] + [m for m in ordered if m != forced]

    if not ordered:  # model list unavailable: fall back to the known defaults
        ordered = PREFERRED_ORDER[:3]

    ordered = ordered[:MAX_MODELS_TO_TRY]
    if available:  # only cache a real answer from Groq
        _models_cache = ordered
    logger.info("Live quiz will use models in this order: %s", ordered)
    return ordered


def _parse_json(text: str) -> dict:
    """Parse the model output, tolerating fences, <think> blocks and raw line breaks in strings."""
    text = (text or "").strip()
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.MULTILINE).strip()
    try:
        return json.loads(text, strict=False)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0), strict=False)


def _validate(data: dict) -> dict:
    question = str(data.get("question", "")).strip()
    options = [str(o).strip() for o in data.get("options", [])]
    correct_index = data.get("correct_index")
    explanation = str(data.get("explanation", "")).strip()

    if (
        not question
        or len(options) != 4
        or len(set(options)) != 4
        or not isinstance(correct_index, int)
        or not 0 <= correct_index < 4
    ):
        raise ValueError("The AI returned an invalid quiz format.")

    return {
        "question": question,
        "options": options,
        "correct_index": correct_index,
        "explanation": explanation,
    }


def _ask_model(client: Groq, messages: list) -> dict:
    """Try each usable model; for each, JSON mode first, then plain text."""
    last_error = None

    for model in _get_models(client):
        for use_json_mode in (True, False):
            try:
                kwargs = dict(model=model, messages=messages, temperature=0.8)
                if use_json_mode:
                    kwargs["response_format"] = {"type": "json_object"}

                completion = client.chat.completions.create(**kwargs)
                data = _parse_json(completion.choices[0].message.content)
                return _validate(data)
            except Exception as e:  # noqa: BLE001 - try the next option on any failure
                last_error = e
                logger.warning(
                    "Live quiz attempt failed (model=%s, json_mode=%s): %s",
                    model,
                    use_json_mode,
                    e,
                )

    raise last_error


@router.get("/models")
def list_quiz_models():
    """Debug helper: shows which models the quiz will try, in order."""
    groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is missing.")
    return {"models": _get_models(Groq(api_key=groq_api_key))}


@router.post("/ask")
def generate_live_question(payload: LiveQuestionRequest):
    groq_api_key = os.getenv("GROQ_API_KEY", "").strip()

    if not groq_api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is missing in your ai-service/.env file.",
        )
    if not payload.topic.strip():
        raise HTTPException(status_code=400, detail="Topic is required.")

    level_name, level_desc = LEVELS[payload.question_number - 1]

    avoid_text = (
        f" Do not repeat or closely paraphrase any of these earlier questions: {payload.previous_questions}."
        if payload.previous_questions
        else ""
    )

    user_prompt = (
        f"Topic: {payload.topic}. "
        f"This is question {payload.question_number} of {payload.total_questions}, "
        f"and the quiz must get harder with every question. "
        f"Difficulty for this question: {level_name} ({level_desc})."
        f"{avoid_text}"
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]

    try:
        client = Groq(api_key=groq_api_key)
        quiz = _ask_model(client, messages)

        # Shuffle so the correct answer is not always in the same position
        correct_text = quiz["options"][quiz["correct_index"]]
        random.shuffle(quiz["options"])

        return {
            "question": quiz["question"],
            "options": quiz["options"],
            "correct_index": quiz["options"].index(correct_text),
            "explanation": quiz["explanation"],
            "level": level_name,
            "question_number": payload.question_number,
        }
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail="Could not generate a valid question right now. Please click again. "
            f"({str(e)[:200]})",
        )
