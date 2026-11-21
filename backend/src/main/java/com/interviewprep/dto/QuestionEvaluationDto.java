package com.interviewprep.dto;

import java.util.ArrayList;
import java.util.List;

public class QuestionEvaluationDto {
    private Long questionId;
    private String questionText;
    private String topic;
    private String studentAnswer;
    private String modelAnswer;
    private Integer score;
    private Integer correctness;
    private Integer relevance;
    private Integer completeness;
    private List<String> strengths = new ArrayList<>();
    private List<String> weaknesses = new ArrayList<>();
    private List<String> improvements = new ArrayList<>();
    private List<String> missingConcepts = new ArrayList<>();
    private List<String> matchedConcepts = new ArrayList<>();
    private String explanation = "";
    private String aiProvider;

    public QuestionEvaluationDto() {}

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }

    public String getModelAnswer() { return modelAnswer; }
    public void setModelAnswer(String modelAnswer) { this.modelAnswer = modelAnswer; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getCorrectness() { return correctness; }
    public void setCorrectness(Integer correctness) { this.correctness = correctness; }

    public Integer getRelevance() { return relevance; }
    public void setRelevance(Integer relevance) { this.relevance = relevance; }

    public Integer getCompleteness() { return completeness; }
    public void setCompleteness(Integer completeness) { this.completeness = completeness; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }

    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) { this.improvements = improvements; }

    public List<String> getImprovementSuggestions() { return improvements; }
    public void setImprovementSuggestions(List<String> suggestions) { this.improvements = suggestions; }

    public List<String> getMissingConcepts() { return missingConcepts; }
    public void setMissingConcepts(List<String> missingConcepts) { this.missingConcepts = missingConcepts; }

    public List<String> getMissedConcepts() { return missingConcepts; }
    public void setMissedConcepts(List<String> missedConcepts) { this.missingConcepts = missedConcepts; }

    public List<String> getMatchedConcepts() { return matchedConcepts; }
    public void setMatchedConcepts(List<String> matchedConcepts) { this.matchedConcepts = matchedConcepts; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getAiProvider() { return aiProvider; }
    public void setAiProvider(String aiProvider) { this.aiProvider = aiProvider; }
}
