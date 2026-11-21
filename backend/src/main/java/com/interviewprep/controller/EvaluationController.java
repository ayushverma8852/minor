package com.interviewprep.controller;

import com.interviewprep.dto.EvaluationResultDto;
import com.interviewprep.security.UserPrincipal;
import com.interviewprep.service.EvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<EvaluationResultDto> getInterviewResults(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable("id") Long interviewId
    ) {
        EvaluationResultDto results = evaluationService.getInterviewResults(interviewId, userPrincipal.getId());
        return ResponseEntity.ok(results);
    }
}
