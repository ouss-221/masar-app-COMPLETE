package com.masar.controller;

import com.masar.model.AppUser;
import com.masar.model.CohortGroup;
import com.masar.model.CohortMembership;
import com.masar.model.GroupMessage;
import com.masar.model.Report;
import com.masar.model.UserBlock;
import com.masar.repository.AppUserRepository;
import com.masar.repository.CohortGroupRepository;
import com.masar.repository.CohortMembershipRepository;
import com.masar.repository.GroupMessageRepository;
import com.masar.repository.ReportRepository;
import com.masar.repository.UserBlockRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

// Masar's "who else is going through the same move as me" cohort feature -
// see the project's masar-community-map-plan.md for the full design and the
// privacy reasoning behind the visible-by-default-false membership flag.
//
// GET /counts is the only public endpoint here (a guest should see "why
// join" before creating an account); everything else requires login and,
// for group-scoped actions, actual membership in that group.
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private static final int MAX_MESSAGE_LENGTH = 1000;
    private static final int MAX_REASON_LENGTH = 500;

    private final AppUserRepository users;
    private final CohortGroupRepository groups;
    private final CohortMembershipRepository memberships;
    private final GroupMessageRepository messages;
    private final UserBlockRepository blocks;
    private final ReportRepository reports;

    public CommunityController(AppUserRepository users, CohortGroupRepository groups,
                                CohortMembershipRepository memberships, GroupMessageRepository messages,
                                UserBlockRepository blocks, ReportRepository reports) {
        this.users = users;
        this.groups = groups;
        this.memberships = memberships;
        this.messages = messages;
        this.blocks = blocks;
        this.reports = reports;
    }

    public record CityCount(String city, long total, Map<String, Long> byOrigin) {}
    public record GroupView(Long id, String country, String city, long memberCount, long visibleMemberCount, boolean joined, boolean visible) {}
    public record JoinRequest(@NotBlank String country, @NotBlank String city, boolean visible) {}
    public record VisibilityRequest(boolean visible) {}
    public record MemberView(Long userId, String displayName, String originCountry, String university, String programType) {}
    public record MessageView(Long id, Long userId, String displayName, String content, String createdAt) {}
    public record SendMessageRequest(@NotBlank String content) {}
    public record ReportRequest(Long targetUserId, Long targetMessageId, @NotBlank String reason) {}

    // ---- Live counts (public) ----

    @GetMapping("/counts")
    public List<CityCount> counts(@RequestParam String country) {
        List<AppUserRepository.CohortCountRow> rows = users.countsByTargetCountry(country);
        Map<String, Map<String, Long>> byCity = new HashMap<>();
        Map<String, Long> totals = new HashMap<>();
        for (AppUserRepository.CohortCountRow row : rows) {
            String city = row.getCity();
            String origin = row.getOriginCountry() != null ? row.getOriginCountry() : "other";
            byCity.computeIfAbsent(city, k -> new HashMap<>()).merge(origin, row.getCnt(), Long::sum);
            totals.merge(city, row.getCnt(), Long::sum);
        }
        List<CityCount> result = new ArrayList<>();
        for (Map.Entry<String, Long> e : totals.entrySet()) {
            result.add(new CityCount(e.getKey(), e.getValue(), byCity.get(e.getKey())));
        }
        result.sort((a, b) -> Long.compare(b.total(), a.total()));
        return result;
    }

    // ---- Group membership ----

    @GetMapping("/group")
    public ResponseEntity<?> group(@RequestParam String country, @RequestParam String city, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findByCountryAndCity(country, city).orElse(null);
        if (group == null) {
            return ResponseEntity.ok(new GroupView(null, country, city, 0, 0, false, false));
        }
        return ResponseEntity.ok(groupView(group, me));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<?> groupById(@PathVariable Long groupId, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        return ResponseEntity.ok(groupView(group, me));
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody JoinRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = getOrCreateGroup(req.country(), req.city());
        CohortMembership m = memberships.findByGroupAndUser(group, me).orElseGet(CohortMembership::new);
        m.setGroup(group);
        m.setUser(me);
        m.setVisible(req.visible());
        memberships.save(m);
        return ResponseEntity.ok(groupView(group, me));
    }

    @PostMapping("/{groupId}/leave")
    public ResponseEntity<?> leave(@PathVariable Long groupId, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        memberships.deleteByGroupAndUser(group, me);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{groupId}/visibility")
    public ResponseEntity<?> setVisibility(@PathVariable Long groupId, @RequestBody VisibilityRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        CohortMembership m = memberships.findByGroupAndUser(group, me)
                .orElseThrow(() -> new IllegalStateException("Not a member of this group."));
        m.setVisible(req.visible());
        memberships.save(m);
        return ResponseEntity.ok(groupView(group, me));
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<?> members(@PathVariable Long groupId, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        if (!requireMember(group, me)) return ResponseEntity.status(403).body("Join this group first.");

        Set<Long> blockedIds = blockedUserIds(me);
        List<MemberView> result = memberships.findByGroupAndVisibleTrue(group).stream()
                .map(CohortMembership::getUser)
                .filter(u -> !blockedIds.contains(u.getId()))
                .map(u -> new MemberView(u.getId(), u.getDisplayName(), u.getOriginCountry(), u.getUniversity(), u.getProgramType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ---- Chat (poll-based - see GroupMessage) ----

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long groupId, @RequestParam(required = false) Long afterId, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        if (!requireMember(group, me)) return ResponseEntity.status(403).body("Join this group first.");

        Set<Long> blockedIds = blockedUserIds(me);
        List<GroupMessage> list = afterId == null
                ? messages.findByGroupOrderByCreatedAtAsc(group)
                : messages.findByGroupAndIdGreaterThanOrderByCreatedAtAsc(group, afterId);
        List<MessageView> result = list.stream()
                .filter(msg -> !blockedIds.contains(msg.getUser().getId()))
                .map(msg -> new MessageView(msg.getId(), msg.getUser().getId(), msg.getUser().getDisplayName(), msg.getContent(), msg.getCreatedAt().toString()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<?> postMessage(@PathVariable Long groupId, @RequestBody SendMessageRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        if (!requireMember(group, me)) return ResponseEntity.status(403).body("Join this group first.");

        String content = req.content() == null ? "" : req.content().trim();
        if (content.isEmpty()) return ResponseEntity.badRequest().body("Message can't be empty.");
        if (content.length() > MAX_MESSAGE_LENGTH) return ResponseEntity.badRequest().body("Message is too long.");

        GroupMessage msg = new GroupMessage();
        msg.setGroup(group);
        msg.setUser(me);
        msg.setContent(content);
        messages.save(msg);
        return ResponseEntity.ok(new MessageView(msg.getId(), me.getId(), me.getDisplayName(), msg.getContent(), msg.getCreatedAt().toString()));
    }

    // ---- Safety: report + block ----

    @PostMapping("/report")
    public ResponseEntity<?> report(@RequestBody ReportRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        String reason = req.reason() == null ? "" : req.reason().trim();
        if (reason.isEmpty()) return ResponseEntity.badRequest().body("Please describe the issue.");
        if (reason.length() > MAX_REASON_LENGTH) return ResponseEntity.badRequest().body("That's a bit long - please shorten it.");

        Report r = new Report();
        r.setReporter(me);
        if (req.targetUserId() != null) users.findById(req.targetUserId()).ifPresent(r::setTargetUser);
        if (req.targetMessageId() != null) messages.findById(req.targetMessageId()).ifPresent(r::setTargetMessage);
        r.setReason(reason);
        reports.save(r);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/block/{userId}")
    public ResponseEntity<?> block(@PathVariable Long userId, Authentication auth) {
        AppUser me = currentUser(auth);
        if (me.getId().equals(userId)) return ResponseEntity.badRequest().body("You can't block yourself.");
        AppUser target = users.findById(userId).orElseThrow();
        if (!blocks.existsByBlockerAndBlocked(me, target)) {
            UserBlock b = new UserBlock();
            b.setBlocker(me);
            b.setBlocked(target);
            blocks.save(b);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/block/{userId}")
    public ResponseEntity<?> unblock(@PathVariable Long userId, Authentication auth) {
        AppUser me = currentUser(auth);
        AppUser target = users.findById(userId).orElseThrow();
        blocks.deleteByBlockerAndBlocked(me, target);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/blocked")
    public ResponseEntity<?> blocked(Authentication auth) {
        AppUser me = currentUser(auth);
        List<Long> ids = blocks.findByBlocker(me).stream().map(b -> b.getBlocked().getId()).collect(Collectors.toList());
        return ResponseEntity.ok(ids);
    }

    // ---- Helpers ----

    private CohortGroup getOrCreateGroup(String country, String city) {
        return groups.findByCountryAndCity(country, city).orElseGet(() -> {
            CohortGroup g = new CohortGroup();
            g.setCountry(country);
            g.setCity(city);
            return groups.save(g);
        });
    }

    private boolean requireMember(CohortGroup group, AppUser user) {
        return memberships.findByGroupAndUser(group, user).isPresent();
    }

    private GroupView groupView(CohortGroup group, AppUser me) {
        List<CohortMembership> all = memberships.findByGroup(group);
        long visibleCount = all.stream().filter(CohortMembership::isVisible).count();
        CohortMembership mine = all.stream().filter(m -> m.getUser().getId().equals(me.getId())).findFirst().orElse(null);
        return new GroupView(group.getId(), group.getCountry(), group.getCity(), all.size(), visibleCount,
                mine != null, mine != null && mine.isVisible());
    }

    private Set<Long> blockedUserIds(AppUser me) {
        return new HashSet<>(blocks.findByBlocker(me).stream().map(b -> b.getBlocked().getId()).collect(Collectors.toList()));
    }

    private AppUser currentUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return users.findByEmail(email).orElseThrow();
    }
}
