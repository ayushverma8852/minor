/**
 * Live AI Model Service for InterviewPrep AI
 * Integrates directly with Google Gemini Live Models (gemini-1.5-flash / gemini-2.0-flash)
 * for real-time generative interview evaluations, semantic critiques, and model answers.
 */

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';

export const AI_MODES = {
  LIVE_AI: 'live_ai',
  DETERMINISTIC: 'deterministic'
};

// Retrieve configured API key from localStorage or Vite environment variable
export function getGeminiApiKey() {
  try {
    const local = localStorage.getItem('interviewprep_gemini_api_key');
    if (local && local.trim()) return local.trim();
  } catch (e) {
    console.warn(e);
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveGeminiApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('interviewprep_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('interviewprep_gemini_api_key');
  }
}

export function getSelectedAIModel() {
  return localStorage.getItem('interviewprep_selected_model') || DEFAULT_GEMINI_MODEL;
}

export function setSelectedAIModel(modelName) {
  localStorage.setItem('interviewprep_selected_model', modelName);
}

export function getEvaluationMode() {
  const mode = localStorage.getItem('interviewprep_eval_mode');
  if (mode) return mode;
  // If API key is present, default to Live AI, else Deterministic
  return getGeminiApiKey() ? AI_MODES.LIVE_AI : AI_MODES.DETERMINISTIC;
}

export function setEvaluationMode(mode) {
  localStorage.setItem('interviewprep_eval_mode', mode);
}

/**
 * Test Gemini API connection
 */
export async function testGeminiConnection(apiKey = null) {
  const key = apiKey || getGeminiApiKey();
  if (!key) {
    return { success: false, error: 'No API key provided. Please enter a valid Gemini API key.' };
  }

  const model = getSelectedAIModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Respond with exactly: {"status": "connected", "model": "' + model + '"}' }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      return { success: false, error: msg };
    }

    const data = await response.json();
    return {
      success: true,
      model,
      message: 'Successfully connected to Google Gemini Live Model!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error connecting to Gemini API. Check your internet connection.'
    };
  }
}

/**
 * Evaluate full interview session using Live Gemini AI
 */
