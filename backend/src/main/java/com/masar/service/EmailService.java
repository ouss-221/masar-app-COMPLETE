package com.masar.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

/**
 * Sends transactional emails (verification, password reset) through Resend's
 * REST API. If RESEND_API_KEY isn't set, this quietly logs instead of
 * sending - so registration/reset still work end-to-end in local dev
 * without an email account, and switch on automatically once a real key is
 * provided.
 */
@Service
public class EmailService {

    private final String apiKey;
    private final String fromEmail;
    private final HttpClient http = HttpClient.newHttpClient();

    public EmailService(@Value("${masar.resend.api-key:}") String apiKey,
                         @Value("${masar.resend.from-email:onboarding@resend.dev}") String fromEmail) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
    }

    public void sendVerificationEmail(String toEmail, String verifyUrl) {
        String subject = "Confirm your Masar account";
        String html = """
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit sur Masar. Confirmez votre adresse email en cliquant ci-dessous :</p>
            <p><a href="%s">Confirmer mon email</a></p>
            <p>Ce lien expire dans 24 heures.</p>
            """.formatted(verifyUrl);
        send(toEmail, subject, html);
    }

    public void sendPasswordResetEmail(String toEmail, String resetUrl) {
        String subject = "Réinitialisation de votre mot de passe Masar";
        String html = """
            <p>Bonjour,</p>
            <p>Une demande de réinitialisation de mot de passe a été faite pour ce compte.</p>
            <p><a href="%s">Choisir un nouveau mot de passe</a></p>
            <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
            """.formatted(resetUrl);
        send(toEmail, subject, html);
    }

    private void send(String toEmail, String subject, String html) {
        if (apiKey == null || apiKey.isBlank()) {
            // No Resend key configured yet - don't fail the calling request, just log clearly.
            System.out.println("[EmailService] RESEND_API_KEY not set - would have sent to "
                    + toEmail + " | Subject: " + subject);
            return;
        }
        try {
            String body = """
                {"from":"%s","to":["%s"],"subject":"%s","html":%s}
                """.formatted(fromEmail, toEmail, subject.replace("\"", "\\\""), jsonString(html));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) {
                System.err.println("[EmailService] Resend API error " + response.statusCode() + ": " + response.body());
            }
        } catch (Exception e) {
            // Never let an email failure break registration or password reset.
            System.err.println("[EmailService] Failed to send email: " + e.getMessage());
        }
    }

    private String jsonString(String s) {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }
}
