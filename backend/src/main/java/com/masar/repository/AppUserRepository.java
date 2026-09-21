package com.masar.repository;

import com.masar.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);

    // Live per-city, per-origin-country headcounts for a destination country,
    // computed directly from declared profile data (no CohortGroup row
    // required) so the Community tab's numbers are always accurate and
    // browsing them never writes anything. Rows with a null/blank target
    // city are excluded (nothing to group them under yet).
    @Query("select u.targetCity as city, u.originCountry as originCountry, count(u) as cnt " +
           "from AppUser u " +
           "where u.targetCountry = :country and u.targetCity is not null and u.targetCity <> '' " +
           "group by u.targetCity, u.originCountry")
    List<CohortCountRow> countsByTargetCountry(@Param("country") String country);

    interface CohortCountRow {
        String getCity();
        String getOriginCountry();
        Long getCnt();
    }

    // Powers the People search's University tab - only ever called for users
    // who opted into `discoverable` themselves, see StudentController.
    List<AppUser> findByUniversityAndDiscoverableTrue(String university);
}
