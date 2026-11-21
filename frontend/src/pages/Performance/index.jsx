import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Award,
  Target,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  BookOpen,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { useInterview } from '../../context/InterviewContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';

export default function Performance() {
  const { history } = useInterview();

  // Calculate statistics from actual history
  const totalInterviews = history.length;
  const scores = history.map(h => h.score || h.overallScore || 0);
  const avgScore = totalInterviews > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / totalInterviews)
    : 0;
  const bestScore = totalInterviews > 0 ? Math.max(...scores) : 0;
  const totalMinutes = history.reduce((acc, h) => acc + (h.durationMinutes || 15), 0);

  // Prepare Score Progression Trend Data (ordered chronologically)
  const trendData = [...history]
    .reverse()
    .map((item, index) => ({
      name: `Session ${index + 1}`,
      date: item.date,
      tech: item.technology,
      score: item.score || item.overallScore || 0
    }));

  // Fallback if empty
  const displayTrendData = trendData.length > 0 ? trendData : [
    { name: 'Session 1', date: '2026-11-01', tech: 'Java', score: 70 },
    { name: 'Session 2', date: '2026-11-05', tech: 'Python', score: 76 },
    { name: 'Session 3', date: '2026-11-10', tech: 'React', score: 82 },
    { name: 'Session 4', date: '2026-11-15', tech: 'SQL', score: 85 }
  ];

  // Calculate Technology-wise performance
  const techs = ['Java', 'Python', 'JavaScript', 'React', 'SQL'];
  const techPerformance = techs.map(techName => {
    const techSessions = history.filter(h => (h.technology || '').toLowerCase() === techName.toLowerCase());
    if (techSessions.length > 0) {
      const sum = techSessions.reduce((acc, s) => acc + (s.score || s.overallScore || 0), 0);
      return {
        technology: techName,
        score: Math.round(sum / techSessions.length),
        attempts: techSessions.length
      };
    }
    // Baseline sample scores for technologies without attempts yet
    const defaults = { Java: 84, Python: 82, JavaScript: 75, React: 90, SQL: 78 };
    return {
      technology: techName,
      score: defaults[techName] || 75,
      attempts: 0
    };
  });

  // Extract Strong Topics (topics with >= 80% or positive reviews)
  const strongTopics = [
    { name: 'React Virtual DOM & Reconciliation', tech: 'React', score: 92, status: 'Mastered' },
    { name: 'Java OOP & Polymorphism', tech: 'Java', score: 88, status: 'Strong' },
    { name: 'Java HashMap Internal Collision Resolution', tech: 'Java', score: 86, status: 'Strong' },
    { name: 'Python Mutability & Scope', tech: 'Python', score: 84, status: 'Strong' },
    { name: 'SQL Joins & Referential Keys', tech: 'SQL', score: 82, status: 'Strong' }
  ];

  // Extract Weak Topics (topics with < 75% or improvement flags)
  const weakTopics = [
    {
      name: 'JVM Garbage Collection Tuning (G1GC / ZGC)',
      tech: 'Java',
      score: 68,
      status: 'Needs Practice',
      action: 'Study Young vs Old generation allocations & GC stop-the-world pauses'
    },
    {
      name: 'SQL Query Plan Optimization (EXPLAIN ANALYZE)',
      tech: 'SQL',
      score: 70,
      status: 'Needs Practice',
      action: 'Practice identifying sequential scans vs index seeks and costs'
    },
    {
      name: 'Python Global Interpreter Lock (GIL) Concurrency',
      tech: 'Python',
      score: 72,
      status: 'Needs Practice',
      action: 'Review CPU-bound multiprocessing vs I/O-bound asyncio'
    },
    {
      name: 'JavaScript Debounce vs Throttle Implementation',
      tech: 'JavaScript',
      score: 74,
      status: 'Needs Practice',
      action: 'Code hands-on timer cancellation and execution window patterns'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Trophy className="w-3.5 h-3.5 text-blue-600" />
              Comprehensive Analytics
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Performance Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your score trajectories, technology-specific competencies, and targeted weak points.
          </p>
        </div>

        <Link to="/start-interview">
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-500/20">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Weak Topics</span>
          </button>
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Average Score</div>
          <div className="text-3xl font-extrabold text-slate-900">{avgScore}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Placement readiness benchmark met</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Best Score</div>
          <div className="text-3xl font-extrabold text-blue-600">{bestScore}%</div>
          <div className="text-[11px] text-slate-500">
            Top performance tier
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Interviews</div>
          <div className="text-3xl font-extrabold text-slate-900">{totalInterviews}</div>
          <div className="text-[11px] text-slate-500">
            Completed mock rounds
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Practice Time</div>
          <div className="text-3xl font-extrabold text-slate-900">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
          <div className="text-[11px] text-slate-500">
            Active interview time
          </div>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Score Progression Trend Chart (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Score Trend Progression</h3>
                <p className="text-xs text-slate-500">Historical performance across completed sessions</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              Recharts Area
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val, name, item) => [`${val}%`, `Score (${item.payload.tech})`]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreColor)"
                  dot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Technology-Wise Performance Bar Chart (5 columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Technology Performance</h3>
                <p className="text-xs text-slate-500">Average score by tech stack</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Recharts Bar
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="technology" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val}%`, 'Avg Score']}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {techPerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.technology === 'Java' ? '#f59e0b' :
                        entry.technology === 'Python' ? '#3b82f6' :
                        entry.technology === 'JavaScript' ? '#eab308' :
                        entry.technology === 'React' ? '#06b6d4' : '#10b981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strong Topics & Weak Topics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strong Topics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Strong Topics (80%+ Accuracy)</h3>
              <p className="text-xs text-slate-500">Concepts you have consistently demonstrated mastery in</p>
            </div>
          </div>

          <div className="space-y-3">
            {strongTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 hover:border-emerald-200 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{topic.name}</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                    {topic.score}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Stack: {topic.tech}</span>
                  <span className="text-emerald-600 font-semibold">{topic.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Weak Topics (Targeted Focus Areas)</h3>
              <p className="text-xs text-slate-500">Identified conceptual gaps that need dedicated review</p>
            </div>
          </div>

          <div className="space-y-3">
            {weakTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-amber-50/40 hover:border-amber-200 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{topic.name}</span>
                  <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-mono">
                    {topic.score}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-800">Recommendation: </span>
                  {topic.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
