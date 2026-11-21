import React, { createContext, useContext, useState, useEffect } from 'react';
import { getQuestionsForInterview, ALL_INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { evaluateInterviewSession } from '../utils/evaluatorEngine';
import {
  evaluateInterviewWithLiveAI,
  getEvaluationMode,
  getGeminiApiKey,
  AI_MODES
} from '../services/aiService';
import { interviewService } from '../services/interviewService';
import { evaluationService } from '../services/evaluationService';
import { historyService } from '../services/historyService';
import { useAuth } from './AuthContext';

const InterviewContext = createContext(null);

const DEFAULT_CONFIG = {
  technology: 'Java',
  difficulty: 'Intermediate',
  questionCount: 5,
  interviewType: 'Technical',
  roleTitle: 'Java Developer'
};

export function InterviewProvider({ children }) {
  const { user } = useAuth();
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

  const getUserHistoryKey = (u) => {
    if (!u) return 'interviewprep_history_guest';
    return `interviewprep_history_${u.email || u.id || 'user'}`;
  };

  const getUserEvalKey = (u) => {
    if (!u) return 'interviewprep_latest_eval_guest';
    return `interviewprep_latest_eval_${u.email || u.id || 'user'}`;
  };

  // State strictly initialized as empty (zero) for all new sessions
  const [history, setHistory] = useState([]);
  const [latestEvaluation, setLatestEvaluation] = useState(null);

  // 1. One-time purge of legacy mock seed records from localStorage
  useEffect(() => {
    try {
      const legacy = localStorage.getItem('interviewprep_history');
      if (legacy && (legacy.includes('int-2026-001') || legacy.includes('int-2026-002') || legacy.includes('Alex Morgan') || legacy.includes('int-2026-'))) {
        localStorage.removeItem('interviewprep_history');
      }
      const legacyEval = localStorage.getItem('interviewprep_latest_evaluation');
      if (legacyEval && (legacyEval.includes('int-2026-001') || legacyEval.includes('int-2026-002'))) {
        localStorage.removeItem('interviewprep_latest_evaluation');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // 2. Load user-specific history whenever active user changes
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLatestEvaluation(null);
      return;
    }

    const key = getUserHistoryKey(user);
    const evalKey = getUserEvalKey(user);

    let initialItems = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Filter out any mock seed items
          initialItems = parsed.filter(item => !String(item.id).startsWith('int-2026-00'));
        }
      }
    } catch (e) {
      console.warn('Failed parsing user history:', e);
    }

    // New user starts at zero
    setHistory(initialItems);

    try {
      const rawEval = localStorage.getItem(evalKey);
      if (rawEval) {
        const parsedEval = JSON.parse(rawEval);
        if (parsedEval && !String(parsedEval.interviewId).startsWith('int-2026-00')) {
          setLatestEvaluation(parsedEval);
        } else {
          setLatestEvaluation(null);
        }
      } else {
        setLatestEvaluation(null);
      }
    } catch (e) {
      setLatestEvaluation(null);
    }

    // Attempt sync with backend for authenticated user
    async function syncBackendUserHistory() {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('interviewprep_jwt');
        if (token) {
          const res = await historyService.getUserHistory();
          if (res && res.data && Array.isArray(res.data)) {
            const filtered = res.data.filter(item => !String(item.id).startsWith('int-2026-00'));
            if (filtered.length > 0) {
              const formatted = filtered.map((item) => ({
                id: item.id,
                technology: item.technology,
                roleTitle: `${item.technology} Developer`,
                date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : (item.date || 'Today'),
                timeAgo: 'Recent',
                difficulty: item.difficulty,
                interviewType: item.interviewType,
                questionCount: item.totalQuestions || 5,
                durationMinutes: 15,
                score: item.totalScore || item.score || 0,
                overallScore: item.totalScore || item.score || 0,
                grade: (item.totalScore || 0) >= 80 ? 'Strong Hire' : (item.totalScore || 0) >= 60 ? 'Hire' : 'Needs Practice',
                gradeColor: (item.totalScore || 0) >= 80 ? 'emerald' : 'brand',
                strengths: item.strengths || [],
                areasForImprovement: item.areasForImprovement || [],
                topicsCovered: item.topicsCovered || []
              }));
              setHistory(formatted);
              localStorage.setItem(key, JSON.stringify(formatted));
            } else if (!initialItems.length) {
              // New user has 0 interviews in database
              setHistory([]);
              localStorage.setItem(key, JSON.stringify([]));
            }
          }
        }
      } catch (err) {
        console.warn('Backend history sync skipped:', err.message);
      }
    }

    syncBackendUserHistory();
  }, [user?.email, user?.id]);

  // 3. Persist history to user-specific storage whenever it updates
  useEffect(() => {
    if (user) {
      const key = getUserHistoryKey(user);
      try {
        localStorage.setItem(key, JSON.stringify(history));
      } catch (e) {
        console.error(e);
      }
    }
  }, [history, user]);

  // 4. Persist latest evaluation to user-specific storage
  useEffect(() => {
    if (user && latestEvaluation) {
      const evalKey = getUserEvalKey(user);
      try {
        localStorage.setItem(evalKey, JSON.stringify(latestEvaluation));
      } catch (e) {
        console.error(e);
      }
    }
  }, [latestEvaluation, user]);

  // Start interview with selected configuration
  const startInterview = async (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    let questions = getQuestionsForInterview({
      technology: updatedConfig.technology,
      difficulty: updatedConfig.difficulty,
      questionCount: Number(updatedConfig.questionCount) || 5,
      interviewType: updatedConfig.interviewType || 'Technical'
    });

    let backendId = null;
    try {
      const res = await interviewService.createInterview({
        technology: updatedConfig.technology,
        difficulty: updatedConfig.difficulty,
        interviewType: updatedConfig.interviewType || 'Technical',
        numberOfQuestions: Number(updatedConfig.questionCount) || 5
      });
      if (res && res.id) {
        backendId = res.id;
        if (res.questions && res.questions.length > 0) {
          questions = res.questions.map((q, idx) => ({
            id: q.id || idx + 1,
            question: q.questionText,
            topic: q.topic || updatedConfig.technology,
            difficulty: q.difficulty || updatedConfig.difficulty,
            expectedConcepts: q.expectedConcepts
              ? Array.isArray(q.expectedConcepts)
                ? q.expectedConcepts
                : q.expectedConcepts.split(',')
              : [],
            sampleIdealAnswer: q.sampleIdealAnswer || '',
            hint: q.expectedConcepts
              ? `Focus on: ${Array.isArray(q.expectedConcepts) ? q.expectedConcepts.join(', ') : q.expectedConcepts}`
              : 'Explain principles and real-world application'
          }));
        }
      }
    } catch (e) {
      console.warn('Backend createInterview fallback to local bank:', e);
    }

    setActiveSession({
      backendId,
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
    setActiveSession((prev) => {
      if (prev.backendId) {
        interviewService.submitAnswer(prev.backendId, questionId, answerText).catch((e) => console.warn(e));
      }
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answerText
        }
      };
    });
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

  // Complete interview: Run Spring Boot -> FastAPI AI Microservice, or Live Gemini, or Deterministic scoring
  const completeInterview = async () => {
    const mode = getEvaluationMode();
    const hasKey = Boolean(getGeminiApiKey());
    let evaluation;

    // 1. If backend interview session exists, complete via backend + FastAPI AI microservice
    if (activeSession.backendId) {
      try {
        await interviewService.completeInterview(activeSession.backendId);
        const evalRes = await evaluationService.getInterviewResults(activeSession.backendId);
        if (evalRes && evalRes.questions && evalRes.questions.length > 0) {
          const overallScore = evalRes.overallScore || 0;
          const detailedReviews = evalRes.questions.map((q, idx) => ({
            questionNumber: idx + 1,
            questionId: q.questionId,
            topic: q.topic || config.technology,
            difficulty: q.difficulty || config.difficulty,
            questionText: q.questionText,
            candidateAnswer: q.studentAnswer || '[No response provided]',
            score: q.score || 0,
            correctnessScore: q.correctness || 0,
            relevanceScore: q.relevance || 0,
            completenessScore: q.completeness || 0,
            matchedKeywords: q.matchedConcepts || [],
            missedKeywords: q.missedConcepts || [],
            strengths: q.strengths || [],
            weaknesses: q.weaknesses || [],
            improvements: q.improvementSuggestions || [],
            sampleIdealAnswer: q.modelAnswer || '',
            feedback: q.explanation || 'Evaluated by AI Service'
          }));

          evaluation = {
            interviewId: `int-${activeSession.backendId}`,
            date: new Date().toISOString().split('T')[0],
            technology: config.technology,
            difficulty: config.difficulty,
            interviewType: config.interviewType,
            questionCount: activeSession.questions.length,
            durationMinutes: Math.max(1, Math.round((activeSession.timeElapsed || 300) / 60)),
            overallScore,
            grade: overallScore >= 85 ? 'Strong Hire' : overallScore >= 70 ? 'Hire' : overallScore >= 50 ? 'Borderline' : 'Needs Practice',
            gradeColor: overallScore >= 85 ? 'emerald' : overallScore >= 70 ? 'brand' : overallScore >= 50 ? 'amber' : 'rose',
            isLiveAI: true,
            aiModelUsed: 'FastAPI AI Microservice (LLM/Deterministic)',
            detailedMetrics: [
              { name: 'Answer Relevance', score: Math.round(evalRes.questions.reduce((a, b) => a + (b.relevance || 0), 0) / evalRes.questions.length), maxScore: 100, label: 'Direct alignment with question topic' },
              { name: 'Technical Correctness', score: Math.round(evalRes.questions.reduce((a, b) => a + (b.correctness || 0), 0) / evalRes.questions.length), maxScore: 100, label: 'Technical precision and mechanics' },
              { name: 'Completeness & Depth', score: Math.round(evalRes.questions.reduce((a, b) => a + (b.completeness || 0), 0) / evalRes.questions.length), maxScore: 100, label: 'Elaboration and coverage' },
              { name: 'Quality & Structure', score: overallScore, maxScore: 100, label: 'Logical phrasing and explanation' }
            ],
            strengths: evalRes.overallStrengths && evalRes.overallStrengths.length > 0 ? evalRes.overallStrengths : ['Demonstrated good understanding of the core subject.'],
            areasForImprovement: evalRes.overallWeaknesses && evalRes.overallWeaknesses.length > 0 ? evalRes.overallWeaknesses : ['Review edge cases and implementation nuances.'],
            questionReviews: detailedReviews
          };
        }
      } catch (backendErr) {
        console.warn('Backend evaluation call fallback to client engine:', backendErr);
      }
    }

    // 2. Client-side evaluation fallback if backend did not produce evaluation
    if (!evaluation) {
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
    }

    // Save to latest evaluation
    setLatestEvaluation(evaluation);

    // Add to history
    const historyItem = {
      id: evaluation.interviewId || `int-${Date.now()}`,
      technology: config.technology,
      roleTitle: `${config.technology} Developer`,
      date: evaluation.date || new Date().toISOString().split('T')[0],
      timeAgo: 'Just now',
      difficulty: config.difficulty,
      interviewType: config.interviewType,
      questionCount: activeSession.questions.length,
      durationMinutes: evaluation.durationMinutes || 15,
      score: evaluation.overallScore,
      grade: evaluation.grade,
      isLiveAI: evaluation.isLiveAI,
      aiModelUsed: evaluation.aiModelUsed,
      topicsCovered: activeSession.questions.map(q => q.topic || config.technology),
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
    historyService.deleteHistoryItem(id).catch(e => console.warn(e));
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
    setLatestEvaluation(null);
    if (user) {
      try {
        localStorage.removeItem(getUserHistoryKey(user));
        localStorage.removeItem(getUserEvalKey(user));
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem('interviewprep_history');
    localStorage.removeItem('interviewprep_latest_evaluation');
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
