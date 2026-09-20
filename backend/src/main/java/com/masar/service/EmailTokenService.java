package com.masar.service;

import com.masar.model.AppUser;
import com.masar.model.EmailToken;
import com.masar.repository.EmailTokenRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Optional;

@Service
public class EmailTokenService {

    public static final String VERIFY_EMAIL = "VERIFY_EMAIL";
    public static final String RESET_PASSWORD = "RESET_PASSWORD";

    private final EmailTokenRepository tokens;
    private final SecureRandom random = new SecureRandom();

    public EmailTokenService(EmailTokenRepository tokens) {
        this.tokens = tokens;
    }

    public String issue(AppUser user, String purpose, long validForHoursOrMinutes, ChronoUnit unit) {
        EmailToken t = new EmailToken();
        t.setUser(user);
        t.setPurpose(purpose);
        t.setToken(randomToken());
        t.setExpiresAt(Instant.now().plus(validForHoursOrMinutes, unit));
        tokens.save(t);
        return t.getToken();
    }

    /** Validates and marks the token used. Returns the associated user, or empty if invalid/expired/used. */
    public Optional<AppUser> consume(String token, String purpose) {
        Optional<EmailToken> found = tokens.findByTokenAndPurpose(token, purpose)
                .filter(t -> !t.isUsed())
                .filter(t -> t.getExpiresAt().isAfter(Instant.now()));

        found.ifPresent(t -> {
            t.setUsed(true);
            tokens.save(t);
        });

        return found.map(EmailToken::getUser);
    }

    private String randomToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
