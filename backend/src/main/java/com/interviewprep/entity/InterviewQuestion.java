package com.interviewprep.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_questions")
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(name = "question_order", nullable = false)
    private Integer questionOrder;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(length = 100)
    private String topic;

    @Column(length = 50)
    private String difficulty;

    @Column(name = "expected_concepts", columnDefinition = "TEXT")
    private String expectedConcepts;

    @Column(name = "sample_ideal_answer", columnDefinition = "TEXT")
    private String sampleIdealAnswer;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public InterviewQuestion() {}

    public InterviewQuestion(Interview interview, Integer questionOrder, String questionText,
                             String topic, String difficulty, String expectedConcepts, String sampleIdealAnswer) {
        this.interview = interview;
        this.questionOrder = questionOrder;
        this.questionText = questionText;
        this.topic = topic;
        this.difficulty = difficulty;
        this.expectedConcepts = expectedConcepts;
        this.sampleIdealAnswer = sampleIdealAnswer;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Interview getInterview() { return interview; }
    public void setInterview(Interview interview) { this.interview = interview; }

    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getExpectedConcepts() { return expectedConcepts; }
    public void setExpectedConcepts(String expectedConcepts) { this.expectedConcepts = expectedConcepts; }

    public String getSampleIdealAnswer() { return sampleIdealAnswer; }
    public void setSampleIdealAnswer(String sampleIdealAnswer) { this.sampleIdealAnswer = sampleIdealAnswer; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
