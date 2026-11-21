import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Flag,
  FileCheck2,
  Send,
  Eye,
  Info,
  ShieldCheck,
  Check,
  Cpu,
  Zap
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Modal from '../../components/common/Modal';
import AIModelModal from '../../components/common/AIModelModal';
import {
  getEvaluationMode,
  getGeminiApiKey,
  getSelectedAIModel,
  AI_MODES
} from '../../services/aiService';

export default function InterviewSession() {
  const navigate = useNavigate();
  const {
    config,
    activeSession,
    saveAnswer,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    completeInterview,
    startInterview
  } = useInterview();

  // If page was reloaded or visited directly without starting
  useEffect(() => {
    if (!activeSession.isActive && (!activeSession.questions || activeSession.questions.length === 0)) {
      startInterview({
        technology: config.technology || 'Java',
        difficulty: config.difficulty || 'Intermediate',
        questionCount: config.questionCount || 5,
        interviewType: config.interviewType || 'Technical'
      });
    }
  }, []);

  const questions = activeSession.questions || [];
  const currentIndex = activeSession.currentIndex || 0;
  const currentQuestion = questions[currentIndex] || questions[0];

  const currentAnswer = currentQuestion ? (activeSession.answers[currentQuestion.id] || '') : '';

  // Timer
  const [seconds, setSeconds] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluatingMessage, setEvaluatingMessage] = useState('Analyzing responses...');

  const isLiveAI = getEvaluationMode() === AI_MODES.LIVE_AI && Boolean(getGeminiApiKey());
  const liveModel = getSelectedAIModel();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswerChange = (e) => {
    if (currentQuestion) {
      saveAnswer(currentQuestion.id, e.target.value);
    }
  };

  const handleFinish = async () => {
    setIsEvaluating(true);
    if (isLiveAI) {
      setEvaluatingMessage(`Evaluating responses with Live Google Gemini (${liveModel})...`);
    } else {
      setEvaluatingMessage('Running deterministic scoring analysis...');
    }

    try {
      await completeInterview();
      setIsEvaluating(false);
      setShowFinishModal(false);
      navigate('/evaluation');
    } catch (err) {
      console.error(err);
      setIsEvaluating(false);
      setShowFinishModal(false);
      navigate('/evaluation');
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading interview session...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(activeSession.answers || {}).filter(
    k => (activeSession.answers[k] || '').trim().length > 0
  ).length;

  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const words = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = currentAnswer.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Session Status Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs tracking-wide">
            {config.technology}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
            {config.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
            {config.interviewType}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">|</span>
          <span className="text-xs font-semibold text-slate-600">
            {answeredCount} of {totalQuestions} Answered
          </span>
        </div>

        {/* Right: AI Engine Pill + Timer + Finish CTA */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* AI Engine Status indicator */}
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Configure AI Engine"
          >
            {isLiveAI ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Live Gemini AI</span>
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Prototype Engine</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono text-xs tracking-wider">{formatTimer(seconds)}</span>
          </div>

          <button
            onClick={() => setShowFinishModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
          >
            Finish Interview
          </button>
        </div>
      </div>

      {/* Progress Bar & Question Jump Nav */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
          </span>
          <span className="text-slate-500">{progressPercent}% Completed</span>
        </div>

        <ProgressBar value={progressPercent} max={100} color="brand" size="sm" showLabel={false} />

        {/* Question Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {questions.map((q, idx) => {
            const isAnswered = (activeSession.answers[q.id] || '').trim().length > 0;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => jumpToQuestion(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-500/30 shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`Question ${idx + 1}: ${q.topic}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question & Answer Workspace */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Question Topic & Text */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Topic: {currentQuestion.topic}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'View Hint'}</span>
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h3>

          {/* Collapsible Hint Drawer */}
          {showHint && currentQuestion.hint && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 animate-in fade-in space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Interview Preparation Hint</span>
              </div>
              <p className="leading-relaxed pl-5 text-amber-950">
                {currentQuestion.hint}
              </p>
            </div>
          )}
        </div>

        {/* Answer Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="font-semibold text-slate-700">
              Your Answer
            </label>
            <div className="flex items-center gap-3">
              <span>{words} words</span>
              <span>•</span>
              <span>{chars} characters</span>
            </div>
          </div>

          <textarea
            value={currentAnswer}
            onChange={handleAnswerChange}
            rows={10}
            placeholder="Type your structured answer here. Include relevant keywords, syntax mechanisms, architecture trade-offs, and concrete examples..."
            className="w-full p-4 rounded-2xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-sans focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y leading-relaxed"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Answers are automatically saved to your practice session.</span>
            </span>
            <span className="hidden sm:inline">Tip: Aim for at least 40-70 words for a thorough technical answer.</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Question</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => setShowFinishModal(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Submit & Finish Interview</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={nextQuestion}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Save & Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showFinishModal}
        onClose={() => !isEvaluating && setShowFinishModal(false)}
        title="Ready to Finish Interview?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You have answered <span className="font-bold text-slate-900">{answeredCount}</span> of{' '}
            <span className="font-bold text-slate-900">{totalQuestions}</span> questions.
          </p>

          {answeredCount < totalQuestions && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Unanswered questions detected:</span>
                <p className="mt-0.5">
                  Questions left blank will receive a score of 0. You can go back and fill them in or submit now.
                </p>
              </div>
            </div>
          )}

          {/* Evaluation Engine Information Box */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                {isLiveAI ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  {isLiveAI ? `Live AI Model: ${liveModel}` : 'Deterministic Prototype Engine'}
                </div>
                <div className="text-[11px] text-slate-600">
                  {isLiveAI
                    ? 'Generates real-time custom semantic evaluation and code critique.'
                    : 'Instant rule-based scoring engine without needing an external API key.'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="text-[11px] font-bold text-blue-600 hover:underline shrink-0 ml-2"
            >
              Change
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isEvaluating}
              onClick={() => setShowFinishModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue Answering
            </button>
            <button
              type="button"
              disabled={isEvaluating}
              onClick={handleFinish}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm shadow-blue-500/25 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{evaluatingMessage}</span>
                </>
              ) : (
                <>
                  <span>Confirm & View Results</span>
                  <FileCheck2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* AI Model Settings Modal */}
      <AIModelModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </div>
  );
}
