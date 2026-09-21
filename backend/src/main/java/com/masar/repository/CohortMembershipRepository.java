package com.masar.repository;

import com.masar.model.AppUser;
import com.masar.model.CohortGroup;
import com.masar.model.CohortMembership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CohortMembershipRepository extends JpaRepository<CohortMembership, Long> {
    Optional<CohortMembership> findByGroupAndUser(CohortGroup group, AppUser user);
    List<CohortMembership> findByGroup(CohortGroup group);
    List<CohortMembership> findByGroupAndVisibleTrue(CohortGroup group);
    List<CohortMembership> findByUser(AppUser user);
    void deleteByGroupAndUser(CohortGroup group, AppUser user);
}
