import api from './api';
import { evaluateAnswerLocally, computeOverallInterviewScore } from '../utils/evaluatorEngine';

export const evaluationService = {
  /**
   * Fetch complete evaluation results for a finished interview
   */
  async getInterviewResults(interviewId) {
    try {
      const response = await api.get(`/api/interviews/${interviewId}/results`);
      if (response.data && response.data.questions && response.data.questions.length > 0) {
        return { ...response.data, source: 'backend' };
      }
    } catch (error) {
      console.warn('[evaluationService] Backend getInterviewResults failed, checking local storage:', error.message);
    }

    // Local storage evaluation result fallback
    const localResults = JSON.parse(localStorage.getItem('interviewprep_latest_result') || 'null');
    if (localResults && String(localResults.interviewId) === String(interviewId)) {
      return { ...localResults, source: 'local' };
    }

    return null;
  },

  /**
   * Evaluate a single answer (used in live sessions)
   */
  async evaluateSingleAnswer(question, expectedConcepts, studentAnswer, technology) {
    // 1. First try calling the Python AI microservice directly if reachable
    try {
      const directAiRes = await api.post('http://localhost:8000/api/v1/evaluation/evaluate', {
        question: question.questionText || question.question,
        expectedConcepts: expectedConcepts || question.expectedConcepts || [],
        studentAnswer: studentAnswer || '',
        technology: technology || 'General'
      }, { timeout: 8000 });

      if (directAiRes.data && directAiRes.data.score !== undefined) {
        return { ...directAiRes.data, source: 'ai-microservice' };
      }
    } catch (e) {
      // Direct microservice unavailable, fall through
    }

    // 2. Use local deterministic rule-based evaluation engine
    const localEval = evaluateAnswerLocally(question, studentAnswer);
    return { ...localEval, source: 'local-rule-engine' };
  },

  /**
   * Compute overall interview score locally if needed
   */
  computeOverallScore(evaluations) {
    return computeOverallInterviewScore(evaluations);
  }
};

export default evaluationService;
