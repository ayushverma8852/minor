package com.interviewprep.dto.ai;

import java.util.ArrayList;
import java.util.List;

public class AiQuestionItemDto {
    private String questionId;
    private String questionText;
    private String topic;
    private String difficulty;
    private List<String> expectedConcepts = new ArrayList<>();
    private String sampleIdealAnswer;

    public AiQuestionItemDto() {}

    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public List<String> getExpectedConcepts() { return expectedConcepts; }
    public void setExpectedConcepts(List<String> expectedConcepts) { this.expectedConcepts = expectedConcepts; }

    public String getSampleIdealAnswer() { return sampleIdealAnswer; }
    public void setSampleIdealAnswer(String sampleIdealAnswer) { this.sampleIdealAnswer = sampleIdealAnswer; }
}
