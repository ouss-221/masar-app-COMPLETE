package com.masar.repository;

import com.masar.model.Activity;
import com.masar.model.CohortGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByGroupOrderByScheduledAtAsc(CohortGroup group);

    // Powers the public, city-wide Explore map/list (screen "Events on Map") -
    // deliberately not gated behind cohort membership, since seeing that an
    // event exists is meant to be public; joining its group chat still is.
    List<Activity> findByGroup_CountryAndGroup_CityOrderByScheduledAtAsc(String country, String city);
}
