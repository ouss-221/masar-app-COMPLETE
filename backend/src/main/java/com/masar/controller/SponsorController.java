package com.masar.controller;

import com.masar.model.Sponsor;
import com.masar.repository.SponsorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sponsors")
public class SponsorController {

    private final SponsorRepository sponsors;

    public SponsorController(SponsorRepository sponsors) {
        this.sponsors = sponsors;
    }

    // GET /api/sponsors/visa -> active sponsors for the "visa" section, if any.
    // The frontend renders these in a visually distinct "Sponsored" card - never
    // blended into the editorial content. See label field, always sent as-is.
    @GetMapping("/{sectionSlug}")
    public List<Sponsor> forSection(@PathVariable String sectionSlug) {
        return sponsors.findBySectionSlugAndActiveTrue(sectionSlug);
    }
}
