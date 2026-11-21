package com.interviewprep.dto.ai;

import java.util.ArrayList;
import java.util.List;

public class AiEvaluationRequest {
    private String question;
    private List<String> expectedConcepts = new ArrayList<>();
    private String studentAnswer;
    private String technology;

    public AiEvaluationRequest() {}

    public AiEvaluationRequest(String question, List<String> expectedConcepts, String studentAnswer, String technology) {
        this.question = question;
        this.expectedConcepts = expectedConcepts;
        this.studentAnswer = studentAnswer;
        this.technology = technology;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getExpectedConcepts() { return expectedConcepts; }
    public void setExpectedConcepts(List<String> expectedConcepts) { this.expectedConcepts = expectedConcepts; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }
}
