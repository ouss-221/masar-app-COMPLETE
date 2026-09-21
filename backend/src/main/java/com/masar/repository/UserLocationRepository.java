package com.masar.repository;

import com.masar.model.AppUser;
import com.masar.model.UserLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {
    Optional<UserLocation> findByUser(AppUser user);
    List<UserLocation> findBySharingTrue();
}
