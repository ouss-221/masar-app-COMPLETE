package com.masar.controller;

import com.masar.config.JwtUtil;
import com.masar.model.AppUser;
import com.masar.model.RefreshToken;
import com.masar.repository.AppUserRepository;
import com.masar.repository.RefreshTokenRepository;
import com.masar.service.EmailService;
import com.masar.service.EmailTokenService;
import com.masar.service.LoginAttemptService;
import com.masar.service.RefreshTokenService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailTokenService emailTokenService;
    private final EmailService emailService;
    private final LoginAttemptService loginAttemptService;
    private final String frontendUrl;

    public AuthController(AppUserRepository users, PasswordEncoder encoder,
                           JwtUtil jwtUtil, RefreshTokenService refreshTokenService,
                           RefreshTokenRepository refreshTokenRepository,
                           EmailTokenService emailTokenService, EmailService emailService,
                           LoginAttemptService loginAttemptService,
                           @Value("${masar.frontend.url}") String frontendUrl) {
        this.users = users;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailTokenService = emailTokenService;
        this.emailService = emailService;
        this.loginAttemptService = loginAttemptService;
        this.frontendUrl = frontendUrl;
    }

    public record RegisterRequest(
            @Email String email, @NotBlank String password, String displayName,
            String originCountry, String targetCountry, String targetCity, String university, String programType) {}

    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record RefreshRequest(@NotBlank String refreshToken) {}
    public record ForgotPasswordRequest(@Email String email) {}
    public record ResetPasswordRequest(@NotBlank String token, @NotBlank String newPassword) {}
    public record ResendVerificationRequest(@Email String email) {}

    public record AuthResponse(
            String accessToken, String refreshToken, String email, String displayName, String originCountry,
            String targetCountry, String targetCity, String university, String programType, boolean emailVerified) {}

    // id: exposed so the frontend can compare it against an Activity's hostId
    // (see ActivityController.CityActivityView) to show "you're the host"
    // controls, without adding a second lookup endpoint.
    public record ProfileResponse(
            Long id, String email, String displayName, String originCountry, String targetCountry, String targetCity,
            String university, String programType, boolean emailVerified, boolean discoverable, String birthDate) {}

    public record UpdateProfileRequest(
            String displayName, String originCountry, String targetCountry, String targetCity, String university,
            String programType, Boolean discoverable, String birthDate) {}

    public record ChangePasswordRequest(@NotBlank String currentPassword, @NotBlank String newPassword) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (users.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body("An account with this email already exists.");
        }
        AppUser user = new AppUser();
        user.setEmail(req.email());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setDisplayName(req.displayName());
        user.setOriginCountry(req.originCountry());
        user.setTargetCountry(req.targetCountry());
        user.setTargetCity(req.targetCity());
        user.setUniversity(req.university());
        user.setProgramType(req.programType());
        users.save(user);

        sendVerificationEmail(user);

        return ResponseEntity.ok(buildAuthResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (loginAttemptService.isLocked(req.email())) {
            return ResponseEntity.status(429)
                    .body("Too many failed attempts. Please try again in a few minutes.");
        }

        AppUser user = users.findByEmail(req.email()).orElse(null);
        if (user == null || !encoder.matches(req.password(), user.getPasswordHash())) {
            loginAttemptService.recordFailure(req.email());
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        loginAttemptService.recordSuccess(req.email());
        return ResponseEntity.ok(buildAuthResponse(user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest req) {
        try {
            RefreshToken rotated = refreshTokenService.rotate(req.refreshToken());
            AppUser user = rotated.getUser();
            String accessToken = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(
                    accessToken, rotated.getToken(), user.getEmail(), user.getDisplayName(), user.getOriginCountry(),
                    user.getTargetCountry(), user.getTargetCity(), user.getUniversity(), user.getProgramType(), user.isEmailVerified()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body("Session expired, please log in again.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshRequest req) {
        refreshTokenService.revoke(req.refreshToken());
        return ResponseEntity.ok().build();
    }

    // ---- Profile (requires a logged-in user - see SecurityConfig for the auth rule) ----

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        return ResponseEntity.ok(profileDto(currentUser(auth)));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody UpdateProfileRequest req, Authentication auth) {
        AppUser user = currentUser(auth);
        user.setDisplayName(req.displayName());
        user.setOriginCountry(req.originCountry());
        user.setTargetCountry(req.targetCountry());
        user.setTargetCity(req.targetCity());
        user.setUniversity(req.university());
        user.setProgramType(req.programType());
        if (req.discoverable() != null) user.setDiscoverable(req.discoverable());
        if (req.birthDate() != null) {
            if (req.birthDate().isBlank()) {
                user.setBirthDate(null);
            } else {
                try {
                    user.setBirthDate(LocalDate.parse(req.birthDate()));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Invalid date of birth.");
                }
            }
        }
        users.save(user);
        return ResponseEntity.ok(profileDto(user));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest req, Authentication auth) {
        AppUser user = currentUser(auth);
        if (!encoder.matches(req.currentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(400).body("Current password is incorrect.");
        }
        user.setPasswordHash(encoder.encode(req.newPassword()));
        users.save(user);
        // Log every device out for safety, same as a password reset via email -
        // then immediately issue this device a fresh session (new tokens below),
        // so the person who just changed their password isn't logged out too.
        refreshTokenRepository.findByUserAndRevokedFalse(user)
                .forEach(rt -> { rt.setRevoked(true); refreshTokenRepository.save(rt); });
        return ResponseEntity.ok(buildAuthResponse(user));
    }

    // ---- Email verification ----

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        return emailTokenService.consume(token, EmailTokenService.VERIFY_EMAIL)
                .map(user -> {
                    user.setEmailVerified(true);
                    users.save(user);
                    return ResponseEntity.ok("Email verified.");
                })
                .orElse(ResponseEntity.status(400).body("This verification link is invalid or has expired."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody ResendVerificationRequest req) {
        users.findByEmail(req.email()).ifPresent(user -> {
            if (!user.isEmailVerified()) sendVerificationEmail(user);
        });
        // Same response whether or not the account exists, to avoid leaking which emails are registered.
        return ResponseEntity.ok("If that account exists and isn't verified yet, a new email has been sent.");
    }

    // ---- Password reset ----

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        users.findByEmail(req.email()).ifPresent(user -> {
            String token = emailTokenService.issue(user, EmailTokenService.RESET_PASSWORD, 1, ChronoUnit.HOURS);
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
        });
        // Same response either way - don't reveal whether the email is registered.
        return ResponseEntity.ok("If that account exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        return emailTokenService.consume(req.token(), EmailTokenService.RESET_PASSWORD)
                .map(user -> {
                    user.setPasswordHash(encoder.encode(req.newPassword()));
                    users.save(user);
                    // Log every device out for safety, since the old password may have been compromised.
                    refreshTokenRepository.findByUserAndRevokedFalse(user)
                            .forEach(rt -> { rt.setRevoked(true); refreshTokenRepository.save(rt); });
                    return ResponseEntity.ok("Password updated. Please log in again.");
                })
                .orElse(ResponseEntity.status(400).body("This reset link is invalid or has expired."));
    }

    private void sendVerificationEmail(AppUser user) {
        String token = emailTokenService.issue(user, EmailTokenService.VERIFY_EMAIL, 24, ChronoUnit.HOURS);
        String verifyUrl = frontendUrl + "/verify-email?token=" + token;
        emailService.sendVerificationEmail(user.getEmail(), verifyUrl);
    }

    private AuthResponse buildAuthResponse(AppUser user) {
        String accessToken = jwtUtil.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.issue(user);
        return new AuthResponse(
                accessToken, refreshToken.getToken(), user.getEmail(), user.getDisplayName(), user.getOriginCountry(),
                user.getTargetCountry(), user.getTargetCity(), user.getUniversity(), user.getProgramType(), user.isEmailVerified());
    }

    private ProfileResponse profileDto(AppUser user) {
        return new ProfileResponse(
                user.getId(), user.getEmail(), user.getDisplayName(), user.getOriginCountry(), user.getTargetCountry(), user.getTargetCity(),
                user.getUniversity(), user.getProgramType(), user.isEmailVerified(), user.isDiscoverable(),
                user.getBirthDate() == null ? null : user.getBirthDate().toString());
    }

    private AppUser currentUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return users.findByEmail(email).orElseThrow();
    }
}
