package com.interviewprep.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PerformanceAnalyticsDto {
    private List<Map<String, Object>> scoreTrend = new ArrayList<>();
    private List<Map<String, Object>> technologyPerformance = new ArrayList<>();
    private List<String> strongTopics = new ArrayList<>();
    private List<String> weakTopics = new ArrayList<>();
    private Double overallAverageScore = 0.0;
    private Integer bestScore = 0;

    public PerformanceAnalyticsDto() {}

    public List<Map<String, Object>> getScoreTrend() { return scoreTrend; }
    public void setScoreTrend(List<Map<String, Object>> scoreTrend) { this.scoreTrend = scoreTrend; }

    public List<Map<String, Object>> getTechnologyPerformance() { return technologyPerformance; }
    public void setTechnologyPerformance(List<Map<String, Object>> technologyPerformance) { this.technologyPerformance = technologyPerformance; }

    public List<String> getStrongTopics() { return strongTopics; }
    public void setStrongTopics(List<String> strongTopics) { this.strongTopics = strongTopics; }

    public List<String> getWeakTopics() { return weakTopics; }
    public void setWeakTopics(List<String> weakTopics) { this.weakTopics = weakTopics; }

    public Double getOverallAverageScore() { return overallAverageScore; }
    public void setOverallAverageScore(Double overallAverageScore) { this.overallAverageScore = overallAverageScore; }

    public Integer getBestScore() { return bestScore; }
    public void setBestScore(Integer bestScore) { this.bestScore = bestScore; }
}
