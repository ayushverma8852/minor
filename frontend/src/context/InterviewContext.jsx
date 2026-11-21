import React, { createContext, useContext, useState, useEffect } from 'react';
import { getQuestionsForInterview, ALL_INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { evaluateInterviewSession } from '../utils/evaluatorEngine';
import {
  evaluateInterviewWithLiveAI,
  getEvaluationMode,
  getGeminiApiKey,
  AI_MODES
} from '../services/aiService';

const InterviewContext = createContext(null);

const DEFAULT_CONFIG = {
  technology: 'Java',
  difficulty: 'Intermediate',
  questionCount: 5,
  interviewType: 'Technical',
  roleTitle: 'Java Developer'
};

const SEED_HISTORY = [
  {
    id: 'int-2026-001',
    technology: 'Java',
    roleTitle: 'Java Developer',
    date: '2026-11-19',
    timeAgo: '2 days ago',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    questionCount: 5,
    durationMinutes: 18,
    score: 84,
    grade: 'Hire',
    isLiveAI: true,
    aiModelUsed: 'Google Gemini (gemini-1.5-flash)',
    topicsCovered: ['OOP Polymorphism', 'Java Memory (Heap vs Stack)', 'HashMap Internal Working', 'Concurrency volatile', 'JVM Garbage Collection'],
    overallScore: 84,
    gradeColor: 'brand',
    detailedMetrics: [
      { name: 'Answer Relevance', score: 88, maxScore: 100, label: 'Direct alignment with interview topic' },
      { name: 'Keyword Coverage', score: 84, maxScore: 100, label: 'Expected domain terminology' },
      { name: 'Completeness & Depth', score: 80, maxScore: 100, label: 'Elaboration and thoroughness' },
      { name: 'Quality & Structure', score: 84, maxScore: 100, label: 'Logical phrasing and examples' }
    ],
    strengths: [
      'Accurately explained HashMap bucket collision resolution and Java 8 Red-Black Tree treeification.',
      'Clearly distinguished stack frame lifecycle from heap garbage collection.',
      'Strong grasp of volatile visibility versus synchronized mutual exclusion.'
    ],
    areasForImprovement: [
      'Could elaborate on G1GC region allocations and pause targets in JVM tuning.',
      'Include specific code snippets for method overriding @Override annotations.'
    ]
  },
  {
    id: 'int-2026-002',
    technology: 'React',
    roleTitle: 'React Frontend Developer',
    date: '2026-11-16',
    timeAgo: '5 days ago',
    difficulty: 'Beginner',
    interviewType: 'Technical',
    questionCount: 5,
    durationMinutes: 15,
    score: 90,
    grade: 'Strong Hire',
    isLiveAI: false,
    aiModelUsed: 'Deterministic Prototype Engine',
    topicsCovered: ['State vs Props', 'Virtual DOM & Keys', 'useEffect Hook', 'React.memo & useMemo', 'Concurrent Features'],
    overallScore: 90,
    gradeColor: 'emerald',
    detailedMetrics: [
      { name: 'Answer Relevance', score: 92, maxScore: 100, label: 'Direct alignment with interview topic' },
      { name: 'Keyword Coverage', score: 88, maxScore: 100, label: 'Expected domain terminology' },
      { name: 'Completeness & Depth', score: 90, maxScore: 100, label: 'Elaboration and thoroughness' },
      { name: 'Quality & Structure', score: 90, maxScore: 100, label: 'Logical phrasing and examples' }
    ],
    strengths: [
      'Excellent breakdown of shallow reference equality in useState and why direct mutations fail.',
      'Clear articulation of AbortController within useEffect cleanups.',
      'Solid reasoning regarding when NOT to overuse useMemo.'
    ],
    areasForImprovement: [
      'Deepen knowledge on React Server Components (RSC) streaming boundaries.'
    ]
  },
  {
    id: 'int-2026-003',
    technology: 'SQL',
    roleTitle: 'SQL & Database Engineer',
    date: '2026-11-12',
    timeAgo: '1 week ago',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    questionCount: 5,
    durationMinutes: 20,
    score: 78,
    grade: 'Hire',
    isLiveAI: false,
    aiModelUsed: 'Deterministic Prototype Engine',
    topicsCovered: ['SQL Joins', 'WHERE vs HAVING', 'Database Indexing & B-Trees', 'ACID Transactions', 'Window Functions'],
    overallScore: 78,
    gradeColor: 'brand',
    detailedMetrics: [
      { name: 'Answer Relevance', score: 80, maxScore: 100, label: 'Direct alignment with interview topic' },
      { name: 'Keyword Coverage', score: 76, maxScore: 100, label: 'Expected domain terminology' },
      { name: 'Completeness & Depth', score: 78, maxScore: 100, label: 'Elaboration and thoroughness' },
      { name: 'Quality & Structure', score: 78, maxScore: 100, label: 'Logical phrasing and examples' }
    ],
    strengths: [
      'Accurate Venn diagram mental model for LEFT vs FULL OUTER JOINs.',
      'Clear definition of B+ Tree clustered vs non-clustered index write amplification.'
    ],
    areasForImprovement: [
      'Review SQL execution plan optimization with EXPLAIN ANALYZE.',
      'Strengthen distinction between Repeatable Read and Serializable isolation levels.'
    ]
  },
  {
    id: 'int-2026-004',
    technology: 'Python',
    roleTitle: 'Python Developer',
    date: '2026-11-05',
    timeAgo: '2 weeks ago',
    difficulty: 'Intermediate',
    interviewType: 'Technical',
    questionCount: 5,
    durationMinutes: 22,
    score: 82,
    grade: 'Hire',
    isLiveAI: false,
    aiModelUsed: 'Deterministic Prototype Engine',
    topicsCovered: ['Mutability & Passing', 'Comprehensions vs Generators', 'Decorators & Closures', 'GIL & Concurrency', 'Metaclasses'],
    overallScore: 82,
    gradeColor: 'brand',
    detailedMetrics: [
      { name: 'Answer Relevance', score: 84, maxScore: 100, label: 'Direct alignment with interview topic' },
      { name: 'Keyword Coverage', score: 80, maxScore: 100, label: 'Expected domain terminology' },
      { name: 'Completeness & Depth', score: 82, maxScore: 100, label: 'Elaboration and thoroughness' },
      { name: 'Quality & Structure', score: 82, maxScore: 100, label: 'Logical phrasing and examples' }
    ],
    strengths: [
      'Strong explanation of pass-by-object-reference and in-place list mutation.',
      'Good understanding of GIL implications on CPU-bound multiprocessing versus I/O-bound asyncio.'
    ],
    areasForImprovement: [
      'Explain functools.wraps importance when creating production decorators.'
    ]
  }
];

export function InterviewProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const [activeSession, setActiveSession] = useState({
    isActive: false,
    questions: [],
    currentIndex: 0,
    answers: {},
    startedAt: null,
    timeElapsed: 0,
    isSubmitted: false
  });

  // History state synced with LocalStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('interviewprep_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
    return SEED_HISTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem('interviewprep_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history to localStorage', e);
    }
  }, [history]);

  // Latest evaluation state
  const [latestEvaluation, setLatestEvaluation] = useState(() => {
    try {
      const saved = localStorage.getItem('interviewprep_latest_evaluation');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SEED_HISTORY[0];
  });

  useEffect(() => {
    if (latestEvaluation) {
      try {
        localStorage.setItem('interviewprep_latest_evaluation', JSON.stringify(latestEvaluation));
      } catch (e) {
        console.error(e);
      }
    }
  }, [latestEvaluation]);

  // Start interview with selected configuration
  const startInterview = (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    const questions = getQuestionsForInterview({
      technology: updatedConfig.technology,
      difficulty: updatedConfig.difficulty,
      questionCount: Number(updatedConfig.questionCount) || 5,
      interviewType: updatedConfig.interviewType || 'Technical'
    });

    setActiveSession({
      isActive: true,
      questions,
      currentIndex: 0,
      answers: {},
      startedAt: new Date(),
      timeElapsed: 0,
      isSubmitted: false
    });
  };

  const saveAnswer = (questionId, answerText) => {
    setActiveSession(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerText
      }
    }));
  };

  const nextQuestion = () => {
    setActiveSession(prev => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.questions.length - 1)
    }));
  };

  const prevQuestion = () => {
    setActiveSession(prev => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0)
    }));
  };

  const jumpToQuestion = (index) => {
    setActiveSession(prev => ({
      ...prev,
      currentIndex: index
    }));
  };

  // Complete interview: Run Live Gemini AI Model if enabled, or Deterministic scoring
  const completeInterview = async () => {
    const mode = getEvaluationMode();
    const hasKey = Boolean(getGeminiApiKey());
    let evaluation;

    if (mode === AI_MODES.LIVE_AI && hasKey) {
      try {
        evaluation = await evaluateInterviewWithLiveAI({
          config,
          questions: activeSession.questions,
          answers: activeSession.answers,
          timeElapsedSeconds: activeSession.timeElapsed || 600
        });
      } catch (err) {
        console.warn('Live AI Evaluation failed, falling back to Deterministic engine:', err);
        // Fallback with notice
        evaluation = evaluateInterviewSession({
          config,
          questions: activeSession.questions,
          answers: activeSession.answers,
          timeElapsedSeconds: activeSession.timeElapsed || 600
        });
        evaluation.fallbackNotice = `Live AI call encountered an issue (${err.message}). Evaluated using offline deterministic engine.`;
      }
    } else {
      evaluation = evaluateInterviewSession({
        config,
        questions: activeSession.questions,
        answers: activeSession.answers,
        timeElapsedSeconds: activeSession.timeElapsed || 600
      });
      evaluation.isLiveAI = false;
      evaluation.aiModelUsed = 'Deterministic Prototype Engine';
    }

    // Save to latest evaluation
    setLatestEvaluation(evaluation);

    // Add to history
    const historyItem = {
      id: evaluation.interviewId,
      technology: config.technology,
      roleTitle: `${config.technology} Developer`,
      date: evaluation.date,
      timeAgo: 'Just now',
      difficulty: config.difficulty,
      interviewType: config.interviewType,
      questionCount: activeSession.questions.length,
      durationMinutes: evaluation.durationMinutes,
      score: evaluation.overallScore,
      grade: evaluation.grade,
      isLiveAI: evaluation.isLiveAI,
      aiModelUsed: evaluation.aiModelUsed,
      topicsCovered: activeSession.questions.map(q => q.topic),
      overallScore: evaluation.overallScore,
      gradeColor: evaluation.gradeColor,
      detailedMetrics: evaluation.detailedMetrics,
      strengths: evaluation.strengths,
      areasForImprovement: evaluation.areasForImprovement,
      questionReviews: evaluation.questionReviews
    };

    setHistory(prev => [historyItem, ...prev]);

    setActiveSession(prev => ({
      ...prev,
      isActive: false,
      isSubmitted: true
    }));

    return evaluation;
  };

  const loadEvaluation = (evalData) => {
    setLatestEvaluation(evalData);
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('interviewprep_history');
  };

  const resetSession = () => {
    setActiveSession({
      isActive: false,
      questions: [],
      currentIndex: 0,
      answers: {},
      startedAt: null,
      timeElapsed: 0,
      isSubmitted: false
    });
  };

  return (
    <InterviewContext.Provider
      value={{
        config,
        setConfig,
        activeSession,
        setActiveSession,
        latestEvaluation,
        history,
        startInterview,
        saveAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        completeInterview,
        loadEvaluation,
        deleteHistoryItem,
        clearAllHistory,
        resetSession
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
