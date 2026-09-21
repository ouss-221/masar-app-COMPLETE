package com.masar.repository;

import com.masar.model.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {
    List<ChecklistItem> findAllByOrderByGroupNameAscOrderIndexAsc();
    List<ChecklistItem> findAllByCountryOrderByOrderIndexAsc(String country);
}
