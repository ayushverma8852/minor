package com.interviewprep.controller;

import com.interviewprep.dto.PerformanceAnalyticsDto;
import com.interviewprep.dto.PerformanceSummaryDto;
import com.interviewprep.security.UserPrincipal;
import com.interviewprep.service.PerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @GetMapping("/summary")
    public ResponseEntity<PerformanceSummaryDto> getSummary(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        PerformanceSummaryDto summary = performanceService.getPerformanceSummary(userPrincipal.getId());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/analytics")
    public ResponseEntity<PerformanceAnalyticsDto> getAnalytics(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        PerformanceAnalyticsDto analytics = performanceService.getPerformanceAnalytics(userPrincipal.getId());
        return ResponseEntity.ok(analytics);
    }
}
