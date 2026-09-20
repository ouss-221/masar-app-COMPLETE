package com.masar.repository;

import com.masar.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByPublishedTrueOrderByOrderIndexAsc();
    List<Section> findByPublishedTrueAndCountryOrderByOrderIndexAsc(String country);
    Optional<Section> findBySlug(String slug);
    Optional<Section> findBySlugAndCountry(String slug, String country);
}
