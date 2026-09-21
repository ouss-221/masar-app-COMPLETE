package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A single chat message in a cohort group. Delivery is poll-based (the
// frontend re-fetches messages with ?afterId=, not a live WebSocket) - a
// deliberate first-phase choice: simpler to build and moderate correctly
// than real-time infrastructure, and indistinguishable from "real-time" at
// this message volume. See masar-community-map-plan.md for the upgrade path.
@Entity
@Table(name = "group_messages")
@Data
public class GroupMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private CohortGroup group;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
