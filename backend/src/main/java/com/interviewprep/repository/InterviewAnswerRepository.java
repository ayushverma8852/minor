package com.interviewprep.repository;

import com.interviewprep.entity.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {
    List<InterviewAnswer> findByInterviewId(Long interviewId);
    Optional<InterviewAnswer> findByInterviewIdAndQuestionId(Long interviewId, Long questionId);
}
