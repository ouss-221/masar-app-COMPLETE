package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "email_tokens")
@Data
public class EmailToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(nullable = false, length = 20)
    private String purpose;   // "VERIFY_EMAIL" or "RESET_PASSWORD"

    @Column(nullable = false)
    private Instant expiresAt;

    private boolean used = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
