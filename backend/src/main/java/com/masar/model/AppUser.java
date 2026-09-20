package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "app_users")
@Data
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 190)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 120)
    private String displayName;

    @Column(nullable = false, length = 20)
    private String role = "STUDENT";   // STUDENT or ADMIN

    // Profile - powers personalization (city-specific sponsors, relevant checklist items, etc.)
    @Column(length = 80)
    private String targetCity;         // e.g. "Granada", "Alicante"

    @Column(length = 160)
    private String university;

    @Column(length = 40)
    private String programType;        // "master", "bachelor", "language-course" ...

    private boolean emailVerified = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
