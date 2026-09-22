package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A single chat message in an activity's own chat room - separate from
// GroupMessage (the wider per-city cohort chat). Only the activity's host and
// whoever has actually RSVP'd "going" can read or post here (see
// ActivityController.canAccessChat) - a private activity's pending
// requesters can't see the conversation until the host approves them.
// Poll-based delivery, same pattern and reasoning as GroupMessage.
@Entity
@Table(name = "activity_messages")
@Data
public class ActivityMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
