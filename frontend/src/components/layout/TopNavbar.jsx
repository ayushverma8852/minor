import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  CheckCircle2,
  Shield,
  Sparkles,
  Zap,
  Cpu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AIModelModal from '../common/AIModelModal';
import {
  getEvaluationMode,
  getGeminiApiKey,
  getSelectedAIModel,
  AI_MODES
} from '../../services/aiService';

export default function TopNavbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // AI model state for display badge
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [modelName, setModelName] = useState('gemini-1.5-flash');

  const updateAIStatus = () => {
    const mode = getEvaluationMode();
    const hasKey = Boolean(getGeminiApiKey());
    setIsLiveActive(mode === AI_MODES.LIVE_AI && hasKey);
    setModelName(getSelectedAIModel());
  };

  useEffect(() => {
    updateAIStatus();
  }, []);

  const initials = user?.avatarInitials || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'AS');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between">
        {/* Mobile Menu Button & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative w-48 sm:w-72 md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search skills, topics..."
              className="w-full pl-4 pr-10 py-2 rounded-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Controls: AI Engine Switcher + Notifications + User */}
        <div className="flex items-center gap-2.5 sm:gap-4 relative">
          {/* AI Engine Status Button Pill */}
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              isLiveActive
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-900 hover:border-blue-400'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Configure Live AI Model / Engine"
          >
            {isLiveActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold">Live AI: {modelName}</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Engine: Prototype</span>
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-bold">
                  Connect Live
                </span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-xs animate-in fade-in space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark read</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-blue-50/60">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Live AI Model Enabled!</div>
                      <div className="text-[11px] text-slate-500">You can now run interviews with Google Gemini models.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Placement Benchmark</div>
                      <div className="text-[11px] text-slate-500">Your average score is above 80%!</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Circle and Name Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center tracking-wider shadow-xs">
                {initials}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800">
                <span className="max-w-[120px] truncate">{user?.name || 'Ayush Sharma'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </button>

            {/* User Profile Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in space-y-1">
                <div className="p-2.5 border-b border-slate-100">
                  <div className="font-bold text-slate-900 truncate">{user?.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setShowAIModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-blue-700 hover:bg-blue-50 font-medium transition-colors text-left cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Configure Live AI Model</span>
                </button>

                <Link
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left cursor-pointer border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AI Model Configuration Modal */}
      <AIModelModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onConfigSaved={updateAIStatus}
      />
    </>
  );
}
