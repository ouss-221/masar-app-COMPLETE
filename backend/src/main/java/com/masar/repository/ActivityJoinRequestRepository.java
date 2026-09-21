package com.masar.repository;

import com.masar.model.Activity;
import com.masar.model.ActivityJoinRequest;
import com.masar.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityJoinRequestRepository extends JpaRepository<ActivityJoinRequest, Long> {
    Optional<ActivityJoinRequest> findByActivityAndUser(Activity activity, AppUser user);

    // For a host reviewing who's waiting on their private activity.
    List<ActivityJoinRequest> findByActivityAndStatusOrderByCreatedAtAsc(Activity activity, String status);

    // For a requester's own view - "pending" badge on a card they tried to join.
    List<ActivityJoinRequest> findByUser(AppUser user);
}
