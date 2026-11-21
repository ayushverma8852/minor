package com.interviewprep.dto.ai;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AiEvaluationResponse {
    private Integer score = 0;
    private Integer correctness = 0;
    private Integer relevance = 0;
    private Integer completeness = 0;
    private List<String> strengths = new ArrayList<>();
    private List<String> weaknesses = new ArrayList<>();

    @JsonAlias({"improvements", "improvementSuggestions"})
    private List<String> improvements = new ArrayList<>();

    private String modelAnswer;
    private List<String> matchedConcepts = new ArrayList<>();

    @JsonAlias({"missingConcepts", "missedConcepts"})
    private List<String> missingConcepts = new ArrayList<>();

    private String explanation = "";
    private String provider;

    public AiEvaluationResponse() {}

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getCorrectness() { return correctness; }
    public void setCorrectness(Integer correctness) { this.correctness = correctness; }

    public Integer getRelevance() { return relevance; }
    public void setRelevance(Integer relevance) { this.relevance = relevance; }

    public Integer getCompleteness() { return completeness; }
    public void setCompleteness(Integer completeness) { this.completeness = completeness; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }

    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) { this.improvements = improvements; }

    public List<String> getImprovementSuggestions() { return improvements; }
    public void setImprovementSuggestions(List<String> suggestions) { this.improvements = suggestions; }

    public String getModelAnswer() { return modelAnswer; }
    public void setModelAnswer(String modelAnswer) { this.modelAnswer = modelAnswer; }

    public List<String> getMatchedConcepts() { return matchedConcepts; }
    public void setMatchedConcepts(List<String> matchedConcepts) { this.matchedConcepts = matchedConcepts; }

    public List<String> getMissingConcepts() { return missingConcepts; }
    public void setMissingConcepts(List<String> missingConcepts) { this.missingConcepts = missingConcepts; }

    public List<String> getMissedConcepts() { return missingConcepts; }
    public void setMissedConcepts(List<String> missedConcepts) { this.missingConcepts = missedConcepts; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
}
