package com.masar.controller;

import com.masar.model.Section;
import com.masar.repository.SectionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    private final SectionRepository sections;

    public SectionController(SectionRepository sections) {
        this.sections = sections;
    }

    // GET /api/sections            -> everything (used rarely)
    // GET /api/sections?country=fr -> just that destination's guide, in order
    @GetMapping
    public List<Section> all(@RequestParam(required = false) String country) {
        return country == null
                ? sections.findByPublishedTrueOrderByOrderIndexAsc()
                : sections.findByPublishedTrueAndCountryOrderByOrderIndexAsc(country);
    }

    // GET /api/sections/visa?country=fr  -> a single section by slug, within that country's guide
    @GetMapping("/{slug}")
    public ResponseEntity<Section> one(@PathVariable String slug, @RequestParam(required = false) String country) {
        var result = country == null ? sections.findBySlug(slug) : sections.findBySlugAndCountry(slug, country);
        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
