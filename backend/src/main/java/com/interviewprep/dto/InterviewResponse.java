package com.interviewprep.dto;

import com.interviewprep.entity.Interview;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class InterviewResponse {
    private Long id;
    private String technology;
    private String difficulty;
    private String interviewType;
    private String status;
    private Integer totalQuestions;
    private Integer totalScore;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private List<QuestionDto> questions = new ArrayList<>();

    public InterviewResponse() {}

    public static InterviewResponse fromEntity(Interview interview) {
        InterviewResponse dto = new InterviewResponse();
        dto.setId(interview.getId());
        dto.setTechnology(interview.getTechnology());
        dto.setDifficulty(interview.getDifficulty());
        dto.setInterviewType(interview.getInterviewType());
        dto.setStatus(interview.getStatus());
        dto.setTotalQuestions(interview.getTotalQuestions());
        dto.setTotalScore(interview.getTotalScore());
        dto.setCreatedAt(interview.getCreatedAt());
        dto.setCompletedAt(interview.getCompletedAt());
        if (interview.getQuestions() != null) {
            dto.setQuestions(interview.getQuestions().stream()
                .map(QuestionDto::fromEntity)
                .collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public List<QuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDto> questions) { this.questions = questions; }
}
