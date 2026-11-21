package com.interviewprep.service;

import com.interviewprep.dto.InterviewResponse;
import com.interviewprep.dto.PerformanceAnalyticsDto;
import com.interviewprep.dto.PerformanceSummaryDto;
import com.interviewprep.entity.Evaluation;
import com.interviewprep.entity.Interview;
import com.interviewprep.repository.EvaluationRepository;
import com.interviewprep.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private final InterviewRepository interviewRepository;
    private final EvaluationRepository evaluationRepository;

    public PerformanceService(InterviewRepository interviewRepository, EvaluationRepository evaluationRepository) {
        this.interviewRepository = interviewRepository;
        this.evaluationRepository = evaluationRepository;
    }

    @Transactional(readOnly = true)
    public PerformanceSummaryDto getPerformanceSummary(Long userId) {
        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        PerformanceSummaryDto summary = new PerformanceSummaryDto();

        summary.setTotalInterviews((long) interviews.size());

        List<Interview> completed = interviews.stream()
            .filter(i -> "COMPLETED".equals(i.getStatus()) && i.getTotalScore() != null)
            .collect(Collectors.toList());

        summary.setCompletedInterviews((long) completed.size());

        if (!completed.isEmpty()) {
            double avg = completed.stream().mapToInt(Interview::getTotalScore).average().orElse(0.0);
            int best = completed.stream().mapToInt(Interview::getTotalScore).max().orElse(0);
            summary.setAverageScore(Math.round(avg * 10.0) / 10.0);
            summary.setBestScore(best);
        }

        summary.setRecentInterviews(
            interviews.stream().limit(5).map(InterviewResponse::fromEntity).collect(Collectors.toList())
        );

        Map<String, List<Integer>> techScores = new HashMap<>();
        for (Interview i : completed) {
            techScores.computeIfAbsent(i.getTechnology(), k -> new ArrayList<>()).add(i.getTotalScore());
        }

        Map<String, Double> techAverages = new HashMap<>();
        techScores.forEach((tech, scores) -> {
            double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            techAverages.put(tech, Math.round(avg * 10.0) / 10.0);
        });
        summary.setTechnologyAverageScores(techAverages);

        return summary;
    }

    @Transactional(readOnly = true)
    public PerformanceAnalyticsDto getPerformanceAnalytics(Long userId) {
        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        PerformanceAnalyticsDto analytics = new PerformanceAnalyticsDto();

        List<Interview> completed = interviews.stream()
            .filter(i -> "COMPLETED".equals(i.getStatus()) && i.getTotalScore() != null)
            .sorted(Comparator.comparing(Interview::getCreatedAt))
            .collect(Collectors.toList());

        if (completed.isEmpty()) {
            return analytics;
        }

        double overallAvg = completed.stream().mapToInt(Interview::getTotalScore).average().orElse(0.0);
        int best = completed.stream().mapToInt(Interview::getTotalScore).max().orElse(0);
        analytics.setOverallAverageScore(Math.round(overallAvg * 10.0) / 10.0);
        analytics.setBestScore(best);

        // Score trend
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        List<Map<String, Object>> trend = new ArrayList<>();
        for (Interview i : completed) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", i.getCreatedAt().format(formatter));
            point.put("score", i.getTotalScore());
            point.put("technology", i.getTechnology());
            trend.add(point);
        }
        analytics.setScoreTrend(trend);

        // Technology performance
        Map<String, List<Integer>> techScores = new HashMap<>();
        for (Interview i : completed) {
            techScores.computeIfAbsent(i.getTechnology(), k -> new ArrayList<>()).add(i.getTotalScore());
        }

        List<Map<String, Object>> techList = new ArrayList<>();
        techScores.forEach((tech, scores) -> {
            double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            Map<String, Object> m = new HashMap<>();
            m.put("technology", tech);
            m.put("averageScore", Math.round(avg * 10.0) / 10.0);
            m.put("interviewsCount", scores.size());
            techList.add(m);
        });
        analytics.setTechnologyPerformance(techList);

        // Strong vs Weak topics from individual evaluations
        Map<String, List<Integer>> topicScores = new HashMap<>();
        for (Interview i : completed) {
            List<Evaluation> evals = evaluationRepository.findByInterviewId(i.getId());
            for (Evaluation e : evals) {
                if (e.getQuestion() != null && e.getQuestion().getTopic() != null) {
                    topicScores.computeIfAbsent(e.getQuestion().getTopic(), k -> new ArrayList<>()).add(e.getScore());
                }
            }
        }

        List<String> strong = new ArrayList<>();
        List<String> weak = new ArrayList<>();
        topicScores.forEach((topic, scores) -> {
            double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            if (avg >= 75) {
                strong.add(topic);
            } else if (avg < 70) {
                weak.add(topic);
            }
        });

        analytics.setStrongTopics(strong);
        analytics.setWeakTopics(weak);

        return analytics;
    }
}
