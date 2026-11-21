package com.interviewprep.dto.ai;

import java.util.ArrayList;
import java.util.List;

public class AiGenerateQuestionsResponse {
    private String status;
    private String provider;
    private String technology;
    private String difficulty;
    private String interviewType;
    private Integer count;
    private List<AiQuestionItemDto> questions = new ArrayList<>();

    public AiGenerateQuestionsResponse() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }

    public List<AiQuestionItemDto> getQuestions() { return questions; }
    public void setQuestions(List<AiQuestionItemDto> questions) { this.questions = questions; }
}
