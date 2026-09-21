package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A student-organized meetup tied to a cohort group's destination -
// deliberately student-specific categories (see `category`), not generic
// tourist activities. `lat`/`lng` are optional: an activity only appears on
// the Map tab once its host places a pin; it always appears in the plain
// list either way, so the map is additive, not required.
@Entity
@Table(name = "activities")
@Data
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private CohortGroup group;

    @ManyToOne(optional = false)
    @JoinColumn(name = "host_id", nullable = false)
    private AppUser host;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 600)
    private String description;

    // "meetup" | "housing" | "orientation" | "arrival" | "study" | "other"
    @Column(nullable = false, length = 30)
    private String category;

    @Column(length = 160)
    private String location;

    private Double lat;
    private Double lng;

    @Column(nullable = false)
    private Instant scheduledAt;

    private Integer capacity;

    // Age gate, both nullable/optional - null minAge means no floor, null
    // maxAge means no ceiling (the "80+" end of the wizard's age slider).
    // Enforced on RSVP/join, not on who can merely see the activity - see
    // ActivityController.rsvp.
    private Integer minAge;
    private Integer maxAge;

    // "open" (default - instant RSVP, matches every activity created before
    // this field existed) | "private" (joining creates a pending
    // ActivityJoinRequest that the host must approve/decline instead of an
    // instant RSVP - see ActivityController).
    @Column(nullable = false, length = 10)
    private String joinPolicy = "open";

    // "specific" (default - exact pin, matches every activity created before
    // this field existed) | "general" (host only shared a rough area - the
    // map renders a fuzzy circle instead of a precise pin; see ExploreMap.jsx).
    @Column(nullable = false, length = 10)
    private String locationPrecision = "specific";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
