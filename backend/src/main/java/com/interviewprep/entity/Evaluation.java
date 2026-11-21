package com.interviewprep.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private InterviewQuestion question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", nullable = false)
    private InterviewAnswer answer;

    @Column(nullable = false)
    private Integer score = 0;

    @Column(nullable = false)
    private Integer correctness = 0;

    @Column(nullable = false)
    private Integer relevance = 0;

    @Column(nullable = false)
    private Integer completeness = 0;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    @Column(name = "improvement_suggestions", columnDefinition = "TEXT")
    private String improvementSuggestions;

    @Column(name = "matched_concepts", columnDefinition = "TEXT")
    private String matchedConcepts;

    @Column(name = "missed_concepts", columnDefinition = "TEXT")
    private String missedConcepts;

    @Column(name = "model_answer", columnDefinition = "LONGTEXT")
    private String modelAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "ai_provider", length = 50)
    private String aiProvider = "mock";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Evaluation() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Interview getInterview() { return interview; }
    public void setInterview(Interview interview) { this.interview = interview; }

    public InterviewQuestion getQuestion() { return question; }
    public void setQuestion(InterviewQuestion question) { this.question = question; }

    public InterviewAnswer getAnswer() { return answer; }
    public void setAnswer(InterviewAnswer answer) { this.answer = answer; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getCorrectness() { return correctness; }
    public void setCorrectness(Integer correctness) { this.correctness = correctness; }

    public Integer getRelevance() { return relevance; }
    public void setRelevance(Integer relevance) { this.relevance = relevance; }

    public Integer getCompleteness() { return completeness; }
    public void setCompleteness(Integer completeness) { this.completeness = completeness; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }

    public String getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }

    public String getMatchedConcepts() { return matchedConcepts; }
    public void setMatchedConcepts(String matchedConcepts) { this.matchedConcepts = matchedConcepts; }

    public String getMissedConcepts() { return missedConcepts; }
    public void setMissedConcepts(String missedConcepts) { this.missedConcepts = missedConcepts; }

    public String getModelAnswer() { return modelAnswer; }
    public void setModelAnswer(String modelAnswer) { this.modelAnswer = modelAnswer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getAiProvider() { return aiProvider; }
    public void setAiProvider(String aiProvider) { this.aiProvider = aiProvider; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
