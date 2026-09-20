package com.masar.repository;

import com.masar.model.AppUser;
import com.masar.model.ChecklistProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChecklistProgressRepository extends JpaRepository<ChecklistProgress, Long> {
    List<ChecklistProgress> findByUser(AppUser user);
    Optional<ChecklistProgress> findByUserAndChecklistItem_Id(AppUser user, Long checklistItemId);
}
