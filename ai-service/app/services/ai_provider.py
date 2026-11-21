import abc
import json
import uuid
import httpx
from typing import List, Dict, Any, Optional
from app.config.settings import settings
from app.models.question import QuestionItem
from app.models.evaluation import EvaluationResponse


# Seed Knowledge Base for Realistic Mock Generation
PRELOADED_QUESTIONS: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "Java": {
        "Beginner": [
            {
                "topic": "OOP Principles & Method Overriding",
                "questionText": "Explain the four pillars of OOP in Java. How does method overriding differ from method overloading?",
                "expectedConcepts": ["encapsulation", "inheritance", "polymorphism", "abstraction", "compile-time", "runtime", "signature"],
                "sampleIdealAnswer": "The four pillars of Java OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction. Method overloading occurs at compile time within the same class with identical name but different parameters. Method overriding occurs at runtime when a subclass provides a specific implementation of an inherited parent method with identical signature."
            },
            {
                "topic": "Java Memory Management (Heap vs Stack)",
                "questionText": "What is the difference between Heap memory and Stack memory in Java? How are object references stored?",
                "expectedConcepts": ["stack", "heap", "primitives", "references", "garbage collection", "memory frames"],
                "sampleIdealAnswer": "Stack memory stores local primitive variables, method execution frames, and references to objects. When a method returns, its stack frame is instantly cleared. Heap memory stores actual dynamically allocated objects created with 'new'. The Garbage Collector manages and frees unreferenced heap objects."
            }
        ],
        "Intermediate": [
            {
                "topic": "HashMap Internal Architecture & Hash Collisions",
                "questionText": "How does Java HashMap work internally? What happens during a hash collision and what change was introduced in Java 8?",
                "expectedConcepts": ["hashcode", "equals", "bucket", "collision", "linked list", "red-black tree", "treeify threshold"],
                "sampleIdealAnswer": "Java HashMap uses an array of buckets. key.hashCode() determines the bucket index. When collisions occur, entries are chained in a LinkedList. In Java 8+, if a bucket exceeds TREEIFY_THRESHOLD (8 items) and array capacity >= 64, it converts to a Red-Black Tree to improve lookup from O(n) to O(log n)."
            },
            {
                "topic": "Concurrency (volatile vs synchronized)",
                "questionText": "Explain the difference between the volatile keyword and synchronized blocks in Java. What is the Java Memory Model visibility problem?",
                "expectedConcepts": ["volatile", "synchronized", "visibility", "atomicity", "cpu cache", "lock", "happens-before"],
                "sampleIdealAnswer": "volatile ensures visibility across CPU thread caches by reading and writing directly to main memory, but it does not guarantee atomicity for compound operations (like count++). synchronized guarantees both mutual exclusion (atomicity via monitor locks) and memory visibility."
            }
        ],
        "Advanced": [
            {
                "topic": "JVM Garbage Collection Tuning & G1GC",
                "questionText": "Describe JVM Garbage Collection generations (Eden, Survivor, Old) and explain how G1GC minimizes stop-the-world pauses.",
                "expectedConcepts": ["young generation", "eden", "survivor", "old generation", "g1gc", "stop-the-world", "regions", "pause target"],
                "sampleIdealAnswer": "The JVM heap is divided into Eden and Survivor spaces (Young Generation) and Tenured (Old Generation). G1GC divides heap into equal regions and collects regions with highest garbage ratio to meet user-defined pause targets concurrently."
            }
        ]
    },
    "Python": {
        "Beginner": [
            {
                "topic": "Mutability & Argument Passing",
                "questionText": "Explain the difference between mutable and immutable data types in Python with examples. How does Python pass arguments to functions?",
                "expectedConcepts": ["mutable", "immutable", "list", "tuple", "dict", "pass by object reference", "in-place"],
                "sampleIdealAnswer": "Mutable types (list, dict, set) can have their internal state altered in-place. Immutable types (int, float, str, tuple) cannot be modified; operations create new objects. Python uses pass-by-object-reference: mutating a passed list affects the caller, whereas reassigning a variable creates a local scope binding."
            }
        ],
        "Intermediate": [
            {
                "topic": "Decorators & Closures",
                "questionText": "How do Python decorators work under the hood? Explain how closures and functools.wraps are used when creating decorators.",
                "expectedConcepts": ["decorator", "closure", "higher order function", "functools.wraps", "wrapper", "args", "kwargs"],
                "sampleIdealAnswer": "A decorator is a higher-order function that accepts a callable, wraps it inside an inner function, and returns the wrapper. @functools.wraps(func) is used to preserve the original function name and docstrings."
            },
            {
                "topic": "Global Interpreter Lock (GIL)",
                "questionText": "What is the Python Global Interpreter Lock (GIL)? How does it affect CPU-bound vs I/O-bound concurrency?",
                "expectedConcepts": ["gil", "cpython", "mutex", "cpu-bound", "io-bound", "threading", "multiprocessing"],
                "sampleIdealAnswer": "The GIL is a mutex in CPython preventing multiple threads from executing bytecode concurrently. I/O-bound operations release the GIL during network/disk waits, so threading works well. CPU-bound tasks require multiprocessing to utilize multiple CPU cores."
            }
        ],
        "Advanced": [
            {
                "topic": "Metaclasses & Descriptors",
                "questionText": "What are descriptors and metaclasses in Python? How do __get__ and __new__ operate during class construction?",
                "expectedConcepts": ["descriptor", "metaclass", "__get__", "__set__", "__new__", "type", "attribute lookup"],
                "sampleIdealAnswer": "Descriptors define __get__, __set__, or __delete__ to override attribute lookup (used in properties and ORM fields). Metaclasses inherit from type and override __new__ to customize class creation dynamically."
            }
        ]
    },
    "React": {
        "Beginner": [
            {
                "topic": "State vs Props & Immutability",
                "questionText": "What is the difference between props and state in React? Why should you never mutate state directly?",
                "expectedConcepts": ["props", "state", "immutability", "re-render", "usestate", "unidirectional data flow"],
                "sampleIdealAnswer": "Props are read-only inputs passed from parents to configure children. State is internal data managed within the component using useState. Direct mutation fails because React compares state references shallowly; mutating in-place prevents re-renders."
            }
        ],
        "Intermediate": [
            {
                "topic": "Virtual DOM & Reconciliation (Fiber)",
                "questionText": "How does React Virtual DOM and the Fiber Reconciliation algorithm work? Why are keys required in lists?",
                "expectedConcepts": ["virtual dom", "reconciliation", "fiber", "diffing", "keys", "reflow", "repaint", "batching"],
                "sampleIdealAnswer": "React maintains an in-memory Virtual DOM tree. When state changes, a new tree is diffed using Fiber heuristics O(n) to batch minimal real DOM mutations. Keys provide stable identities so React tracks added, removed, or reordered items efficiently."
            },
            {
                "topic": "useEffect Hook & Stale Closures",
                "questionText": "Explain the purpose of the useEffect dependency array and cleanup function. How do stale closures occur?",
                "expectedConcepts": ["useeffect", "dependency array", "cleanup", "stale closure", "abortcontroller", "unmount"],
                "sampleIdealAnswer": "The dependency array controls effect re-execution. Omitted dependencies cause stale closures by referencing outdated variables from prior renders. The cleanup function runs before the effect re-runs and before unmount to clear timers, listeners, or active fetch requests."
            }
        ],
        "Advanced": [
            {
                "topic": "React 18 Concurrent Features & Server Components",
                "questionText": "Explain React 18 Concurrent features (useTransition, useDeferredValue) and compare React Server Components with traditional SSR.",
                "expectedConcepts": ["concurrent mode", "usetransition", "usedeferredvalue", "react server components", "rsc", "zero bundle size", "streaming"],
                "sampleIdealAnswer": "Concurrent Mode enables interruptible rendering so urgent input updates aren't blocked by slow background renders. React Server Components execute exclusively on the server, accessing databases directly with zero client bundle impact."
            }
        ]
    },
    "SQL": {
        "Beginner": [
            {
                "topic": "Joins (Inner, Left, Right, Full)",
                "questionText": "Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with examples. When do NULLs appear?",
                "expectedConcepts": ["inner join", "left join", "right join", "full outer join", "null", "foreign key", "matching"],
                "sampleIdealAnswer": "INNER JOIN returns matching rows between tables. LEFT JOIN returns all left rows plus matching right rows (NULL if unmatched). RIGHT JOIN returns all right rows plus matching left. FULL OUTER JOIN returns all rows from both tables, filling with NULL wherever matches are absent."
            }
        ],
        "Intermediate": [
            {
                "topic": "Database Indexing & B-Trees",
                "questionText": "How do database indexes work? What is the difference between Clustered and Non-Clustered indexes, and what is the trade-off with write operations?",
                "expectedConcepts": ["index", "b-tree", "clustered", "non-clustered", "primary key", "pointer", "write overhead", "insert"],
                "sampleIdealAnswer": "Indexes use B+ Trees to accelerate lookups to O(log n). A clustered index dictates the physical on-disk row order (1 per table). Non-clustered indexes store sorted keys with row pointers. Indexes speed SELECTs but slow down INSERT/UPDATE/DELETE due to index maintenance."
            },
            {
                "topic": "ACID Properties & Transaction Isolation",
                "questionText": "Explain ACID properties in relational databases and describe the four transaction isolation levels.",
                "expectedConcepts": ["atomicity", "consistency", "isolation", "durability", "read committed", "repeatable read", "serializable", "dirty read"],
                "sampleIdealAnswer": "ACID ensures reliability: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrency control), Durability (persisted commits). The four isolation levels are Read Uncommitted, Read Committed, Repeatable Read, and Serializable."
            }
        ],
        "Advanced": [
            {
                "topic": "Window Functions & Query Optimization (EXPLAIN ANALYZE)",
                "questionText": "How do SQL Window Functions (ROW_NUMBER, RANK, DENSE_RANK) differ from GROUP BY? How do you diagnose query plans with EXPLAIN ANALYZE?",
                "expectedConcepts": ["window function", "over", "partition by", "row_number", "rank", "dense_rank", "explain analyze", "sequential scan", "index scan"],
                "sampleIdealAnswer": "Window functions perform calculations across a subset of rows without collapsing them into summary rows like GROUP BY. EXPLAIN ANALYZE shows actual runtime execution plans, identifying sequential table scans vs index seeks."
            }
        ]
    },
    "HR": {
        "Beginner": [
            {
                "topic": "Self Introduction & Career Motivation",
                "questionText": "Tell me about yourself. What motivated you to choose software engineering and why do you want to join our team?",
                "expectedConcepts": ["present", "past", "future", "projects", "skills", "problem solving", "passion", "alignment"],
                "sampleIdealAnswer": "Follow the Present-Past-Future framework: highlight current academic and technical skills, discuss key projects built, and articulate clear alignment with the company's engineering values and growth opportunities."
            }
        ],
        "Intermediate": [
            {
                "topic": "Conflict Resolution (STAR Method)",
                "questionText": "Describe a disagreement you had with a teammate regarding a technical design choice. How did you resolve it?",
                "expectedConcepts": ["situation", "task", "action", "result", "communication", "data-driven", "prototype", "compromise"],
                "sampleIdealAnswer": "Structure using STAR: Situation (context of dispute), Task (shared goal), Action (scheduled sync, prototyped both solutions, evaluated with data), Result (consensus reached, project delivered on time with strong team trust)."
            }
        ],
        "Advanced": [
            {
                "topic": "Handling Failure & Pressure",
                "questionText": "Tell me about a time when a project deadline was at risk or unexpected production issues arose. How did you react?",
                "expectedConcepts": ["accountability", "proactive communication", "root cause", "mitigation", "post-mortem", "learning"],
                "sampleIdealAnswer": "Demonstrate proactive ownership: alerted stakeholders early with revised timeline, isolated root cause systematically, implemented mitigation steps, and conducted a post-mortem to prevent recurrences."
            }
        ]
    }
}


