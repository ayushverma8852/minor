package com.interviewprep.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class EvaluationResultDto {
    private Long interviewId;
    private String technology;
    private String difficulty;
    private String interviewType;
    private Integer overallScore;
    private LocalDateTime completedAt;
    private List<QuestionEvaluationDto> questions = new ArrayList<>();
    private List<String> overallStrengths = new ArrayList<>();
    private List<String> overallWeaknesses = new ArrayList<>();
    private List<String> recommendedTopics = new ArrayList<>();

    public EvaluationResultDto() {}

    public Long getInterviewId() { return interviewId; }
    public void setInterviewId(Long interviewId) { this.interviewId = interviewId; }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public List<QuestionEvaluationDto> getQuestions() { return questions; }
    public void setQuestions(List<QuestionEvaluationDto> questions) { this.questions = questions; }

    public List<String> getOverallStrengths() { return overallStrengths; }
    public void setOverallStrengths(List<String> overallStrengths) { this.overallStrengths = overallStrengths; }

    public List<String> getOverallWeaknesses() { return overallWeaknesses; }
    public void setOverallWeaknesses(List<String> overallWeaknesses) { this.overallWeaknesses = overallWeaknesses; }

    public List<String> getRecommendedTopics() { return recommendedTopics; }
    public void setRecommendedTopics(List<String> recommendedTopics) { this.recommendedTopics = recommendedTopics; }
}
