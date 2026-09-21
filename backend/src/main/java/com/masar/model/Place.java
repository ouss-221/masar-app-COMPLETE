package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A real venue (restaurant, cafe, bar, landmark) pulled from OpenStreetMap's
// free Overpass API - see PlaceSyncService. Deliberately no rating/review
// fields: OSM doesn't carry those, and this project never fabricates ratings
// (same rule as the university catalog). `osmId` de-dupes re-syncs.
@Entity
@Table(name = "places", uniqueConstraints = @UniqueConstraint(columnNames = {"osmId"}))
@Data
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long osmId;

    @Column(nullable = false, length = 10)
    private String country;

    @Column(nullable = false, length = 80)
    private String city;

    // "restaurant" | "cafe" | "bar" | "landmark"
    @Column(nullable = false, length = 30)
    private String category;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(length = 240)
    private String address;

    @Column(length = 120)
    private String openingHours;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
