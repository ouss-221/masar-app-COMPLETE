package com.masar.service;

import com.masar.model.AppUser;
import com.masar.model.RefreshToken;
import com.masar.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokens;
    private final long expirationMs;
    private final SecureRandom random = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository refreshTokens,
                                @Value("${masar.refresh.expiration-ms}") long expirationMs) {
        this.refreshTokens = refreshTokens;
        this.expirationMs = expirationMs;
    }

    public RefreshToken issue(AppUser user) {
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(randomToken());
        rt.setExpiresAt(Instant.now().plusMillis(expirationMs));
        return refreshTokens.save(rt);
    }

    /** Validates the given token and, if valid, revokes it and issues a fresh one (rotation). */
    public RefreshToken rotate(String token) {
        RefreshToken existing = refreshTokens.findByToken(token)
                .filter(rt -> !rt.isRevoked())
                .filter(rt -> rt.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired refresh token"));

        existing.setRevoked(true);
        refreshTokens.save(existing);

        return issue(existing.getUser());
    }

    public void revoke(String token) {
        refreshTokens.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokens.save(rt);
        });
    }

    private String randomToken() {
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
