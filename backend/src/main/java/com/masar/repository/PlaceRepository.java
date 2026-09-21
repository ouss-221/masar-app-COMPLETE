package com.masar.repository;

import com.masar.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByCountryAndCity(String country, String city);
    List<Place> findByCountryAndCityAndCategory(String country, String city, String category);
    boolean existsByOsmId(Long osmId);
    long countByCountryAndCity(String country, String city);
}
