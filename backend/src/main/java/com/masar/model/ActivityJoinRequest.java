package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A pending request to join a "private" activity (Activity.joinPolicy ==
// "private") - the host must approve or decline before the requester gets a
// real ActivityRsvp. Open activities skip this entirely: rsvp() there creates
// an ActivityRsvp directly. One row per (activity, user) - re-requesting
// after a decline reuses/updates the same row rather than piling up new ones.
@Entity
@Table(name = "activity_join_requests", uniqueConstraints = @UniqueConstraint(columnNames = {"activity_id", "user_id"}))
@Data
public class ActivityJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    // PENDING | APPROVED | DECLINED
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    private Instant decidedAt;
}
