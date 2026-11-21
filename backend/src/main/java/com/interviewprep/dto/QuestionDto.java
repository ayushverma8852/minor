package com.interviewprep.dto;

import com.interviewprep.entity.InterviewQuestion;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class QuestionDto {
    private Long id;
    private Integer questionOrder;
    private String questionText;
    private String topic;
    private String difficulty;
    private List<String> expectedConcepts = new ArrayList<>();
    private String sampleIdealAnswer;

    public QuestionDto() {}

    public static QuestionDto fromEntity(InterviewQuestion q) {
        QuestionDto dto = new QuestionDto();
        dto.setId(q.getId());
        dto.setQuestionOrder(q.getQuestionOrder());
        dto.setQuestionText(q.getQuestionText());
        dto.setTopic(q.getTopic());
        dto.setDifficulty(q.getDifficulty());
        dto.setSampleIdealAnswer(q.getSampleIdealAnswer());
        if (q.getExpectedConcepts() != null && !q.getExpectedConcepts().isBlank()) {
            dto.setExpectedConcepts(Arrays.asList(q.getExpectedConcepts().split(",")));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }

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
