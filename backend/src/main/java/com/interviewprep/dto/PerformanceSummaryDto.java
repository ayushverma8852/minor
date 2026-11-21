package com.interviewprep.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PerformanceSummaryDto {
    private Long totalInterviews = 0L;
    private Double averageScore = 0.0;
    private Integer bestScore = 0;
    private Long completedInterviews = 0L;
    private List<InterviewResponse> recentInterviews = new ArrayList<>();
    private Map<String, Double> technologyAverageScores = new HashMap<>();

    public PerformanceSummaryDto() {}

    public Long getTotalInterviews() { return totalInterviews; }
    public void setTotalInterviews(Long totalInterviews) { this.totalInterviews = totalInterviews; }

    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }

    public Integer getBestScore() { return bestScore; }
    public void setBestScore(Integer bestScore) { this.bestScore = bestScore; }

    public Long getCompletedInterviews() { return completedInterviews; }
    public void setCompletedInterviews(Long completedInterviews) { this.completedInterviews = completedInterviews; }

    public List<InterviewResponse> getRecentInterviews() { return recentInterviews; }
    public void setRecentInterviews(List<InterviewResponse> recentInterviews) { this.recentInterviews = recentInterviews; }

    public Map<String, Double> getTechnologyAverageScores() { return technologyAverageScores; }
    public void setTechnologyAverageScores(Map<String, Double> technologyAverageScores) { this.technologyAverageScores = technologyAverageScores; }
}
