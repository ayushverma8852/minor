package com.interviewprep.controller;

import com.interviewprep.dto.AuthResponse;
import com.interviewprep.dto.LoginRequest;
import com.interviewprep.dto.RegisterRequest;
import com.interviewprep.dto.UserResponse;
import com.interviewprep.security.UserPrincipal;
import com.interviewprep.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = authService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @RequestBody Map<String, String> payload
    ) {
        String fullName = payload.get("fullName");
        String email = payload.get("email");
        UserResponse updated = authService.updateProfile(userPrincipal.getId(), fullName, email);
        return ResponseEntity.ok(updated);
    }
}
