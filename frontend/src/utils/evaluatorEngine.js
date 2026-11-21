/**
 * Deterministic Rule-Based AI Evaluation Engine
 * Evaluates candidate responses transparently based on:
 * 1. Answer Relevance (0-25)
 * 2. Keyword Coverage (0-25)
 * 3. Answer Completeness (0-25)
 * 4. Answer Quality & Structure (0-25)
 * 
 * Note: Transparent prototype scoring engine as required by project specifications.
 */

export function evaluateQuestionAnswer(question, rawAnswer = '') {
  const answer = (rawAnswer || '').trim();
  const lowerAnswer = answer.toLowerCase();
  const words = answer ? answer.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // Case 1: Empty or blank answer
  if (wordCount === 0) {
    return {
      questionId: question.id,
      questionNumber: 0,
      topic: question.topic,
      technology: question.technology,
      difficulty: question.difficulty,
      questionText: question.question,
      candidateAnswer: 'No response submitted for this question.',
      score: 0,
      relevanceScore: 0,
      keywordScore: 0,
      completenessScore: 0,
      qualityScore: 0,
      matchedKeywords: [],
      missedKeywords: question.keywords || [],
      strengths: [],
      weaknesses: ['Question was skipped or left unanswered.'],
      feedback: 'No response was provided. Review the model answer below to study the expected concepts.',
      sampleIdealAnswer: question.sampleIdealAnswer
    };
  }

  // 1. Keyword Coverage (0 - 25)
  const keywords = question.keywords || [];
  const matchedKeywords = [];
  const missedKeywords = [];

  keywords.forEach(kw => {
    const kwLower = kw.toLowerCase();
    // Match whole word or substring
    if (lowerAnswer.includes(kwLower)) {
      matchedKeywords.push(kw);
    } else {
      missedKeywords.push(kw);
    }
  });

  const keywordRatio = keywords.length > 0 ? (matchedKeywords.length / keywords.length) : 0.8;
  const keywordScore = Math.min(25, Math.max(4, Math.round(keywordRatio * 25)));

  // 2. Answer Completeness (0 - 25)
  let completenessScore = 8;
  let completenessFeedback = '';
  if (wordCount < 15) {
    completenessScore = 8;
    completenessFeedback = 'Answer is very brief; lacks necessary technical depth and context.';
  } else if (wordCount < 35) {
    completenessScore = 14;
    completenessFeedback = 'Fair summary, but leaves out supporting details or architectural nuances.';
  } else if (wordCount < 70) {
    completenessScore = 19;
    completenessFeedback = 'Good answer length and adequate coverage of technical aspects.';
  } else if (wordCount < 120) {
    completenessScore = 23;
    completenessFeedback = 'Substantial, well-rounded explanation covering core mechanisms.';
  } else {
    completenessScore = 25;
    completenessFeedback = 'Comprehensive, highly detailed response with thorough elaboration.';
  }

  // 3. Answer Relevance (0 - 25)
  // Check overlap with question keywords, topic, and domain tokens
  const topicWords = (question.topic || '').toLowerCase().split(/[\s,&()]+/).filter(w => w.length > 3);
  const topicOverlap = topicWords.filter(tw => lowerAnswer.includes(tw)).length;
  let relevanceScore = 12;

  if (keywordRatio >= 0.5 || topicOverlap > 0) {
    relevanceScore = Math.min(25, 16 + Math.min(9, topicOverlap * 3 + Math.round(keywordRatio * 5)));
  } else if (wordCount > 30) {
    relevanceScore = 14;
  } else {
    relevanceScore = 10;
  }

  // 4. Quality & Technical Structure (0 - 25)
  // Look for technical phrasing, trade-off words, structure cues
  const qualityTokens = [
    'because', 'for example', 'for instance', 'however', 'trade-off', 'performance',
    'difference', 'specifically', 'mechanism', 'advantage', 'under the hood', 'instead',
    'complexity', 'memory', 'runtime', 'interface', 'architecture', 'method'
  ];
  const detectedTokens = qualityTokens.filter(t => lowerAnswer.includes(t));
  let qualityScore = 12 + Math.min(13, detectedTokens.length * 3);
  if (wordCount > 50 && detectedTokens.length >= 2) {
    qualityScore = Math.max(qualityScore, 21);
  }

  // Total Score for Question (0 - 100)
  const questionTotal = Math.min(100, Math.max(10, relevanceScore + keywordScore + completenessScore + qualityScore));

  // Derive Strengths
  const strengths = [];
  if (matchedKeywords.length >= 2) {
    strengths.push(`Strong vocabulary: accurately incorporated key terms (${matchedKeywords.slice(0, 3).join(', ')}).`);
  }
  if (wordCount >= 45) {
    strengths.push(`Good communicative clarity with structured depth (${wordCount} words).`);
  }
  if (detectedTokens.length >= 2) {
    strengths.push(`Included analytical reasoning and contextual examples (${detectedTokens.slice(0, 2).join(', ')}).`);
  }
  if (strengths.length === 0) {
    strengths.push('Provided a basic conceptual starting point.');
  }

  // Derive Weaknesses
  const weaknesses = [];
  if (missedKeywords.length > 0) {
    weaknesses.push(`Omitted expected technical topics: ${missedKeywords.slice(0, 3).join(', ')}.`);
  }
  if (wordCount < 35) {
    weaknesses.push('Could be more expansive: technical interviewers expect thorough architectural rationales.');
  }
  if (detectedTokens.length < 1) {
    weaknesses.push('Lacked concrete examples, edge-case discussion, or performance trade-offs.');
  }

  // Specific question feedback
  let feedback = '';
  if (questionTotal >= 85) {
    feedback = 'Excellent answer! You demonstrated solid command of the underlying mechanisms and precise terminology.';
  } else if (questionTotal >= 70) {
    feedback = 'Solid response. You communicated the main concept well; elaborating on edge cases and concrete examples will elevate it further.';
  } else {
    feedback = 'Basic foundation present, but lacks critical keywords and architectural depth expected in technical rounds.';
  }

  return {
    questionId: question.id,
    questionNumber: 0, // Assigned by caller
    topic: question.topic,
    technology: question.technology,
    difficulty: question.difficulty,
    questionText: question.question,
    candidateAnswer: answer,
    score: questionTotal,
    relevanceScore,
    keywordScore,
    completenessScore,
    qualityScore,
    matchedKeywords,
    missedKeywords,
    strengths,
    weaknesses,
    feedback,
    sampleIdealAnswer: question.sampleIdealAnswer
  };
}

