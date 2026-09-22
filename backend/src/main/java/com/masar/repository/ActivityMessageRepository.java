package com.masar.repository;

import com.masar.model.Activity;
import com.masar.model.ActivityMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityMessageRepository extends JpaRepository<ActivityMessage, Long> {
    List<ActivityMessage> findByActivityOrderByCreatedAtAsc(Activity activity);
    List<ActivityMessage> findByActivityAndIdGreaterThanOrderByCreatedAtAsc(Activity activity, Long afterId);
}
