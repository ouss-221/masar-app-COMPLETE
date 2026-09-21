package com.masar.repository;

import com.masar.model.CohortGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CohortGroupRepository extends JpaRepository<CohortGroup, Long> {
    Optional<CohortGroup> findByCountryAndCity(String country, String city);
}
