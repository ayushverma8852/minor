package com.interviewprep.dto.ai;

public class AiGenerateQuestionsRequest {
    private String technology;
    private String difficulty;
    private String interviewType;
    private Integer numberOfQuestions;

    public AiGenerateQuestionsRequest() {}

    public AiGenerateQuestionsRequest(String technology, String difficulty, String interviewType, Integer numberOfQuestions) {
        this.technology = technology;
        this.difficulty = difficulty;
        this.interviewType = interviewType;
        this.numberOfQuestions = numberOfQuestions;
    }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }

    public Integer getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }
}
