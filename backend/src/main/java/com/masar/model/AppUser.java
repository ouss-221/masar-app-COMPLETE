package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

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
    @Column(length = 10)
    private String originCountry;      // "dz" / "ma" / "tn" / "other" - where the student is moving FROM, optional, powers the Community cohort nationality breakdown

    @Column(length = 10)
    private String targetCountry;      // "es" / "fr" / "it" - null for accounts created before this field existed

    @Column(length = 80)
    private String targetCity;         // e.g. "Granada", "Alicante"

    @Column(length = 160)
    private String university;

    @Column(length = 40)
    private String programType;        // "master", "bachelor", "language-course" ...

    private boolean emailVerified = false;

    // Opt-in: lets other students find this account in the People/Nearby
    // search (see LocationController, PlaceController's neighbors). Off by
    // default - same privacy-by-default rule as CohortMembership.visible.
    private boolean discoverable = false;

    // Nullable - null for every account created before this field existed
    // (and optional at signup for new ones too, since it's only needed if the
    // student later creates or joins an age-restricted activity). Used only
    // for the Explore/Map activity age-range gate (see ActivityController) -
    // never shown to other students, never used for anything else.
    private LocalDate birthDate;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
