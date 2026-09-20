package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "checklist_progress",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "checklist_item_id"}))
@Data
public class ChecklistProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "checklist_item_id")
    private ChecklistItem checklistItem;

    private boolean done = false;

    private Instant doneAt;
}
