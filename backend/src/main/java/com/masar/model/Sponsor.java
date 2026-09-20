package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "sponsors")
@Data
public class Sponsor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;                 // "Amin LFM", "Serami Consulting"

    @Column(nullable = false, length = 60)
    private String sectionSlug;          // which guide section it's featured on

    @Column(nullable = false, length = 400)
    private String description;

    @Column(nullable = false, length = 300)
    private String ctaUrl;               // WhatsApp / booking link

    @Column(nullable = false, length = 20)
    private String label = "Sponsored";  // shown verbatim in the UI - keep it explicit

    private boolean active = true;

    private LocalDate startDate;
    private LocalDate endDate;
}
