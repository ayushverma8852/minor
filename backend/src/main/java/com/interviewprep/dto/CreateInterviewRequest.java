package com.interviewprep.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateInterviewRequest {
    @NotBlank(message = "Technology is required (e.g. Java, Python, React, SQL)")
    private String technology;

    @NotBlank(message = "Difficulty is required (Beginner, Intermediate, Advanced)")
    private String difficulty;

    @NotBlank(message = "Interview type is required (Technical, HR, Mixed)")
    private String interviewType;

    @NotNull(message = "Number of questions is required")
    @Min(value = 1, message = "Minimum 1 question")
    @Max(value = 15, message = "Maximum 15 questions")
    private Integer numberOfQuestions = 5;

    public CreateInterviewRequest() {}

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }

    public Integer getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }
}
