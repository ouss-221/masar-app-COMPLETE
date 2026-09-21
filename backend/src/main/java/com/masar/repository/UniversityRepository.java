package com.masar.repository;

import com.masar.model.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    List<University> findByPublishedTrueAndCountryOrderByOrderIndexAsc(String country);
    List<University> findByPublishedTrueOrderByOrderIndexAsc();
    Optional<University> findBySlug(String slug);
}
