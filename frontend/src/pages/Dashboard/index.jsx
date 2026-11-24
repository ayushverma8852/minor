import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Check,
  BarChart2,
  Star,
  Zap,
  Briefcase,
  Code2,
  Signal,
  TrendingUp,
  Link2,
  BookOpen,
  FileText,
  PlayCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInterview } from '../../context/InterviewContext';

// FastAPI AI service URL (set VITE_AI_SERVICE_URL in frontend/.env to override)
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

// Live Quiz: 5 questions, each one harder than the last
const TOTAL_LIVE_QUESTIONS = 5;
const LIVE_LEVELS = [
  { label: 'Beginner', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'Easy', style: 'bg-sky-50 text-sky-700 border-sky-200' },
  { label: 'Intermediate', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'Advanced', style: 'bg-orange-50 text-orange-700 border-orange-200' },
  { label: 'Expert', style: 'bg-red-50 text-red-700 border-red-200' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, startInterview, loadEvaluation } = useInterview();

  // Dynamic metrics from actual interview history
  const totalInterviews = history.length;
  const scores = history.map((h) => h.score || h.overallScore || 0);
  const avgScore =
    totalInterviews > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / totalInterviews)
      : 0;
  const bestScore = totalInterviews > 0 ? Math.max(...scores) : 0;
  const activeDays = totalInterviews > 0 ? Math.min(totalInterviews, 5) : 0;

  // Dynamic Score Progression for Dashboard chart (last 5 completed interviews)
  const recentSessions = [...history].reverse().slice(-5);
  const chartPoints = recentSessions.map((item, idx) => {
    const totalPoints = recentSessions.length;
    const x = totalPoints === 1 ? 175 : 60 + idx * (235 / (totalPoints - 1));
    const scoreVal = item.score || item.overallScore || 0;
    const y = 140 - (Math.max(0, Math.min(100, scoreVal)) / 100) * 120;
    const label = item.technology ? item.technology.slice(0, 4) : `S${idx + 1}`;
    return { x, y, score: scoreVal, label, tech: item.technology };
  });
  const polylinePoints = chartPoints.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join(' ');

  // Quick Start Form state
  const [tech, setTech] = useState('Java');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [interviewType, setInterviewType] = useState('Technical');

  // Live Quiz state
  const [liveTopic, setLiveTopic] = useState('');
  const [liveQuestions, setLiveQuestions] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState('');
  const [liveQuizTopic, setLiveQuizTopic] = useState('');

  const handleStartInterview = (e) => {
    e.preventDefault();
    startInterview({
      technology: tech,
      difficulty,
      questionCount: Number(questionCount),
      interviewType
    });
    navigate('/interview-session');
  };

  const handleViewReport = (item) => {
    loadEvaluation(item);
    navigate('/evaluation');
  };

  const requestLiveQuestion = async (topic, askedSoFar) => {
    setLiveLoading(true);
    setLiveError('');

    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/v1/live-quiz/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          previous_questions: askedSoFar.map((q) => q.question),
          question_number: askedSoFar.length + 1,
          total_questions: TOTAL_LIVE_QUESTIONS
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate question');
      }

      setLiveQuestions([
        ...askedSoFar,
        {
          id: Date.now(),
          question: data.question,
          options: data.options,
          correctIndex: data.correct_index,
          explanation: data.explanation,
          selected: null
        }
      ]);
    } catch (err) {
      setLiveError(
        err.message === 'Failed to fetch'
          ? 'Cannot reach the AI service. Check that it is running on port 8000.'
          : err.message
      );
    } finally {
      setLiveLoading(false);
    }
  };

  const handleStartQuiz = (e) => {
    e.preventDefault();
    const topic = liveTopic.trim();
    if (!topic || liveLoading) return;
    setLiveQuizTopic(topic);
    setLiveQuestions([]);
    requestLiveQuestion(topic, []);
  };

  const handleNextQuestion = () => {
    if (liveLoading) return;
    requestLiveQuestion(liveQuizTopic, liveQuestions);
  };

  const handleSelectOption = (id, optionIndex) => {
    setLiveQuestions((prev) =>
      prev.map((q) =>
        q.id === id && q.selected === null ? { ...q, selected: optionIndex } : q
      )
    );
  };

  const handleQuitQuiz = () => {
    setLiveQuestions([]);
    setLiveQuizTopic('');
    setLiveError('');
  };

  // Live Quiz derived values (score updates as soon as an option is picked)
  const quizStarted = liveQuestions.length > 0;
  const currentQuestion = quizStarted ? liveQuestions[liveQuestions.length - 1] : null;
  const currentAnswered = currentQuestion ? currentQuestion.selected !== null : false;
  const liveAnswered = liveQuestions.filter((q) => q.selected !== null).length;
  const liveCorrect = liveQuestions.filter((q) => q.selected === q.correctIndex).length;
  const quizFinished = liveQuestions.length === TOTAL_LIVE_QUESTIONS && currentAnswered;
  const currentLevel = LIVE_LEVELS[Math.max(0, liveQuestions.length - 1)];

  const getQuizVerdict = () => {
    if (liveCorrect === TOTAL_LIVE_QUESTIONS) return 'Perfect score. You are interview ready on this topic.';
    if (liveCorrect >= 3) return 'Good job. A little more practice on the harder questions and you are there.';
    return 'Keep practicing. Review the explanations and try the quiz again.';
  };

  const recentHistory = history.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome Hero Banner with AI Assistant Graphic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e8f2fe] via-[#edf5ff] to-[#e4effe] p-6 sm:p-8 border border-blue-100/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Greeting Text */}
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Technical Interview Coach</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-[#2563eb]">{user?.name ? user.name.split(' ')[0] : 'Candidate'}!</span>
            </h1>
            <p className="text-slate-600 font-medium text-base sm:text-lg flex items-center justify-center md:justify-start gap-1.5">
              <span>Let's prepare and ace your technical interviews</span>
              <span className="inline-block hover:scale-110 transition-transform">🚀</span>
            </p>
          </div>

          {/* Right Vector Illustration */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Speech Bubble */}
            <div className="absolute -top-3 right-2 sm:right-6 z-20 bg-white px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-1.5 animate-bounce [animation-duration:3s]">
              <span>Ready for your next mock drill?</span>
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100" />
            </div>

            {/* Illustration */}
            <div className="w-56 sm:w-64 h-36 relative flex items-end justify-center">
              <div className="absolute left-1 bottom-1 flex flex-col items-center">
                <div className="relative w-8 h-10">
                  <div className="absolute bottom-0 left-1 w-3 h-7 bg-emerald-500 rounded-full -rotate-25 origin-bottom" />
                  <div className="absolute bottom-0 right-1 w-3 h-8 bg-teal-500 rounded-full rotate-25 origin-bottom" />
                  <div className="absolute bottom-0 left-2 w-3.5 h-9 bg-emerald-600 rounded-full origin-bottom" />
                </div>
                <div className="w-6 h-5 bg-white border border-slate-200 rounded-b-md shadow-xs" />
              </div>

              <div className="relative flex flex-col items-center">
                <div className="w-48 sm:w-52 h-28 bg-[#1e293b] rounded-t-xl border-4 border-[#334155] p-2 relative shadow-lg overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]" />
                  <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-xl" />

                  <div className="relative z-10 flex flex-col items-center mt-1">
                    <div className="w-1.5 h-2 bg-blue-400 rounded-t-full" />
                    <div className="w-3 h-1 bg-blue-400 rounded-full mb-0.5" />

                    <div className="w-16 h-12 bg-white rounded-2xl p-1 shadow-md flex items-center justify-center relative">
                      <div className="absolute -left-1.5 w-2 h-6 bg-blue-500 rounded-full" />
                      <div className="absolute -right-1.5 w-2 h-6 bg-blue-500 rounded-full" />

                      <div className="w-full h-full bg-[#0a1128] rounded-xl flex items-center justify-center gap-2">
                        <div className="w-2.5 h-3 bg-[#38bdf8] rounded-sm shadow-[0_0_8px_#38bdf8]" />
                        <div className="w-2.5 h-3 bg-[#38bdf8] rounded-sm shadow-[0_0_8px_#38bdf8]" />
                      </div>
                    </div>

                    <div className="relative w-12 h-6 bg-white rounded-t-lg mt-0.5 flex justify-center">
                      <div className="w-2 h-4 bg-[#2563eb] rounded-b-sm" />
                    </div>
                  </div>
                </div>

                <div className="w-56 sm:w-60 h-3 bg-[#cbd5e1] rounded-b-lg border-t border-slate-300 shadow-md relative flex justify-center">
                  <div className="w-14 h-1 bg-slate-400 rounded-b-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Dynamic Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Interviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Interviews</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{totalInterviews}</div>
          </div>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Average Score</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{avgScore}%</div>
          </div>
        </div>

        {/* Card 3: Best Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6] text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-200">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Best Score</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{bestScore}%</div>
          </div>
        </div>

        {/* Card 4: Preparation Streak */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-200">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Streak</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {totalInterviews > 0 ? `${activeDays} Day${activeDays > 1 ? 's' : ''} 🔥` : '0 Days'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Start a New Interview (Left) & Performance Snapshot (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Start a New Interview Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Start a New Interview
                </h2>
              </div>
              <Link
                to="/start-interview"
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>Full Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select your technology, difficulty, and format to begin a realistic mock interview.
            </p>

            {/* Selection Form */}
            <form onSubmit={handleStartInterview} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 1: Technology */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Technology
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Code2 className="w-4 h-4 text-[#2563eb] shrink-0" />
                        <select
                          value={tech}
                          onChange={(e) => setTech(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Java">Java (OOP, JVM, Collections)</option>
                          <option value="Python">Python (GIL, Async, Decorators)</option>
                          <option value="JavaScript">JavaScript (Event Loop, Closures)</option>
                          <option value="React">React (Hooks, VDOM, Fiber)</option>
                          <option value="SQL">SQL (Joins, Indexing, ACID)</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Field 2: Difficulty Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Difficulty Level
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Signal className="w-4 h-4 text-blue-600 shrink-0" />
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Beginner">Beginner (Foundations)</option>
                          <option value="Intermediate">Intermediate (Mechanisms)</option>
                          <option value="Advanced">Advanced (Architecture)</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Field 3: Number of Questions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Questions Count
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Briefcase className="w-4 h-4 text-[#2563eb] shrink-0" />
                        <select
                          value={questionCount}
                          onChange={(e) => setQuestionCount(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value={5}>5 Questions (~15 min)</option>
                          <option value={10}>10 Questions (~30 min)</option>
                          <option value={15}>15 Questions (~45 min)</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Field 4: Interview Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Interview Type
                  </label>
                  <div className="relative">
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <select
                          value={interviewType}
                          onChange={(e) => setInterviewType(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Technical">Technical Round</option>
                          <option value="HR">HR / Behavioral Round</option>
                          <option value="Mixed">Mixed (Tech + HR)</option>
                        </select>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Start Interview Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#1d68f2] hover:bg-[#1a5cd6] active:bg-[#1650bd] text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Interview</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Performance Quick View */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Your Performance
                </h3>
              </div>
              <Link
                to="/performance"
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Line chart visualization */}
            {recentSessions.length === 0 ? (
              <div className="mt-4 h-48 w-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-800">No interview sessions completed yet</div>
                <div className="text-[11px] text-slate-400 mt-0.5 max-w-[220px]">
                  Complete your first mock interview to track your score trajectory over time.
                </div>
              </div>
            ) : (
              <div className="mt-4 relative h-48 w-full flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 160">
                  <line x1="40" y1="20" x2="310" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="50" x2="310" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="80" x2="310" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="110" x2="310" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="310" y2="140" stroke="#e2e8f0" strokeWidth="1" />

                  <text x="32" y="24" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">100%</text>
                  <text x="32" y="54" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">75%</text>
                  <text x="32" y="84" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">50%</text>
                  <text x="32" y="114" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">25%</text>
                  <text x="32" y="144" textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">0%</text>

                  {chartPoints.map((pt, idx) => (
                    <text key={idx} x={pt.x} y="156" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">
                      {pt.label}
                    </text>
                  ))}

                  {chartPoints.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylinePoints}
                    />
                  )}

                  {chartPoints.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={idx === chartPoints.length - 1 ? 4.5 : 3.5}
                      fill={idx === chartPoints.length - 1 ? '#2563eb' : '#3b82f6'}
                      stroke="#ffffff"
                      strokeWidth={idx === chartPoints.length - 1 ? 2.5 : 2}
                    />
                  ))}

                  {chartPoints.length > 0 && (
                    <g transform={`translate(${Math.max(40, Math.min(270, chartPoints[chartPoints.length - 1].x - 20))}, ${Math.max(4, chartPoints[chartPoints.length - 1].y - 28)})`}>
                      <rect x="0" y="0" width="40" height="20" rx="6" fill="#2563eb" />
                      <text x="20" y="14" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="bold">
                        {chartPoints[chartPoints.length - 1].score}%
                      </text>
                      <polygon points="17,20 23,20 20,24" fill="#2563eb" />
                    </g>
                  )}
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Quiz */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Live Quiz</h3>
          </div>
          {quizStarted && (
            <button
              type="button"
              onClick={handleQuitQuiz}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Quit quiz
            </button>
          )}
        </div>

        {!quizStarted && (
          <>
            <p className="text-xs text-slate-500 mt-1">
              Pick a topic for a {TOTAL_LIVE_QUESTIONS}-question quiz. It starts easy and gets harder with every question.
            </p>

            <form
              onSubmit={handleStartQuiz}
              className="mt-4 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={liveTopic}
                onChange={(e) => setLiveTopic(e.target.value)}
                placeholder="e.g. Python decorators, React hooks, SQL joins"
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={liveLoading || !liveTopic.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#1d68f2] hover:bg-[#1a5cd6] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {liveLoading ? 'Generating...' : 'Start Quiz'}
              </button>
            </form>
          </>
        )}

        {liveError && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
            {liveError}
          </div>
        )}

        {quizStarted && (
          <div className="mt-4">
            {/* Progress + live score */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                  {liveQuizTopic}
                </span>
                <span>
                  Question {liveQuestions.length} of {TOTAL_LIVE_QUESTIONS}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-800">
                Score: {liveCorrect} / {liveAnswered}
              </div>
            </div>

            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2563eb] transition-all duration-300"
                style={{ width: `${(liveAnswered / TOTAL_LIVE_QUESTIONS) * 100}%` }}
              />
            </div>

            {/* Current question */}
            <div className="mt-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">
                  <span className="text-xs font-bold text-blue-600 mr-2">
                    Q{liveQuestions.length}
                  </span>
                  {currentQuestion.question}
                </div>
                <span
                  className={`shrink-0 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${currentLevel.style}`}
                >
                  {currentLevel.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentQuestion.options.map((opt, optIdx) => {
                  let style =
                    'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer';

                  if (currentAnswered) {
                    if (optIdx === currentQuestion.correctIndex) {
                      style = 'border-emerald-400 bg-emerald-50 text-emerald-900 cursor-default';
                    } else if (optIdx === currentQuestion.selected) {
                      style = 'border-red-400 bg-red-50 text-red-900 cursor-default';
                    } else {
                      style = 'border-slate-200 bg-white opacity-60 cursor-default';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={currentAnswered}
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`text-left px-3 py-2.5 rounded-xl border text-sm text-slate-800 transition-colors ${style}`}
                    >
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {currentAnswered && (
                <div
                  className={`mt-3 text-xs rounded-xl p-3 border ${
                    currentQuestion.selected === currentQuestion.correctIndex
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                      : 'bg-red-50 border-red-100 text-red-900'
                  }`}
                >
                  <div className="font-bold">
                    {currentQuestion.selected === currentQuestion.correctIndex
                      ? 'Correct!'
                      : `Not quite. The correct answer is ${String.fromCharCode(65 + currentQuestion.correctIndex)}.`}
                  </div>
                  {currentQuestion.explanation && (
                    <div className="mt-1">{currentQuestion.explanation}</div>
                  )}
                </div>
              )}

              {currentAnswered && !quizFinished && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={liveLoading}
                    className="px-5 py-2 rounded-xl bg-[#1d68f2] hover:bg-[#1a5cd6] text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 transition-all"
                  >
                    <span>{liveLoading ? 'Generating...' : 'Next question'}</span>
                    {!liveLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Final result */}
            {quizFinished && (
              <div className="mt-4 p-5 rounded-2xl border border-blue-100 bg-blue-50/60 text-center">
                <Trophy className="w-8 h-8 text-[#8b5cf6] mx-auto" />
                <div className="mt-2 text-lg font-bold text-slate-900">
                  You scored {liveCorrect} out of {TOTAL_LIVE_QUESTIONS}
                </div>
                <p className="mt-1 text-xs text-slate-600">{getQuizVerdict()}</p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  {liveQuestions.map((q, idx) => {
                    const right = q.selected === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold ${
                          right
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-red-50 border-red-300 text-red-700'
                        }`}
                        title={LIVE_LEVELS[idx].label}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleQuitQuiz}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#1d68f2] hover:bg-[#1a5cd6] text-white font-semibold text-sm cursor-pointer transition-all"
                >
                  Start a new quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Bottom Row: Quick Links (Left) & Real Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (6 cols): Quick Links */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-slate-800" />
              <h3 className="text-base font-bold text-slate-900">
                Study Hub Quick Links
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/resources"
                className="bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  DSA Practice
                </span>
              </Link>

              <Link
                to="/resources"
                className="bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  Interview Tips
                </span>
              </Link>

              <Link
                to="/resources"
                className="bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  Video Lectures
                </span>
              </Link>

              <Link
                to="/start-interview"
                className="bg-slate-50/70 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <span className="text-xs font-semibold text-slate-800 text-center">
                  Mock Tests
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Real Dynamic Recent Activity */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-800" />
                <h3 className="text-base font-bold text-slate-900">
                  Recent Interview Activity
                </h3>
              </div>
              <Link
                to="/history"
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Dynamic Activity List */}
            {recentHistory.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No recent interviews completed yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                        {item.technology ? item.technology.slice(0, 2).toUpperCase() : 'IT'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {item.roleTitle || `${item.technology} Interview`}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>
                            Score: <strong className="text-slate-800">{item.score || item.overallScore}%</strong>
                          </span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewReport(item)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
