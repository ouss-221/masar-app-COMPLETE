package com.masar.repository;

import com.masar.model.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SponsorRepository extends JpaRepository<Sponsor, Long> {
    List<Sponsor> findBySectionSlugAndActiveTrue(String sectionSlug);
}
