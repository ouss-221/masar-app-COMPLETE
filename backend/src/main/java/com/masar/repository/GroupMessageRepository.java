package com.masar.repository;

import com.masar.model.CohortGroup;
import com.masar.model.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    List<GroupMessage> findByGroupOrderByCreatedAtAsc(CohortGroup group);
    List<GroupMessage> findByGroupAndIdGreaterThanOrderByCreatedAtAsc(CohortGroup group, Long afterId);
}
