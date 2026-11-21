package com.interviewprep.dto;

import jakarta.validation.constraints.NotNull;

public class SubmitAnswerRequest {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String studentAnswer;

    public SubmitAnswerRequest() {}

    public SubmitAnswerRequest(Long questionId, String studentAnswer) {
        this.questionId = questionId;
        this.studentAnswer = studentAnswer;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
}
