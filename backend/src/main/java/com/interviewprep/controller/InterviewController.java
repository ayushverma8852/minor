package com.interviewprep.controller;

import com.interviewprep.dto.CreateInterviewRequest;
import com.interviewprep.dto.InterviewResponse;
import com.interviewprep.dto.SubmitAnswerRequest;
import com.interviewprep.security.UserPrincipal;
import com.interviewprep.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> createInterview(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @Valid @RequestBody CreateInterviewRequest request
    ) {
        InterviewResponse response = interviewService.createInterview(userPrincipal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getUserInterviews(
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<InterviewResponse> interviews = interviewService.getUserInterviews(userPrincipal.getId());
        return ResponseEntity.ok(interviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable("id") Long interviewId
    ) {
        InterviewResponse response = interviewService.getInterviewById(interviewId, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Map<String, String>> submitAnswer(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable("id") Long interviewId,
        @Valid @RequestBody SubmitAnswerRequest request
    ) {
        interviewService.submitAnswer(interviewId, userPrincipal.getId(), request);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Answer submitted successfully"));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<InterviewResponse> completeInterview(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable("id") Long interviewId
    ) {
        InterviewResponse response = interviewService.completeInterview(interviewId, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteInterview(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable("id") Long interviewId
    ) {
        interviewService.deleteInterview(interviewId, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("status", "success", "message", "Interview deleted successfully"));
    }
}