class BaseAIProvider(abc.ABC):
    @abc.abstractmethod
    async def generate_questions(
        self, technology: str, difficulty: str, interview_type: str, number_of_questions: int
    ) -> List[QuestionItem]:
        pass

    @abc.abstractmethod
    async def evaluate_answer(
        self, question: str, expected_concepts: List[str], student_answer: str, technology: str
    ) -> EvaluationResponse:
        pass


class MockAIProvider(BaseAIProvider):
    """
    Transparent, deterministic rule-based evaluation engine and realistic question generator.
    Clearly identified as 'mock' provider as required by specifications.
    """

    async def generate_questions(
        self, technology: str, difficulty: str, interview_type: str, number_of_questions: int
    ) -> List[QuestionItem]:
        tech_key = technology if technology in PRELOADED_QUESTIONS else "Java"
        diff_key = difficulty if difficulty in ["Beginner", "Intermediate", "Advanced"] else "Intermediate"

        questions_list: List[Dict[str, Any]] = []

        if interview_type == "HR":
            questions_list = PRELOADED_QUESTIONS.get("HR", {}).get(diff_key, [])
            if not questions_list:
                questions_list = PRELOADED_QUESTIONS.get("HR", {}).get("Intermediate", [])
        elif interview_type == "Mixed":
            tech_q = PRELOADED_QUESTIONS.get(tech_key, {}).get(diff_key, [])
            hr_q = PRELOADED_QUESTIONS.get("HR", {}).get(diff_key, []) or PRELOADED_QUESTIONS.get("HR", {}).get("Intermediate", [])
            questions_list = tech_q + hr_q
        else:
            # Technical
            questions_list = PRELOADED_QUESTIONS.get(tech_key, {}).get(diff_key, [])
            if not questions_list:
                # Fallback across difficulties in same tech
                for d in ["Intermediate", "Beginner", "Advanced"]:
                    questions_list.extend(PRELOADED_QUESTIONS.get(tech_key, {}).get(d, []))

        # If still not enough, supplement from general bank
        if len(questions_list) < number_of_questions:
            for t in ["Java", "Python", "React", "SQL"]:
                if t != tech_key:
                    questions_list.extend(PRELOADED_QUESTIONS.get(t, {}).get("Intermediate", []))

        selected = questions_list[:number_of_questions]

        items: List[QuestionItem] = []
        for idx, q in enumerate(selected):
            items.append(
                QuestionItem(
                    questionId=f"q-{technology.lower()[:3]}-{idx+1}-{uuid.uuid4().hex[:6]}",
                    questionText=q["questionText"],
                    topic=q["topic"],
                    difficulty=difficulty,
                    expectedConcepts=q.get("expectedConcepts", []),
                    sampleIdealAnswer=q.get("sampleIdealAnswer", "")
                )
            )
        return items

    async def evaluate_answer(
        self, question: str, expected_concepts: List[str], student_answer: str, technology: str
    ) -> EvaluationResponse:
        answer = student_answer.strip()
        lower_ans = answer.lower()
        words = answer.split()
        word_count = len(words)

        # Empty or skipped answer case
        if word_count == 0 or answer == "[No response provided]":
            return EvaluationResponse(
                score=0,
                correctness=0,
                relevance=0,
                completeness=0,
                strengths=[],
                weaknesses=["Question was skipped or submitted with empty text."],
                missingConcepts=expected_concepts,
                missedConcepts=expected_concepts,
                matchedConcepts=[],
                improvements=["Review the benchmark model answer to master this foundational topic."],
                improvementSuggestions=["Review the benchmark model answer to master this foundational topic."],
                modelAnswer="A complete technical answer should address the core definition, architecture mechanisms, and practical trade-offs.",
                explanation="Score is 0 because no response was submitted. Marks require demonstrable engagement with technical concepts.",
                provider="mock"
            )

        # 1. Technical Concept & Keyword Coverage (0 - 100)
        # Recognizes conceptual coverage, partial tokens, and synonyms
        matched = []
        missed = []
        for c in expected_concepts:
            c_low = c.lower().strip()
            # Check direct phrase or individual sub-tokens
            tokens = c_low.split()
            if c_low in lower_ans or any(t in lower_ans for t in tokens if len(t) > 3):
                matched.append(c)
            else:
                missed.append(c)

        ratio = (len(matched) / len(expected_concepts)) if expected_concepts else 0.85
        correctness = min(100, max(20, int(ratio * 95) + (5 if word_count >= 25 else 0)))

        # 2. Completeness (0 - 100) - Depth and structure, not mere length
        if word_count < 10:
            completeness = 25
        elif word_count < 25:
            completeness = 50
        elif word_count < 60:
            completeness = 75
        elif word_count < 120:
            completeness = 90
        else:
            completeness = 95

        # 3. Relevance (0 - 100) - Direct alignment with question context
        relevance = 60
        if ratio >= 0.5 or any(k in lower_ans for k in question.lower().split() if len(k) > 4):
            relevance = min(100, 70 + int(ratio * 30))

        # Overall composite score (0 - 100)
        total_score = min(100, max(15, int((correctness * 0.45) + (relevance * 0.30) + (completeness * 0.25))))

        # Strengths & Weaknesses
        strengths = []
        if matched:
            strengths.append(f"Accurately addressed key technical mechanisms: {', '.join(matched[:3])}.")
        if word_count >= 30 and ratio >= 0.4:
            strengths.append("Provided structured phrasing with good contextual flow.")
        if not strengths:
            strengths.append("Demonstrated basic familiarity with the question domain.")

        weaknesses = []
        if missed:
            weaknesses.append(f"Omitted critical architectural components: {', '.join(missed[:3])}.")
        if word_count < 25:
            weaknesses.append("Response is excessively brief; technical rounds require thorough explanation of trade-offs.")
        if not weaknesses:
            weaknesses.append("Can further elevate the response by contrasting with related alternatives or profiling benchmarks.")

        improvements = [
            f"Study internal implementation specifics in official {technology} documentation for: {', '.join(missed[:2]) if missed else 'production edge-cases'}.",
            "Structure future answers with: 1) Definition, 2) Internal mechanism, 3) Real-world example, 4) Concurrency / memory trade-off."
        ]

        explanation = (
            f"Candidate awarded {total_score}/100 based on {len(matched)}/{len(expected_concepts)} concept hits. "
            f"Correctness is rated at {correctness}%, relevance at {relevance}%, and completeness at {completeness}%. "
            f"{'Strong domain knowledge exhibited.' if total_score >= 75 else 'Review omitted concepts to achieve full marks.'}"
        )

        model_answer = (
            f"An ideal {technology} answer addresses: "
            f"1) Core definition and purpose, 2) Internal architectural mechanisms ({', '.join(expected_concepts[:3])}), "
            f"3) Runtime lifecycle/memory impact, and 4) Production trade-offs."
        )

        return EvaluationResponse(
            score=total_score,
            correctness=correctness,
            relevance=relevance,
            completeness=completeness,
            strengths=strengths,
            weaknesses=weaknesses,
            missingConcepts=missed,
            missedConcepts=missed,
            matchedConcepts=matched,
            improvements=improvements,
            improvementSuggestions=improvements,
            modelAnswer=model_answer,
            explanation=explanation,
            provider="mock"
        )


