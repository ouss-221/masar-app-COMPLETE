package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A one-directional block: `blocker` no longer sees `blocked`'s messages or
// roster entry in any shared cohort group. Ships alongside the chat feature
// itself, not as a follow-up - a group chat between strangers isn't
// launch-ready without it.
@Entity
@Table(name = "user_blocks", uniqueConstraints = @UniqueConstraint(columnNames = {"blocker_id", "blocked_id"}))
@Data
public class UserBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "blocker_id", nullable = false)
    private AppUser blocker;

    @ManyToOne(optional = false)
    @JoinColumn(name = "blocked_id", nullable = false)
    private AppUser blocked;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
