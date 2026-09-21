package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

// A real, verifiable university profile shown on the Universities /
// University detail screens. Deliberately has NO rating/review fields:
// star ratings and "120+ reviews" style numbers shown in early mockups
// would have to be fabricated for real institutions, which could mislead
// a real student's real decision - so instead this focuses on facts that
// can be sourced from the university's own official page (linked via
// websiteUrl) and cited national tuition data.
@Entity
@Table(name = "universities")
@Data
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60, unique = true)
    private String slug;              // "ugr", "sorbonne", "polito" ...

    @Column(nullable = false, length = 10)
    private String country;           // "es" (Spain), "fr" (France), "it" (Italy)

    @Column(nullable = false, length = 120)
    private String name;              // official name - kept in its own language, not translated

    @Column(length = 80)
    private String city;

    private Integer foundedYear;      // null if genuinely unclear / disputed

    private boolean publicUniversity = true;

    @Column(nullable = false, length = 300)
    private String websiteUrl;        // official .edu-equivalent domain - verified, not guessed

    @Lob
    @Column(columnDefinition = "TEXT")
    private String descriptionFr;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String descriptionAr;

    @Column(length = 200)
    private String fieldsFr;          // short comma-separated list of notable fields

    @Column(length = 200)
    private String fieldsEn;

    @Column(length = 200)
    private String fieldsAr;

    private Integer tuitionMinEur;    // approx. official/EU-rate annual tuition, low end
    private Integer tuitionMaxEur;    // approx. annual tuition, high end (varies by program/nationality)

    @Column(length = 400)
    private String tuitionNoteFr;     // basis for the range + where it can differ (nationality, program)

    @Column(length = 400)
    private String tuitionNoteEn;

    @Column(length = 400)
    private String tuitionNoteAr;

    // Filter-friendly fields for the "browse all" screen. Kept as single
    // plain values (not free text) so a dropdown filter can match on them
    // directly, rather than trying to parse the richer fieldsFr/En/Ar text.
    @Column(length = 60)
    private String primaryField;      // "Comprehensive", "Engineering", "Business", "Sciences & Engineering", ...

    @Column(length = 30)
    private String mainLanguage;      // "Spanish" / "French" / "Italian" - the language most bachelor's programs are taught in

    private boolean englishPrograms = true; // true if at least some English-taught programs are offered (true for every university seeded so far)

    @Column(length = 60)
    private String degreeLevels;      // CSV, e.g. "Bachelor's,Master's,PhD"

    private Integer orderIndex = 0;

    private boolean published = true;

    // Real photo for the Gallery tab, sourced and verified from a freely-
    // licensed source (Wikimedia Commons or a royalty-free stock site) -
    // null when no genuine, verifiably-matching photo of this specific
    // institution's building/campus could be found (see the research notes
    // in the project's gallery-photos doc). The frontend falls back to
    // cityPhotoUrl when this is null, rather than showing a fabricated or
    // mismatched "campus" photo.
    @Column(length = 500)
    private String campusPhotoUrl;

    @Column(length = 60)
    private String campusPhotoLicense;    // e.g. "CC BY-SA 4.0", "Pexels License"

    @Column(length = 120)
    private String campusPhotoCredit;     // photographer/author name, as required by the license

    // A real, verified photo of the city the university is in (Unsplash or
    // Pexels, free license, no attribution legally required but credited
    // anyway as good practice). Always set when campusPhotoUrl is null, so
    // the Gallery tab always has a genuine, correctly-located photo to show.
    @Column(length = 500)
    private String cityPhotoUrl;

    @Column(length = 120)
    private String cityPhotoCredit;
}
