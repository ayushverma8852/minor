import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Terminal,
  FileCode,
  Atom,
  Database,
  Users,
  Sparkles,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import AIModelModal from '../../components/common/AIModelModal';
import {
  getEvaluationMode,
  getGeminiApiKey,
  getSelectedAIModel,
  AI_MODES
} from '../../services/aiService';

const TECHNOLOGIES = [
  {
    id: 'Java',
    name: 'Java',
    subtitle: 'Core OOP, Collections, JVM & Concurrency',
    icon: Terminal,
    color: 'from-amber-600 to-orange-500',
    borderColor: 'hover:border-amber-400',
    bgLight: 'bg-amber-500/10',
    popularTopics: ['OOP Pillars', 'HashMap Internals', 'JVM Memory', 'Thread Safety']
  },
  {
    id: 'Python',
    name: 'Python',
    subtitle: 'GIL, Decorators, Generators & Async',
    icon: Code2,
    color: 'from-blue-600 to-cyan-500',
    borderColor: 'hover:border-blue-400',
    bgLight: 'bg-blue-500/10',
    popularTopics: ['Mutability', 'Decorators', 'GIL Mechanics', 'Asyncio']
  },
  {
    id: 'JavaScript',
    name: 'JavaScript',
    subtitle: 'Event Loop, Closures, Prototypes & ES6+',
    icon: FileCode,
    color: 'from-yellow-500 to-amber-600',
    borderColor: 'hover:border-yellow-400',
    bgLight: 'bg-yellow-500/10',
    popularTopics: ['Event Loop', 'Closures', 'Async/Await', 'Memory Leaks']
  },
  {
    id: 'React',
    name: 'React',
    subtitle: 'Virtual DOM, Hooks, Fiber & Server Components',
    icon: Atom,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'hover:border-cyan-400',
    bgLight: 'bg-cyan-500/10',
    popularTopics: ['Virtual DOM', 'useEffect Pitfalls', 'useMemo/useCallback', 'React 18']
  },
  {
    id: 'SQL',
    name: 'SQL',
    subtitle: 'Joins, Indexing, ACID & Query Optimization',
    icon: Database,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'hover:border-emerald-400',
    bgLight: 'bg-emerald-500/10',
    popularTopics: ['Complex Joins', 'B-Tree Indexes', 'ACID Transactions', 'Window Functions']
  }
];

const DIFFICULTIES = [
  {
    id: 'Beginner',
    label: 'Beginner',
    tag: 'Foundations & Concepts',
    desc: 'Core definitions, syntax fundamentals, and fundamental principles.',
    color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
    activeColor: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50'
  },
  {
    id: 'Intermediate',
    label: 'Intermediate',
    tag: 'Mechanisms & Trade-offs',
    desc: 'Internal workings, memory implications, and common real-world bugs.',
    color: 'border-blue-200 bg-blue-50/50 text-blue-900',
    activeColor: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50'
  },
  {
    id: 'Advanced',
    label: 'Advanced',
    tag: 'Architecture & Scalability',
    desc: 'Engine internals, low-latency tuning, concurrency, and distributed systems.',
    color: 'border-purple-200 bg-purple-50/50 text-purple-900',
    activeColor: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50'
  }
];

const QUESTION_COUNTS = [
  {
    count: 5,
    title: 'Express Sprint',
    duration: '~15 min',
    desc: 'Quick practice session ideal for daily drills.'
  },
  {
    count: 10,
    title: 'Standard Round',
    duration: '~30 min',
    desc: 'Realistic full interview technical screening.'
  },
  {
    count: 15,
    title: 'Deep-Dive Assessment',
    duration: '~45 min',
    desc: 'Exhaustive evaluation testing breadth and depth.'
  }
];

const INTERVIEW_TYPES = [
  {
    id: 'Technical',
    title: 'Technical Round',
    desc: 'Purely technical questions focusing on code mechanics, theory, and architecture.',
    icon: Code2
  },
  {
    id: 'HR',
    title: 'HR & Behavioral Round',
    desc: 'Situational leadership, STAR method behavioral scenarios, and cultural fit.',
    icon: Users
  },
  {
    id: 'Mixed',
    title: 'Mixed Comprehensive',
    desc: 'Realistic blend of core technical deep-dives and behavioral questions.',
    icon: Sparkles
  }
];