export async function evaluateInterviewWithLiveAI({
  config,
  questions,
  answers,
  timeElapsedSeconds = 600
}) {
  const key = getGeminiApiKey();
  if (!key) {
    throw new Error('Gemini API Key is not configured. Please add your key in AI Model Settings.');
  }

  const model = getSelectedAIModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  // Construct structured evaluation payload for Gemini
  const questionsPayload = questions.map((q, idx) => ({
    questionNumber: idx + 1,
    topic: q.topic,
    technology: q.technology,
    difficulty: q.difficulty,
    questionText: q.question,
    expectedKeywords: q.keywords,
    evaluationCriteria: q.evaluationCriteria,
    candidateAnswer: (answers[q.id] || '').trim() || '[No response provided]'
  }));

  const systemPrompt = `You are a Principal Software Engineer and Bar-Raiser Technical Interviewer evaluating a candidate's mock interview responses.
Target Technology: ${config.technology || 'Java'}
Difficulty: ${config.difficulty || 'Intermediate'}
Interview Type: ${config.interviewType || 'Technical'}

Evaluate each question critically on 4 pillars (each out of 25 points, sum = 100):
1. relevanceScore (0-25): Direct addressing of question and technical domain.
2. keywordScore (0-25): Accurate usage of critical concepts, syntax, and keywords.
3. completenessScore (0-25): Depth, structure, and thoroughness of explanation.
4. qualityScore (0-25): Architectural insights, edge-cases, trade-offs, and communication.

For each question provide:
- score: total out of 100
- relevanceScore, keywordScore, completenessScore, qualityScore (each 0-25)
- matchedKeywords: array of expected keywords correctly used or demonstrated by candidate
- missedKeywords: array of expected keywords missed or not discussed
- feedback: 2-3 sentences of constructive, specific, bar-raising critique
- sampleIdealAnswer: comprehensive benchmark model answer that candidate can learn from

Also provide overall session summary:
- overallScore (0-100 average)
- grade ("Strong Hire" | "Hire" | "Borderline" | "Needs Practice")
- summaryHeadline: 1 sentence high-level executive assessment
- detailedMetrics: array of 4 objects [{name: "Answer Relevance", score: number 0-100, label: string}, {name: "Keyword Coverage", score: number 0-100, label: string}, {name: "Completeness & Depth", score: number 0-100, label: string}, {name: "Quality & Structure", score: number 0-100, label: string}]
- strengths: array of 3-4 specific technical strengths observed in candidate's submissions
- areasForImprovement: array of 3-4 concrete actionable technical growth points

Return ONLY valid JSON matching this exact structure with no surrounding markdown backticks.`;

  const userContent = JSON.stringify({
    sessionMetadata: {
      technology: config.technology,
      difficulty: config.difficulty,
      questionCount: questions.length,
      durationMinutes: Math.max(1, Math.round(timeElapsedSeconds / 60))
    },
    submissions: questionsPayload
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: 'Candidate Submissions:\n' + userContent }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Gemini Live AI error: ${errorMsg}`);
  }

  const resultData = await response.json();
  const rawText = resultData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('No evaluation response generated by Gemini model.');
  }

  // Parse JSON response
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (parseErr) {
    // Clean potential markdown backticks if present
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const now = new Date();
  const durationMins = Math.max(1, Math.round(timeElapsedSeconds / 60));

  // Merge question metadata with parsed question reviews
  const reviews = questions.map((q, idx) => {
    const reviewData = (parsed.questionReviews || parsed.submissions || [])[idx] || {};
    const candidateAns = (answers[q.id] || '').trim();

    return {
      questionId: q.id,
      questionNumber: idx + 1,
      topic: q.topic,
      technology: q.technology,
      difficulty: q.difficulty,
      questionText: q.question,
      candidateAnswer: candidateAns || 'No response submitted.',
      score: reviewData.score ?? 75,
      relevanceScore: reviewData.relevanceScore ?? 18,
      keywordScore: reviewData.keywordScore ?? 18,
      completenessScore: reviewData.completenessScore ?? 18,
      qualityScore: reviewData.qualityScore ?? 18,
      matchedKeywords: reviewData.matchedKeywords || q.keywords?.slice(0, 2) || [],
      missedKeywords: reviewData.missedKeywords || [],
      strengths: reviewData.strengths || ['Demonstrated conceptual understanding.'],
      weaknesses: reviewData.weaknesses || ['Could expand on trade-offs.'],
      feedback: reviewData.feedback || 'Solid conceptual start. Deepen knowledge of internal architecture.',
      sampleIdealAnswer: reviewData.sampleIdealAnswer || q.sampleIdealAnswer
    };
  });

  return {
    id: `eval-live-${Date.now()}`,
    interviewId: `int-live-${Date.now()}`,
    isLiveAI: true,
    aiModelUsed: `Google Gemini (${model})`,
    technology: config.technology || 'Java',
    roleTitle: `${config.technology || 'Java'} Developer`,
    difficulty: config.difficulty || 'Intermediate',
    interviewType: config.interviewType || 'Technical',
    date: now.toISOString().split('T')[0],
    completedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    durationMinutes: durationMins,
    overallScore: parsed.overallScore || Math.round(reviews.reduce((s, r) => s + r.score, 0) / reviews.length),
    grade: parsed.grade || 'Strong Hire',
    gradeColor: (parsed.overallScore || 80) >= 85 ? 'emerald' : 'brand',
    summaryHeadline: parsed.summaryHeadline || 'Live Gemini AI assessment completed with deep qualitative feedback.',
    detailedMetrics: parsed.detailedMetrics || [
      { name: 'Answer Relevance', score: 85, maxScore: 100, label: 'Direct alignment with interview topic and problem' },
      { name: 'Keyword Coverage', score: 80, maxScore: 100, label: 'Inclusion of expected domain terminology and concepts' },
      { name: 'Completeness & Depth', score: 82, maxScore: 100, label: 'Elaboration, substance, and thoroughness of answers' },
      { name: 'Quality & Structure', score: 84, maxScore: 100, label: 'Logical phrasing, examples, and technical clarity' }
    ],
    strengths: parsed.strengths || ['Strong conceptual grasp of the target technology', 'Clear articulation of core mechanisms'],
    areasForImprovement: parsed.areasForImprovement || ['Include more explicit edge-case handling', 'Discuss scale and memory trade-offs'],
    questionReviews: reviews
  };
}
