package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A user's membership in a destination's cohort group. Joining lets you chat
// and see/create activities - it does NOT by itself make you visible to
// other members. `visible` is a separate, explicit opt-in (default false):
// until a member turns it on, they can read the group and take part, but
// don't appear in the member roster or count toward the per-nationality
// breakdown shown to other users. This is a deliberate privacy default, not
// an oversight - see the Community research doc for the reasoning
// (nationality + destination + intake timing is exactly the kind of detail
// scammers/impersonators target in this niche).
@Entity
@Table(name = "cohort_memberships", uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}))
@Data
public class CohortMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private CohortGroup group;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    private boolean visible = false;

    @Column(nullable = false)
    private Instant joinedAt = Instant.now();
}
