import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Briefcase,
  Mail,
  Calendar,
  Sparkles,
  Settings,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Save,
  LogOut,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInterview } from '../../context/InterviewContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { history } = useInterview();

  const [formData, setFormData] = useState({
    name: user?.name || 'Ayush Sharma',
    email: user?.email || 'demo@interviewprep.ai',
    targetRole: user?.targetRole || 'Full Stack & Software Developer',
    experienceLevel: user?.experienceLevel || 'Entry Level (0-1 yrs)',
    college: user?.college || 'Apex Institute of Technology',
    degree: user?.degree || 'B.Tech in Computer Science & Engineering',
    graduationYear: user?.graduationYear || '2027',
    bio: user?.bio || 'Computer Science student passionate about technical interview preparation, algorithms, and web architectures.',
    preferredTech: user?.preferredTech || ['Java', 'Python', 'JavaScript', 'React', 'SQL']
  });

  const [isSaved, setIsSaved] = useState(false);

  const availableTechs = ['Java', 'Python', 'JavaScript', 'React', 'SQL', 'C++', 'Node.js', 'Spring Boot'];

  const toggleTech = (tech) => {
    setFormData(prev => {
      const exists = prev.preferredTech.includes(tech);
      return {
        ...prev,
        preferredTech: exists
          ? prev.preferredTech.filter(t => t !== tech)
          : [...prev.preferredTech, tech]
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalInterviews = history.length;
  const avgScore = totalInterviews > 0
    ? Math.round(history.reduce((a, b) => a + (b.score || b.overallScore || 0), 0) / totalInterviews)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Candidate Profile
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal academic background, target placement roles, and interview preparation preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile Saved!</span>
            </span>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Bio & Quick Stats (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main User Bio Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-center space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-50">
                  {user?.avatarInitials || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'AS')}
                </div>
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </span>
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                {formData.name}
              </h3>
              <p className="text-xs font-bold text-blue-600 mt-0.5">
                {formData.targetRole}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{formData.email}</span>
              </div>

              <p className="mt-4 text-xs text-slate-600 leading-relaxed text-left border-t border-slate-100 pt-4">
                {formData.bio}
              </p>
            </div>
          </div>

          {/* Academic Background Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">Academic Institution</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">College / University</span>
                <span className="font-bold text-slate-800">{formData.college}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Degree Program</span>
                <span className="font-semibold text-slate-700">{formData.degree}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Graduation Year</span>
                <span className="font-semibold text-slate-700">{formData.graduationYear}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Preparation Milestones</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-500 block">Completed</span>
                <span className="text-lg font-extrabold text-slate-900">{totalInterviews} Tests</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-500 block">Avg Score</span>
                <span className="text-lg font-extrabold text-blue-600">{avgScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form (8 columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Edit Profile & Target Roles</h3>
              <p className="text-xs text-slate-500 mt-0.5">Update personal details and preferred mock interview tracks.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Target Role & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Job Role
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Experience Tier
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                  <option value="Junior (1-2 yrs)">Junior (1-2 yrs)</option>
                  <option value="Mid-level (3-5 yrs)">Mid-level (3-5 yrs)</option>
                  <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                </select>
              </div>
            </div>

            {/* College, Degree, Grad Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  College / Institute
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Professional Summary / Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bio & Career Objectives
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Preferred Technologies Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Technologies & Focus Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTechs.map((t) => {
                  const isChecked = formData.preferredTech.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTech(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Changes persist automatically in local storage.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