/**
 * Evaluates full session of answered questions
 */
export function evaluateInterviewSession({
  config,
  questions,
  answers,
  timeElapsedSeconds = 600
}) {
  const reviews = questions.map((q, idx) => {
    const candidateAns = answers[q.id] || '';
    const review = evaluateQuestionAnswer(q, candidateAns);
    review.questionNumber = idx + 1;
    return review;
  });

  const totalScoreSum = reviews.reduce((sum, r) => sum + r.score, 0);
  const avgScore = questions.length > 0 ? Math.round(totalScoreSum / questions.length) : 75;

  const avgRelevance = Math.round(reviews.reduce((s, r) => s + r.relevanceScore, 0) / (reviews.length || 1));
  const avgKeywords = Math.round(reviews.reduce((s, r) => s + r.keywordScore, 0) / (reviews.length || 1));
  const avgCompleteness = Math.round(reviews.reduce((s, r) => s + r.completenessScore, 0) / (reviews.length || 1));
  const avgQuality = Math.round(reviews.reduce((s, r) => s + r.qualityScore, 0) / (reviews.length || 1));

  let grade = 'Strong Hire';
  let gradeColor = 'emerald';
  let summaryHeadline = '';

  if (avgScore >= 85) {
    grade = 'Strong Hire';
    gradeColor = 'emerald';
    summaryHeadline = 'Exceptional performance demonstrating in-depth conceptual grasp and clear communicative clarity.';
  } else if (avgScore >= 72) {
    grade = 'Hire';
    gradeColor = 'brand';
    summaryHeadline = 'Solid candidate with good technical grounding. Minor refinements in edge-case handling recommended.';
  } else if (avgScore >= 55) {
    grade = 'Borderline';
    gradeColor = 'amber';
    summaryHeadline = 'Demonstrates basic conceptual awareness, but answers lacked consistent keyword precision and depth.';
  } else {
    grade = 'Needs Practice';
    gradeColor = 'rose';
    summaryHeadline = 'Several key questions were skipped or answered minimally. Dedicated practice and study recommended.';
  }

  // Aggregate overarching strengths
  const allStrengths = [];
  reviews.forEach(r => {
    r.strengths.forEach(s => {
      if (!allStrengths.includes(s) && allStrengths.length < 4) {
        allStrengths.push(s);
      }
    });
  });

  // Aggregate overarching weaknesses
  const allWeaknesses = [];
  reviews.forEach(r => {
    r.weaknesses.forEach(w => {
      if (!allWeaknesses.includes(w) && allWeaknesses.length < 4) {
        allWeaknesses.push(w);
      }
    });
  });

  const durationMins = Math.max(1, Math.round(timeElapsedSeconds / 60));
  const now = new Date();

  return {
    id: `eval-${Date.now()}`,
    interviewId: `int-${Date.now()}`,
    technology: config.technology || 'Java',
    roleTitle: `${config.technology || 'Java'} Developer`,
    difficulty: config.difficulty || 'Intermediate',
    interviewType: config.interviewType || 'Technical',
    date: now.toISOString().split('T')[0],
    completedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    durationMinutes: durationMins,
    overallScore: avgScore,
    grade,
    gradeColor,
    summaryHeadline,
    detailedMetrics: [
      { name: 'Answer Relevance', score: avgRelevance * 4, maxScore: 100, label: 'Direct alignment with interview topic and problem' },
      { name: 'Keyword Coverage', score: avgKeywords * 4, maxScore: 100, label: 'Inclusion of expected domain terminology and concepts' },
      { name: 'Completeness & Depth', score: avgCompleteness * 4, maxScore: 100, label: 'Elaboration, substance, and thoroughness of answers' },
      { name: 'Quality & Structure', score: avgQuality * 4, maxScore: 100, label: 'Logical phrasing, examples, and technical clarity' }
    ],
    strengths: allStrengths.length > 0 ? allStrengths : [
      'Good engagement with technical problem statements',
      'Demonstrated fundamental understanding of basic concepts'
    ],
    areasForImprovement: allWeaknesses.length > 0 ? allWeaknesses : [
      'Expand on real-world edge cases and trade-offs in answers',
      'Incorporate specific syntax and architectural terminology'
    ],
    questionReviews: reviews
  };
}

export const evaluateAnswerLocally = evaluateQuestionAnswer;

export function computeOverallInterviewScore(evaluations = []) {
  if (!evaluations || !evaluations.length) return 0;
  const sum = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0);
  return Math.round(sum / evaluations.length);
}
