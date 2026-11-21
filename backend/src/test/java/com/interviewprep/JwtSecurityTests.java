package com.interviewprep;

import com.interviewprep.entity.User;
import com.interviewprep.security.JwtTokenProvider;
import com.interviewprep.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;

class JwtSecurityTests {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secret, expirationMs);
    }

    @Test
    void testGenerateAndValidateValidToken() {
        User user = new User("demouser", "demo@interviewprep.ai", "hash", "Demo User");
        user.setId(42L);
        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        String token = jwtTokenProvider.generateToken(auth);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(42L, jwtTokenProvider.getUserIdFromJWT(token));
    }

    @Test
    void testValidateMalformedTokenFails() {
        String malformedToken = "invalid.token.structure";
        assertFalse(jwtTokenProvider.validateToken(malformedToken));
    }

    @Test
    void testValidateExpiredTokenFails() {
        // Expired provider with 0ms expiration
        JwtTokenProvider expiredProvider = new JwtTokenProvider(secret, -1000);
        User user = new User("expiredUser", "exp@test.com", "hash", "Expired");
        user.setId(99L);
        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        String token = expiredProvider.generateToken(auth);
        assertFalse(jwtTokenProvider.validateToken(token));
    }
}
