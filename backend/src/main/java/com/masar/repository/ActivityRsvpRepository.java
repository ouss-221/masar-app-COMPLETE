package com.masar.repository;

import com.masar.model.Activity;
import com.masar.model.ActivityRsvp;
import com.masar.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityRsvpRepository extends JpaRepository<ActivityRsvp, Long> {
    List<ActivityRsvp> findByActivity(Activity activity);
    Optional<ActivityRsvp> findByActivityAndUser(Activity activity, AppUser user);
    long countByActivity(Activity activity);
    void deleteByActivityAndUser(Activity activity, AppUser user);
}
