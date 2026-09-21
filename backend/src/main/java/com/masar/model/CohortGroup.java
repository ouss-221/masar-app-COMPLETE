package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A Community "room" for one destination (country + city) - e.g. "es" /
// "Granada". Created lazily the first time someone joins that destination's
// cohort (see CommunityController.getOrCreateGroup); the live headline counts
// shown on the Community tab are computed directly from AppUser rows and do
// NOT require a CohortGroup to exist, so browsing never creates rows - only
// actually joining does.
@Entity
@Table(name = "cohort_groups", uniqueConstraints = @UniqueConstraint(columnNames = {"country", "city"}))
@Data
public class CohortGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String country;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
