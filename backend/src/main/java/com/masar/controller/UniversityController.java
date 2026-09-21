package com.masar.controller;

import com.masar.model.University;
import com.masar.repository.UniversityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
public class UniversityController {

    private final UniversityRepository universities;

    public UniversityController(UniversityRepository universities) {
        this.universities = universities;
    }

    // GET /api/universities            -> all published universities
    // GET /api/universities?country=fr -> just that destination's universities
    @GetMapping
    public List<University> all(@RequestParam(required = false) String country) {
        return country == null
                ? universities.findByPublishedTrueOrderByOrderIndexAsc()
                : universities.findByPublishedTrueAndCountryOrderByOrderIndexAsc(country);
    }

    // GET /api/universities/ugr -> a single university by slug
    @GetMapping("/{slug}")
    public ResponseEntity<University> one(@PathVariable String slug) {
        return universities.findBySlug(slug).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
