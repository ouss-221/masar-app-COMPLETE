package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// A user- or message-level report, filed by a cohort member. There is no
// admin review UI yet (out of scope for this pass) - reports are persisted
// so they exist and can be reviewed/acted on manually or via a future admin
// screen, rather than silently discarded. `status` is included now so that
// screen can be added later without a schema change.
@Entity
@Table(name = "reports")
@Data
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reporter_id", nullable = false)
    private AppUser reporter;

    @ManyToOne
    @JoinColumn(name = "target_user_id")
    private AppUser targetUser;

    @ManyToOne
    @JoinColumn(name = "target_message_id")
    private GroupMessage targetMessage;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false, length = 20)
    private String status = "OPEN";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
