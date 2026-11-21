import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Key,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  X
} from 'lucide-react';
import Modal from './Modal';
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

export default function AIModelModal({ isOpen, onClose, onConfigSaved }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [evalMode, setEvalMode] = useState(AI_MODES.LIVE_AI);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getGeminiApiKey());
      setSelectedModel(getSelectedAIModel());
      setEvalMode(getEvaluationMode());
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a Gemini API Key first.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testGeminiConnection(apiKey.trim());
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    saveGeminiApiKey(apiKey.trim());
    setSelectedAIModel(selectedModel);
    setEvaluationMode(evalMode);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onConfigSaved) onConfigSaved();
      onClose();
    }, 700);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Evaluation Engine Configuration">
      <div className="space-y-6">
        {/* Engine Mode Toggle */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Evaluation Engine Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setEvalMode(AI_MODES.LIVE_AI)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                evalMode === AI_MODES.LIVE_AI
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
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
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Real-time LLM evaluation with deep semantic feedback and custom model answers.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setEvalMode(AI_MODES.DETERMINISTIC)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                evalMode === AI_MODES.DETERMINISTIC
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Deterministic Prototype</span>
                </span>
                {evalMode === AI_MODES.DETERMINISTIC && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Instant rule-based scoring engine. No API key or internet calls required.
              </p>
            </button>
          </div>
        </div>

        {/* Live Gemini AI Settings (Visible when Live AI mode is selected) */}
        {evalMode === AI_MODES.LIVE_AI && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Model Variant Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gemini Model Variant
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Recommended - Fast & Accurate)</option>
                <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Next-Gen High Speed)</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Code Reasoning)</option>
              </select>
            </div>

            {/* API Key Input */}
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
                  <span>Get Free Gemini Key</span>
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
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Your key is stored safely in browser LocalStorage and only communicated directly to Google's official Gemini endpoint.
              </p>
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={isTesting || !apiKey.trim()}
                onClick={handleTestKey}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Testing Connection...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    <span>Test Key Connection</span>
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
                      <span className="truncate max-w-[200px]">{testResult.error || testResult.message}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <span>Save & Apply Engine</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
