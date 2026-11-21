import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  FileText,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Code2,
  Terminal,
  Database,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function History() {
  const navigate = useNavigate();
  const { history, deleteHistoryItem, clearAllHistory, loadEvaluation } = useInterview();

  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      (item.roleTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.technology || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.topicsCovered || []).some((t) =>
        t.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTech =
      techFilter === 'all' ||
      (item.technology || '').toLowerCase() === techFilter.toLowerCase();

    const matchesDiff =
      difficultyFilter === 'all' ||
      (item.difficulty || '').toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesTech && matchesDiff;
  });

  const handleViewResults = (item) => {
    loadEvaluation(item);
    navigate('/evaluation');
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteHistoryItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleClearAll = () => {
    clearAllHistory();
    setShowClearAllModal(false);
  };

  const getScoreBadge = (score) => {
    if (score >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Award className="w-3.5 h-3.5" />
          {score} / 100
        </span>
      );
    }
    if (score >= 75) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Award className="w-3.5 h-3.5" />
          {score} / 100
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Award className="w-3.5 h-3.5" />
        {score} / 100
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview History
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review past mock interview sessions, transparent scoring evaluations, and progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <Link to="/start-interview">
            <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-500/20">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Session</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by technology, role, or topic (e.g. Java, Virtual DOM, SQL Indexing)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tech Filter */}
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Technologies</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="sql">SQL</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No interview records found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || techFilter !== 'all' || difficultyFilter !== 'all'
                ? 'Try adjusting your search terms or filters to find completed sessions.'
                : 'You have not completed any mock interviews yet. Start your first session to track your progress!'}
            </p>
          </div>
          <Link to="/start-interview">
            <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm shadow-blue-500/20">
              Start Practice Session
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-bold text-[11px]">
                    {item.technology || 'Technical'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                    {item.difficulty || 'Intermediate'}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {item.durationMinutes || 15} mins
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {item.roleTitle || `${item.technology} Developer Interview`}
                  </h4>
                </div>

                {/* Topics Covered */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(item.topicsCovered || []).slice(0, 4).map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {top}
                    </span>
                  ))}
                  {(item.topicsCovered || []).length > 4 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{(item.topicsCovered || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Right Score & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <div className="text-[11px] text-slate-400 font-medium mb-0.5">Evaluation Score</div>
                  {getScoreBadge(item.score || item.overallScore || 75)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewResults(item)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>View Report</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Delete Interview Record?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the interview record for{' '}
            <span className="font-bold text-slate-900">{itemToDelete?.roleTitle || itemToDelete?.technology}</span> from {itemToDelete?.date}?
          </p>
          <p className="text-xs text-rose-600 font-medium">
            This action cannot be undone and will update your performance analytics.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => setItemToDelete(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
            >
              Delete Record
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear All Confirmation Modal */}
      <Modal
        isOpen={showClearAllModal}
        onClose={() => setShowClearAllModal(false)}
        title="Clear All Interview History?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This will permanently remove all completed mock interviews from your local storage.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => setShowClearAllModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
            >
              Clear All Records
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
