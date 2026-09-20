package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

/**
 * An opaque, random refresh token, stored server-side so it can be revoked
 * (on logout, or if compromised). The short-lived JWT access token never
 * touches the database - only this does.
 */
@Entity
@Table(name = "refresh_tokens")
@Data
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(nullable = false)
    private Instant expiresAt;

    private boolean revoked = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