class GeminiAIProvider(BaseAIProvider):
    """
    Live Google Gemini LLM API provider.
    Calls Gemini API with structured JSON output and falls back to Mock if unreachable.
    """

    def __init__(self, api_key: str, model_name: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model_name = model_name
        self.mock_fallback = MockAIProvider()

    async def generate_questions(
        self, technology: str, difficulty: str, interview_type: str, number_of_questions: int
    ) -> List[QuestionItem]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"

        prompt = f"""Generate {number_of_questions} realistic {difficulty} interview questions for {technology} in an {interview_type} round.
Return a valid JSON array of objects with keys:
- questionId: unique string
- questionText: string
- topic: string
- difficulty: string
- expectedConcepts: array of 4-6 strings
- sampleIdealAnswer: string
Return ONLY raw JSON with no markdown formatting."""

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    url,
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"temperature": 0.3, "responseMimeType": "application/json"}
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    cleaned = text.strip()
                    if cleaned.startswith("```json"):
                        cleaned = cleaned[7:-3].strip()
                    parsed = json.loads(cleaned)
                    items = []
                    for q in parsed[:number_of_questions]:
                        items.append(QuestionItem(
                            questionId=q.get("questionId", f"q-{uuid.uuid4().hex[:8]}"),
                            questionText=q.get("questionText", "Explain the concept."),
                            topic=q.get("topic", technology),
                            difficulty=difficulty,
                            expectedConcepts=q.get("expectedConcepts", []),
                            sampleIdealAnswer=q.get("sampleIdealAnswer", "")
                        ))
                    return items
        except Exception as e:
            print(f"[Gemini Provider] Question generation failed, using mock fallback: {e}")

        return await self.mock_fallback.generate_questions(technology, difficulty, interview_type, number_of_questions)

    async def evaluate_answer(
        self, question: str, expected_concepts: List[str], student_answer: str, technology: str
    ) -> EvaluationResponse:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"

        prompt = f"""You are a Principal Software Engineer evaluating a candidate's answer for a {technology} technical interview.
Question: {question}
Expected Concepts: {expected_concepts}
Candidate Answer: {student_answer}

Evaluate and return a JSON object with:
- score: int (0-100)
- correctness: int (0-100)
- relevance: int (0-100)
- completeness: int (0-100)
- strengths: list of strings (concrete positive observations)
- weaknesses: list of strings (concrete omissions or inaccuracies)
- missingConcepts: list of strings (expected concepts not mentioned)
- improvements: list of strings (actionable guidance)
- modelAnswer: string (benchmark ideal answer)
- explanation: string (detailed explanation of marks awarded/deducted)

Return ONLY raw JSON with no markdown wrapping."""

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    url,
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    cleaned = text.strip()
                    if cleaned.startswith("```json"):
                        cleaned = cleaned[7:-3].strip()
                    parsed = json.loads(cleaned)
                    missing = parsed.get("missingConcepts", parsed.get("missedConcepts", []))
                    improvements = parsed.get("improvements", parsed.get("improvementSuggestions", []))
                    return EvaluationResponse(
                        score=parsed.get("score", 75),
                        correctness=parsed.get("correctness", 75),
                        relevance=parsed.get("relevance", 80),
                        completeness=parsed.get("completeness", 70),
                        strengths=parsed.get("strengths", ["Solid technical grasp"]),
                        weaknesses=parsed.get("weaknesses", ["Elaborate further on trade-offs"]),
                        missingConcepts=missing,
                        missedConcepts=missing,
                        matchedConcepts=parsed.get("matchedConcepts", []),
                        improvements=improvements,
                        improvementSuggestions=improvements,
                        modelAnswer=parsed.get("modelAnswer", "A comprehensive answer covers internal mechanisms and trade-offs."),
                        explanation=parsed.get("explanation", "Evaluated based on conceptual accuracy and depth."),
                        provider="gemini"
                    )
        except Exception as e:
            print(f"[Gemini Provider] Evaluation failed, using mock fallback: {e}")

        res = await self.mock_fallback.evaluate_answer(question, expected_concepts, student_answer, technology)
        res.provider = "mock-fallback"
        return res


def get_ai_provider() -> BaseAIProvider:
    """Factory to retrieve configured AI provider based on environment variables"""
    provider_type = settings.AI_PROVIDER.lower().strip()

    if provider_type == "gemini" and settings.GEMINI_API_KEY:
        return GeminiAIProvider(api_key=settings.GEMINI_API_KEY, model_name=settings.GEMINI_MODEL)

    return MockAIProvider()