export default function StartInterview() {
  const navigate = useNavigate();
  const { config, startInterview } = useInterview();

  const [selectedTech, setSelectedTech] = useState(config.technology || 'Java');
  const [selectedDifficulty, setSelectedDifficulty] = useState(config.difficulty || 'Intermediate');
  const [selectedCount, setSelectedCount] = useState(config.questionCount || 5);
  const [selectedType, setSelectedType] = useState(config.interviewType || 'Technical');
  const [showAIModal, setShowAIModal] = useState(false);

  // Status for AI Evaluator
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveModelName, setLiveModelName] = useState('gemini-1.5-flash');

  const updateAIStatus = () => {
    const mode = getEvaluationMode();
    const hasKey = Boolean(getGeminiApiKey());
    setIsLiveActive(mode === AI_MODES.LIVE_AI && hasKey);
    setLiveModelName(getSelectedAIModel());
  };

  useEffect(() => {
    updateAIStatus();
  }, []);

  const handleLaunch = () => {
    startInterview({
      technology: selectedTech,
      difficulty: selectedDifficulty,
      questionCount: selectedCount,
      interviewType: selectedType
    });
    navigate('/interview-session');
  };

  const currentTechObj = TECHNOLOGIES.find(t => t.id === selectedTech) || TECHNOLOGIES[0];
  const currentCountObj = QUESTION_COUNTS.find(q => q.count === selectedCount) || QUESTION_COUNTS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Configure Mock Session
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview Setup
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Select your technology, difficulty tier, and interview format to begin interactive practice.
          </p>
        </div>

        <button
          onClick={handleLaunch}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <span>Start Interview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Selectors (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Technology Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                <span>Select Target Technology</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">Choose one</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TECHNOLOGIES.map((tech) => {
                const Icon = tech.icon;
                const isSelected = selectedTech === tech.id;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setSelectedTech(tech.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-blue-600">
                        <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tech.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {tech.name}
                        </h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                      {tech.subtitle}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tech.popularTopics.slice(0, 2).map((top, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {top}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Difficulty Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                <span>Select Difficulty Level</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">3 levels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DIFFICULTIES.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900">{diff.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 text-white" />}
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      {diff.tag}
                    </span>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {diff.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Number of Questions & Interview Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Question Count */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                <span>Number of Questions</span>
              </label>
              <div className="space-y-2.5">
                {QUESTION_COUNTS.map((opt) => {
                  const isSelected = selectedCount === opt.count;
                  return (
                    <button
                      key={opt.count}
                      type="button"
                      onClick={() => setSelectedCount(opt.count)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 text-blue-950 font-semibold ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {opt.count}
                        </span>
                        <div>
                          <div className="text-xs font-bold">{opt.title}</div>
                          <div className="text-[11px] text-slate-500">{opt.desc}</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{opt.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interview Type */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
                <span>Interview Type</span>
              </label>
              <div className="space-y-2.5">
                {INTERVIEW_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 text-blue-950 font-semibold ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{type.title}</div>
                          <div className="text-[11px] text-slate-500">{type.desc}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Card (4 columns) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-gradient-to-b from-[#0a1128] to-[#111c44] text-white rounded-3xl p-6 shadow-xl border border-blue-900/40 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-3">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>Ready to Launch</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Session Overview
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your custom mock interview environment is ready.
              </p>
            </div>

            {/* Config Specs list */}
            <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Technology</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {selectedTech}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Difficulty</span>
                <span className="font-bold text-white">{selectedDifficulty}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Questions</span>
                <span className="font-bold text-white">{selectedCount} Questions</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Format</span>
                <span className="font-bold text-white">{selectedType}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Est. Duration</span>
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentCountObj.duration}
                </span>
              </div>
            </div>

            {/* Active AI Evaluator Engine Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {isLiveActive ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Live Gemini Model ({liveModelName})</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Deterministic Prototype Engine</span>
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                >
                  Configure
                </button>
              </div>
              <p className="leading-relaxed text-slate-300">
                {isLiveActive
                  ? 'Real-time generative LLM analysis powered directly by Google Gemini.'
                  : 'Instant deterministic scoring analyzing Relevance, Keyword Coverage, Completeness, and Quality.'}
              </p>
            </div>

            {/* Launch CTA */}
            <button
              onClick={handleLaunch}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Begin Interview Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Model Configuration Modal */}
      <AIModelModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onConfigSaved={updateAIStatus}
      />
    </div>
  );
}
