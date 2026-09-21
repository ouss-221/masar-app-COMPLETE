package com.masar.repository;

import com.masar.model.AppUser;
import com.masar.model.UserBlock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBlockRepository extends JpaRepository<UserBlock, Long> {
    List<UserBlock> findByBlocker(AppUser blocker);
    Optional<UserBlock> findByBlockerAndBlocked(AppUser blocker, AppUser blocked);
    boolean existsByBlockerAndBlocked(AppUser blocker, AppUser blocked);
    void deleteByBlockerAndBlocked(AppUser blocker, AppUser blocked);
}
