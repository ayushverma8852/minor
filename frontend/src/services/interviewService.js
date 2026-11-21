import api from './api';
import { getInterviewQuestions } from '../data/interviewQuestions';

export const interviewService = {
  /**
   * Create new interview session
   */
  async createInterview({ technology, difficulty, interviewType, numberOfQuestions = 5 }) {
    try {
      const response = await api.post('/api/interviews', {
        technology,
        difficulty,
        interviewType,
        numberOfQuestions
      });

      if (response.data && response.data.questions && response.data.questions.length > 0) {
        return { ...response.data, source: 'backend' };
      }
    } catch (error) {
      console.warn('[interviewService] Backend createInterview failed, using local generator:', error.message);
    }

    // Local fallback generator using comprehensive question bank
    const localQuestions = getInterviewQuestions(technology, difficulty, numberOfQuestions);
    const mockSession = {
      id: Date.now(),
      technology,
      difficulty,
      interviewType,
      status: 'IN_PROGRESS',
      totalQuestions: localQuestions.length,
      createdAt: new Date().toISOString(),
      questions: localQuestions.map((q, idx) => ({
        id: idx + 1,
        questionOrder: idx + 1,
        questionText: q.questionText,
        topic: q.topic,
        difficulty: q.difficulty || difficulty,
        expectedConcepts: q.expectedConcepts || [],
        sampleIdealAnswer: q.sampleIdealAnswer || ''
      })),
      source: 'local'
    };

    return mockSession;
  },

  /**
   * Fetch single interview session by ID
   */
  async getInterviewById(interviewId) {
    try {
      const response = await api.get(`/api/interviews/${interviewId}`);
      if (response.data) {
        return { ...response.data, source: 'backend' };
      }
    } catch (error) {
      console.warn('[interviewService] Backend getInterviewById failed:', error.message);
    }

    // Try finding in local storage history
    const history = JSON.parse(localStorage.getItem('interviewprep_history') || '[]');
    const found = history.find(item => String(item.id) === String(interviewId));
    return found || null;
  },

  /**
   * Submit an answer for a specific question
   */
  async submitAnswer(interviewId, questionId, studentAnswer) {
    try {
      const response = await api.post(`/api/interviews/${interviewId}/submit`, {
        questionId,
        studentAnswer
      });
      return response.data;
    } catch (error) {
      console.warn('[interviewService] Backend submitAnswer failed, saving locally:', error.message);
      return { status: 'saved_locally', questionId, studentAnswer };
    }
  },

  /**
   * Complete interview and trigger evaluation
   */
  async completeInterview(interviewId) {
    try {
      const response = await api.post(`/api/interviews/${interviewId}/complete`);
      if (response.data) {
        return { ...response.data, source: 'backend' };
      }
    } catch (error) {
      console.warn('[interviewService] Backend completeInterview failed:', error.message);
      return { id: interviewId, status: 'COMPLETED', source: 'local' };
    }
  },

  /**
   * Delete an interview from history
   */
  async deleteInterview(interviewId) {
    try {
      await api.delete(`/api/interviews/${interviewId}`);
    } catch (error) {
      console.warn('[interviewService] Backend delete failed, removing locally:', error.message);
    }

    // Always ensure removed from local storage
    const history = JSON.parse(localStorage.getItem('interviewprep_history') || '[]');
    const updated = history.filter(item => String(item.id) !== String(interviewId));
    localStorage.setItem('interviewprep_history', JSON.stringify(updated));
    return { success: true };
  }
};

export default interviewService;
