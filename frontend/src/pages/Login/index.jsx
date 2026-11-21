import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsDemo, authError, setAuthError, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (success) {
        navigate('/');
      }
    }, 400);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemo();
      setIsLoading(false);
      navigate('/');
    }, 300);
  };

  const fillDemoCredentials = () => {
    setEmail('demo@interviewprep.ai');
    setPassword('password123');
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070d1e] via-[#0a1128] to-[#0f172a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              InterviewPrep <span className="text-blue-400">AI</span>
            </span>
            <span className="block text-xs font-semibold text-slate-400 tracking-wide">
              AI Powered Interview Preparation System
            </span>
          </div>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Practice technical interviews, get instant AI evaluations & review model answers.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
        <div className="bg-[#111c44]/90 backdrop-blur-xl border border-blue-900/50 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
          {/* Active Session Notification if already logged in */}
          {isAuthenticated && user && (
            <div className="mb-5 p-3 rounded-2xl bg-blue-900/40 border border-blue-700/50 flex items-center justify-between text-xs text-blue-200">
              <span className="truncate">Signed in as <strong className="text-white">{user.name}</strong></span>
              <Link to="/" className="text-blue-400 hover:underline font-bold shrink-0 ml-2">
                Dashboard →
              </Link>
            </div>
          )}

          {/* Tab Selector: Sign In / Sign Up */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <button
              type="button"
              className="py-2 rounded-xl text-xs font-bold text-white bg-blue-600 shadow-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Login</span>
            </button>
            <Link
              to="/signup"
              className="py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>

          {/* Quick Demo Access Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-xs">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Instant Demo Account</span>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-slate-300 text-[11px]">
              Demo login: <span className="text-white font-mono">demo@interviewprep.ai</span> / <span className="text-white font-mono">password123</span>
            </p>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full mt-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>One-Click Demo Sign In</span>
            </button>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="demo@interviewprep.ai"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] text-blue-400 hover:text-blue-300"
                >
                  Fill password123
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
