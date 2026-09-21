package com.masar.controller;

import com.masar.model.AppUser;
import com.masar.repository.AppUserRepository;
import com.masar.repository.UserBlockRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// People search's "University" tab - separate from the live-location Nearby
// tab (LocationController) since matching by university doesn't need GPS at
// all. Same reciprocity + opt-in rule as everywhere else in this app: only
// `discoverable` users show up, and only for a caller who is discoverable
// themselves.
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final AppUserRepository users;
    private final UserBlockRepository blocks;

    public StudentController(AppUserRepository users, UserBlockRepository blocks) {
        this.users = users;
        this.blocks = blocks;
    }

    public record StudentView(Long userId, String displayName, String originCountry, String university, String programType) {}

    @GetMapping("/university")
    public ResponseEntity<?> byUniversity(@RequestParam(required = false) String university, Authentication auth) {
        AppUser me = currentUser(auth);
        if (!me.isDiscoverable()) {
            return ResponseEntity.status(403).body("Turn on 'let other students find me' in your profile first.");
        }
        String target = (university == null || university.isBlank()) ? me.getUniversity() : university;
        if (target == null || target.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        List<StudentView> result = users.findByUniversityAndDiscoverableTrue(target).stream()
                .filter(u -> !u.getId().equals(me.getId()))
                .filter(u -> !blocks.existsByBlockerAndBlocked(me, u))
                .filter(u -> !blocks.existsByBlockerAndBlocked(u, me))
                .map(u -> new StudentView(u.getId(), u.getDisplayName(), u.getOriginCountry(), u.getUniversity(), u.getProgramType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    private AppUser currentUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return users.findByEmail(email).orElseThrow();
    }
}
