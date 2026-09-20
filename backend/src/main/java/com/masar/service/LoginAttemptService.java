package com.masar.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks failed login attempts per email, in memory. Good enough for a
 * single-instance deployment; if this app ever runs on multiple backend
 * instances behind a load balancer, this would need to move to a shared
 * store (e.g. Redis) since each instance would otherwise count separately.
 */
@Service
public class LoginAttemptService {

    private final int maxAttempts;
    private final long lockoutMinutes;

    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();

    public LoginAttemptService(@Value("${masar.login.max-attempts:5}") int maxAttempts,
                                @Value("${masar.login.lockout-minutes:15}") long lockoutMinutes) {
        this.maxAttempts = maxAttempts;
        this.lockoutMinutes = lockoutMinutes;
    }

    public boolean isLocked(String email) {
        Attempt a = attempts.get(key(email));
        if (a == null) return false;
        if (a.lockedUntil != null && a.lockedUntil.isAfter(Instant.now())) return true;
        if (a.lockedUntil != null && !a.lockedUntil.isAfter(Instant.now())) {
            attempts.remove(key(email)); // lock expired, start clean
        }
        return false;
    }

    public void recordFailure(String email) {
        attempts.compute(key(email), (k, existing) -> {
            Attempt a = existing == null ? new Attempt() : existing;
            a.count++;
            if (a.count >= maxAttempts) {
                a.lockedUntil = Instant.now().plusSeconds(lockoutMinutes * 60);
            }
            return a;
        });
    }

    public void recordSuccess(String email) {
        attempts.remove(key(email));
    }

    private String key(String email) {
        return email.toLowerCase().trim();
    }

    private static class Attempt {
        int count = 0;
        Instant lockedUntil = null;
    }
}
