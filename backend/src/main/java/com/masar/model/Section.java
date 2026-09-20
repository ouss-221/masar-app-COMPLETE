package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sections")
@Data
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String slug;              // "visa", "arrival", "housing" ... unique *within* a country, not globally

    @Column(nullable = false, length = 160)
    private String titleFr;

    @Column(length = 160)
    private String titleAr;

    @Column(length = 160)
    private String titleEn;

    @Column(length = 160)
    private String titleEs;

    @Column(nullable = false, length = 10)
    private String country = "es";    // "es" (Spain), "fr" (France), "it" (Italy) - which destination guide this belongs to

    @Column(nullable = false)
    private Integer orderIndex;

    // Nationality-specific callout, shown under the main content when relevant -
    // only filled in where the process genuinely differs by nationality (visa
    // center, fees, apostille status). Left null where it's the same for everyone,
    // since fabricating a difference that doesn't exist would be misleading.
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String noteDz;   // Algeria-specific note

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String noteMa;   // Morocco-specific note

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String noteTn;   // Tunisia-specific note

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentHtml;       // French - the original, richest version

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentHtmlEn;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentHtmlAr;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentHtmlEs;

    private boolean published = true;
}
