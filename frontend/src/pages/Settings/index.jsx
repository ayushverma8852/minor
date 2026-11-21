import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Volume2,
  Save,
  CheckCircle2,
  Sparkles,
  Key,
  Cpu,
  Zap,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  getGeminiApiKey,
  saveGeminiApiKey,
  getSelectedAIModel,
  setSelectedAIModel,
  getEvaluationMode,
  setEvaluationMode,
  testGeminiConnection,
  AI_MODES
} from '../../services/aiService';

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Live AI Model States
  const [evalMode, setEvalMode] = useState(AI_MODES.LIVE_AI);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(getGeminiApiKey());
    setSelectedModel(getSelectedAIModel());
    setEvalMode(getEvaluationMode());
  }, []);

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a Gemini API Key.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testGeminiConnection(apiKey.trim());
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveGeminiApiKey(apiKey.trim());
    setSelectedAIModel(selectedModel);
    setEvaluationMode(evalMode);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-slate-700" />
            System & AI Engine Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure live AI evaluation models, Google Gemini API keys, and session audio cues.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Updated Successfully!</span>
          </span>
        )}
      </div>

      <div className="max-w-4xl space-y-6">
        {/* 1. Live AI Model Engine Configuration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Live AI Evaluation Engine (Google Gemini)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your evaluation mode and connect live generative AI models.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              Gemini Integration
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEvalMode(AI_MODES.LIVE_AI)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  evalMode === AI_MODES.LIVE_AI
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Live Gemini AI Model</span>
                  </span>
                  {evalMode === AI_MODES.LIVE_AI && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Generates real-time custom qualitative analysis, tailored strengths, weaknesses, and benchmark answers using Gemini LLM.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setEvalMode(AI_MODES.DETERMINISTIC)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  evalMode === AI_MODES.DETERMINISTIC
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Deterministic Prototype Engine</span>
                  </span>
                  {evalMode === AI_MODES.DETERMINISTIC && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Transparent, deterministic rule-based scoring engine. Works instantly offline without needing an API key.
                </p>
              </button>
            </div>

            {/* Live Gemini Options */}
            {evalMode === AI_MODES.LIVE_AI && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                {/* Model Variant */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Active Gemini Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Recommended - Fastest & High Quality)</option>
                    <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Next-Gen Multimodal Speed)</option>
                    <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Code Reasoning & Architecture)</option>
                  </select>
                </div>

                {/* API Key */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Google Gemini API Key
                    </label>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Get a free Gemini API Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setTestResult(null);
                      }}
                      placeholder="AIzaSy..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Test Connection Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    disabled={isTesting || !apiKey.trim()}
                    onClick={handleTestKey}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        <span>Testing Gemini API...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>Test API Key Connection</span>
                      </>
                    )}
                  </button>

                  {testResult && (
                    <div className={`text-xs font-semibold flex items-center gap-1.5 ${
                      testResult.success ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {testResult.success ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Connected successfully!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span className="truncate max-w-[240px]">{testResult.error || testResult.message}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Save AI Settings Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save AI Engine Preferences</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Session Experience */}
        <Card title="Interview Session Experience" subtitle="Controls active during live practice sessions">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Sound Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Timer & Question Audio Chimes</div>
                  <div className="text-slate-500 text-[11px]">Play soft chime when advancing through questions</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
              />
            </label>

            {/* Notification Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Performance Progress Alerts</div>
                  <div className="text-slate-500 text-[11px]">Receive tips when practice readiness scores improve</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </form>
        </Card>
      </div>
    </div>
  );
}
