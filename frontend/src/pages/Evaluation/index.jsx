import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  BarChart2,
  TrendingUp,
  Check,
  Brain,
  ShieldCheck,
  Code2,
  HelpCircle,
  FileCheck2,
  Clock,
  Layers,
  Zap,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import AIModelModal from '../../components/common/AIModelModal';
import {
  evaluateInterviewWithLiveAI,
  getGeminiApiKey,
  getSelectedAIModel,
  getEvaluationMode,
  AI_MODES
} from '../../services/aiService';

export default function Evaluation() {
  const navigate = useNavigate();
  const { latestEvaluation, loadEvaluation, config, activeSession } = useInterview();
  const evaluation = latestEvaluation;

  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true });
  const [showAIModal, setShowAIModal] = useState(false);
  const [isReevaluating, setIsReevaluating] = useState(false);
  const [reevalError, setReevalError] = useState('');

  const toggleAccordion = (idx) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleRunLiveAIEval = async () => {
    const key = getGeminiApiKey();
    if (!key) {
      setShowAIModal(true);
      return;
    }

    setIsReevaluating(true);
    setReevalError('');

    try {
      // Re-evaluate using current question reviews and candidate answers
      const questionsToEval = (evaluation.questionReviews || []).map(r => ({
        id: r.questionId || `q-${r.questionNumber}`,
        topic: r.topic,
        technology: r.technology || evaluation.technology,
        difficulty: r.difficulty || evaluation.difficulty,
        question: r.questionText,
        keywords: r.matchedKeywords?.concat(r.missedKeywords || []),
        evaluationCriteria: [],
        sampleIdealAnswer: r.sampleIdealAnswer
      }));

      const answersObj = {};
      (evaluation.questionReviews || []).forEach(r => {
        answersObj[r.questionId || `q-${r.questionNumber}`] = r.candidateAnswer;
      });

      const liveResult = await evaluateInterviewWithLiveAI({
        config: {
          technology: evaluation.technology,
          difficulty: evaluation.difficulty,
          interviewType: evaluation.interviewType || 'Technical'
        },
        questions: questionsToEval,
        answers: answersObj,
        timeElapsedSeconds: (evaluation.durationMinutes || 15) * 60
      });

      loadEvaluation(liveResult);
      setIsReevaluating(false);
    } catch (err) {
      setIsReevaluating(false);
      setReevalError(err.message || 'Failed to connect to Live Gemini AI.');
    }
  };

  if (!evaluation) {
    return (
      <div className="text-center py-12 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">No evaluation report found</h3>
        <p className="text-sm text-slate-500">Take a mock interview session to generate your AI evaluation report.</p>
        <Link to="/start-interview">
          <Button variant="primary">Start an Interview</Button>
        </Link>
      </div>
    );
  }

  const score = evaluation.overallScore || 0;
  const reviews = evaluation.questionReviews || [];
  const isLiveAI = Boolean(evaluation.isLiveAI);
  const modelName = evaluation.aiModelUsed || 'Google Gemini Live';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed Session
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {evaluation.technology || 'Technical'} • {evaluation.difficulty || 'Intermediate'} • {evaluation.date}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Evaluation & Feedback Report
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/start-interview">
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* AI Evaluation Engine Status Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
        isLiveAI
          ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-blue-200 text-blue-950'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isLiveAI ? 'bg-blue-600 text-white shadow-blue-500/25' : 'bg-slate-800 text-white'
          }`}>
            {isLiveAI ? <Sparkles className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {isLiveAI ? `Live Generative AI Assessment (${modelName})` : 'Deterministic Rule-Based Evaluator'}
              </span>
              {isLiveAI && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Model
                </span>
              )}
            </div>
            <p className="text-slate-600 mt-0.5">
              {isLiveAI
                ? 'Critiqued in real-time by Google Gemini with tailored architectural feedback and qualitative bar-raising insights.'
                : 'Scored using transparent rule-based metrics analyzing Relevance, Keyword Coverage, Completeness, and Quality.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isLiveAI && (
            <button
              onClick={handleRunLiveAIEval}
              disabled={isReevaluating}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isReevaluating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Live Gemini AI Eval</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setShowAIModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            AI Settings
          </button>
        </div>
      </div>

      {reevalError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
          <span>{reevalError}</span>
          <button
            onClick={() => setShowAIModal(true)}
            className="font-bold underline cursor-pointer ml-2"
          >
            Configure API Key
          </button>
        </div>
      )}

      {/* Hero Scorecard */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a1128] via-[#111c44] to-[#0a1128] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Main Score Radial Gauge (4 columns) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {score}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  OUT OF 100
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30">
                {evaluation.grade || 'Hire'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Overall Performance Rating
            </p>
          </div>

          {/* 4 Dimension Metrics Breakdown (8 columns) */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Core Evaluation Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {evaluation.summaryHeadline || 'Demonstrated solid engagement with core problem statements and conceptual terminology.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {(evaluation.detailedMetrics || []).map((metric, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{metric.name}</span>
                    <span className="font-bold text-blue-400">{metric.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Key Strengths Identified</h3>
              <span className="text-xs text-slate-500">Concepts and answers executed well</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {(evaluation.strengths || []).map((strength, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses / Improvements */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Areas for Improvement</h3>
              <span className="text-xs text-slate-500">Gaps in keywords or depth to focus on</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {(evaluation.areasForImprovement || []).map((area, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed">
                <Target className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Question Reviews & Sample Model Answers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Detailed Question-by-Question Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your answers, scoring metrics, keyword coverage, and study sample ideal model answers.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {reviews.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {reviews.map((rev, idx) => {
            const isExpanded = expandedQuestions[idx];
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 select-none transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      Q{rev.questionNumber || idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          {rev.topic}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">{rev.technology}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                        {rev.questionText}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 shrink-0">
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold ${
                        rev.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        rev.score >= 65 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rev.score} / 100
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Accordion Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-5 animate-in fade-in">
                    {/* Full Question Text */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <span className="font-bold text-slate-800 block mb-1">Full Question:</span>
                      <p className="text-slate-700 leading-relaxed">{rev.questionText}</p>
                    </div>

                    {/* Candidate's Answer */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-800">Your Submitted Answer:</span>
                      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                        {rev.candidateAnswer || 'No answer submitted.'}
                      </div>
                    </div>

                    {/* Score Breakdown Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[10px]">Relevance</span>
                        <span className="font-bold text-slate-900 text-xs">{rev.relevanceScore || 0} / 25</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[10px]">Keywords</span>
                        <span className="font-bold text-slate-900 text-xs">{rev.keywordScore || 0} / 25</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[10px]">Completeness</span>
                        <span className="font-bold text-slate-900 text-xs">{rev.completenessScore || 0} / 25</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[10px]">Quality</span>
                        <span className="font-bold text-slate-900 text-xs">{rev.qualityScore || 0} / 25</span>
                      </div>
                    </div>

                    {/* Keyword Coverage Analysis */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-800">Keyword Coverage Analysis:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(rev.matchedKeywords || []).map((kw, kIdx) => (
                          <span key={kIdx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {kw}
                          </span>
                        ))}
                        {(rev.missedKeywords || []).map((kw, kIdx) => (
                          <span key={kIdx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                            <span className="text-rose-500">✕</span>
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900">
                      <span className="font-bold block mb-1">Evaluator Feedback:</span>
                      <p>{rev.feedback}</p>
                    </div>

                    {/* Sample Model Answer Box */}
                    {rev.sampleIdealAnswer && (
                      <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-400 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            <span>Sample Ideal Model Answer</span>
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Benchmark Reference
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {rev.sampleIdealAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation CTA */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-slate-900">Continue Your Interview Prep</h4>
          <p className="text-xs text-slate-500 mt-0.5">Explore your score trend in Performance Analytics or practice another round.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/history">
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer">
              View History
            </button>
          </Link>
          <Link to="/performance">
            <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-500/20">
              <span>View Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* AI Model Settings Modal */}
      <AIModelModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </div>
  );
}
