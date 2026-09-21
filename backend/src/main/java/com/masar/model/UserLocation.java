package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// One row per user, upserted in place (not a history log - only the current
// position is ever kept). `sharing` is the explicit opt-in switch; turning it
// off clears lat/lng too, in addition to the app never querying while
// sharing=false, so a stale position can never leak even if a query site has
// a bug. See LocationController for the consent-gated read/write endpoints.
@Entity
@Table(name = "user_locations")
@Data
public class UserLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private AppUser user;

    private boolean sharing = false;

    private Double lat;
    private Double lng;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
}
