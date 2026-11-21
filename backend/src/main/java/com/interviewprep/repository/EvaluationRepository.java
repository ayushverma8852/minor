package com.interviewprep.repository;

import com.interviewprep.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByInterviewId(Long interviewId);
    Optional<Evaluation> findByInterviewIdAndQuestionId(Long interviewId, Long questionId);
}
