package com.interviewprep.repository;

import com.interviewprep.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT AVG(i.totalScore) FROM Interview i WHERE i.user.id = :userId AND i.status = 'COMPLETED'")
    Double getAverageScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT MAX(i.totalScore) FROM Interview i WHERE i.user.id = :userId AND i.status = 'COMPLETED'")
    Integer getBestScoreByUserId(@Param("userId") Long userId);

    Long countByUserIdAndStatus(Long userId, String status);

    Long countByUserId(Long userId);
}
