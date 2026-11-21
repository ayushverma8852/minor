import api from './api';

export const historyService = {
  /**
   * Fetch all interview history for the authenticated user
   */
  async getUserHistory() {
    try {
      const response = await api.get('/api/interviews');
      if (response.data && Array.isArray(response.data)) {
        // Sync to local storage for offline resilience
        localStorage.setItem('interviewprep_history', JSON.stringify(response.data));
        return { data: response.data, source: 'backend' };
      }
    } catch (error) {
      console.warn('[historyService] Backend getUserHistory failed, using local history:', error.message);
    }

    const localHistory = JSON.parse(localStorage.getItem('interviewprep_history') || '[]');
    return { data: localHistory, source: 'local' };
  },

  /**
   * Fetch high-level performance summary metrics (for Dashboard)
   */
  async getPerformanceSummary() {
    try {
      const response = await api.get('/api/performance/summary');
      if (response.data) {
        return { ...response.data, source: 'backend' };
      }
    } catch (error) {
      console.warn('[historyService] Backend getPerformanceSummary failed, computing locally:', error.message);
    }

    // Compute from local history
    const history = JSON.parse(localStorage.getItem('interviewprep_history') || '[]');
    const completed = history.filter(i => (i.totalScore !== undefined && i.totalScore !== null) || i.overallScore !== undefined);

    let avg = 0;
    let best = 0;
    if (completed.length > 0) {
      const sum = completed.reduce((acc, curr) => acc + (curr.totalScore || curr.overallScore || 0), 0);
      avg = Math.round(sum / completed.length);
      best = Math.max(...completed.map(curr => curr.totalScore || curr.overallScore || 0));
    }

    return {
      totalInterviews: history.length,
      averageScore: avg,
      bestScore: best,
      completedInterviews: completed.length,
      recentInterviews: history.slice(0, 5),
      source: 'local'
    };
  },

  /**
   * Fetch in-depth analytics (trends, topics, tech breakdown)
   */
  async getPerformanceAnalytics() {
    try {
      const response = await api.get('/api/performance/analytics');
      if (response.data) {
        return { ...response.data, source: 'backend' };
      }
    } catch (error) {
      console.warn('[historyService] Backend getPerformanceAnalytics failed, deriving from local state:', error.message);
    }

    const history = JSON.parse(localStorage.getItem('interviewprep_history') || '[]');
    const completed = history.filter(i => (i.totalScore !== undefined && i.totalScore !== null) || i.overallScore !== undefined);

    const trend = completed.map(i => ({
      date: new Date(i.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: i.totalScore || i.overallScore || 70,
      technology: i.technology
    }));

    const dynamicStrong = [];
    const dynamicWeak = [];
    completed.forEach(h => {
      (h.strengths || []).forEach(s => {
        if (!dynamicStrong.includes(s)) dynamicStrong.push(s);
      });
      (h.areasForImprovement || []).forEach(w => {
        if (!dynamicWeak.includes(w)) dynamicWeak.push(w);
      });
    });

    return {
      scoreTrend: trend,
      technologyPerformance: [],
      strongTopics: dynamicStrong,
      weakTopics: dynamicWeak,
      overallAverageScore: completed.length > 0 ? Math.round(completed.reduce((a, b) => a + (b.totalScore || b.overallScore || 0), 0) / completed.length) : 0,
      bestScore: completed.length > 0 ? Math.max(...completed.map(i => i.totalScore || i.overallScore || 0)) : 0,
      source: 'local'
    };
  },

  /**
   * Delete single interview history entry
   */
  async deleteHistoryItem(interviewId) {
    try {
      await api.delete(`/api/interviews/${interviewId}`);
    } catch (error) {
      console.warn('[historyService] Backend delete failed, removing locally:', error.message);
    }

    const history = JSON.parse(localStorage.getItem('interviewprep_history') || '[]');
    const updated = history.filter(item => String(item.id) !== String(interviewId));
    localStorage.setItem('interviewprep_history', JSON.stringify(updated));
    return updated;
  }
};

export default historyService;
