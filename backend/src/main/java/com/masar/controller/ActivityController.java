package com.masar.controller;

import com.masar.model.Activity;
import com.masar.model.ActivityJoinRequest;
import com.masar.model.ActivityRsvp;
import com.masar.model.AppUser;
import com.masar.model.CohortGroup;
import com.masar.repository.ActivityJoinRequestRepository;
import com.masar.repository.ActivityRepository;
import com.masar.repository.ActivityRsvpRepository;
import com.masar.repository.AppUserRepository;
import com.masar.repository.CohortGroupRepository;
import com.masar.repository.CohortMembershipRepository;
import com.masar.util.CityCoordinates;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

// Student-organized meetups within a cohort group - see masar-community-map-plan.md
// (Phase 3). Every endpoint requires the caller to already be a member of the
// activity's cohort group, same rule as CommunityController's chat/roster.
@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    // A real complaint from testing: someone in Granada could pin (and
    // therefore "create") an activity for Alicante's map, ~500km away.
    // Activities are tied to one destination city, so a pin has to actually
    // be near it - kept generous (not "exact city limits") since a real
    // meetup spot is often just outside a city's official boundary.
    private static final double MAX_ACTIVITY_DISTANCE_KM = 80;

    private final ActivityRepository activities;
    private final ActivityRsvpRepository rsvps;
    private final ActivityJoinRequestRepository joinRequests;
    private final CohortGroupRepository groups;
    private final CohortMembershipRepository memberships;
    private final AppUserRepository users;

    public ActivityController(ActivityRepository activities, ActivityRsvpRepository rsvps,
                               ActivityJoinRequestRepository joinRequests, CohortGroupRepository groups,
                               CohortMembershipRepository memberships, AppUserRepository users) {
        this.activities = activities;
        this.rsvps = rsvps;
        this.joinRequests = joinRequests;
        this.groups = groups;
        this.memberships = memberships;
        this.users = users;
    }

    // joinStatus: "going" | "pending" | null (never requested, or the caller
    // is anonymous - see forCity below, the only public endpoint here).
    public record ActivityView(Long id, String title, String description, String category, String location,
                                Double lat, Double lng, String scheduledAt, Integer capacity,
                                String hostName, long goingCount, boolean going,
                                Integer minAge, Integer maxAge, String joinPolicy, String locationPrecision,
                                String joinStatus) {}

    // Public, city-wide card/pin - no host identity here (kept minimal for a
    // possibly-anonymous caller), but joinStatus IS filled in when the
    // request carries a valid login, since the map needs to show "pending"/
    // "going" badges - see forCity below.
    // hostId: no display name here (keep this list lean for a possibly-
    // anonymous caller), but the id lets the frontend show "you're the
    // host, review requests" controls without a second round-trip.
    public record CityActivityView(Long id, Long groupId, Long hostId, String title, String description, String category,
                                    String location, Double lat, Double lng, String scheduledAt, long goingCount,
                                    Integer minAge, Integer maxAge, String joinPolicy, String locationPrecision,
                                    String joinStatus) {}

    public record CreateActivityRequest(@NotBlank String title, String description, @NotBlank String category,
                                         String location, Double lat, Double lng,
                                         @NotBlank String scheduledAt, Integer capacity,
                                         Integer minAge, Integer maxAge, String joinPolicy, String locationPrecision) {}

    // Used by the Explore/Map tab's own "+ Add activity" button (see below) -
    // unlike CreateActivityRequest above (posted from within an already-open
    // CohortRoom, where a pin is optional), a pin is REQUIRED here: the whole
    // point of creating an activity from the map is that it shows up on the
    // map, so lat/lng are @NotNull rather than left to an easy-to-miss
    // checkbox. country/city replace groupId in the path - the caller doesn't
    // need to know or already belong to a cohort group.
    public record CreateCityActivityRequest(@NotBlank String country, @NotBlank String city, @NotBlank String title,
                                              String description, @NotBlank String category, String location,
                                              @NotNull Double lat, @NotNull Double lng,
                                              @NotBlank String scheduledAt, Integer capacity,
                                              Integer minAge, Integer maxAge, String joinPolicy, String locationPrecision) {}

    public record RsvpRequest(boolean going) {}

    public record JoinRequestView(Long id, Long userId, String userName, String requestedAt) {}

    @GetMapping("/group/{groupId}")
    public ResponseEntity<?> forGroup(@PathVariable Long groupId, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        if (!isMember(group, me)) return ResponseEntity.status(403).body("Join this group first.");

        List<ActivityView> result = activities.findByGroupOrderByScheduledAtAsc(group).stream()
                .map(a -> toView(a, me))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Public - no login required to see what's happening around a city (the
    // Explore/Map tab uses this). Registering interest (RSVP) still requires
    // logging in - see rsvp() below. Authentication is optional here (this
    // route is permitAll in SecurityConfig): when the caller IS logged in,
    // Spring still hands us an Authentication (Spring Security's built-in
    // anonymous-auth filter fills it in with principal "anonymousUser"
    // otherwise), so optionalUser() below tells the two cases apart and fills
    // in each activity's joinStatus for that caller when it can.
    @GetMapping("/city")
    public ResponseEntity<?> forCity(@RequestParam String country, @RequestParam String city, Authentication auth) {
        AppUser me = optionalUser(auth);
        List<CityActivityView> result = activities.findByGroup_CountryAndGroup_CityOrderByScheduledAtAsc(country, city)
                .stream()
                .map(a -> new CityActivityView(a.getId(), a.getGroup().getId(), a.getHost().getId(), a.getTitle(), a.getDescription(),
                        a.getCategory(), a.getLocation(), a.getLat(), a.getLng(), a.getScheduledAt().toString(),
                        rsvps.countByActivity(a), a.getMinAge(), a.getMaxAge(), a.getJoinPolicy(), a.getLocationPrecision(),
                        joinStatusFor(a, me)))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/group/{groupId}")
    public ResponseEntity<?> create(@PathVariable Long groupId, @RequestBody CreateActivityRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        CohortGroup group = groups.findById(groupId).orElseThrow();
        if (!isMember(group, me)) return ResponseEntity.status(403).body("Join this group first.");

        Instant scheduledAt;
        try {
            scheduledAt = Instant.parse(req.scheduledAt());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date/time.");
        }

        String distanceError = distanceGateError(group.getCountry(), group.getCity(), req.lat(), req.lng());
        if (distanceError != null) return ResponseEntity.badRequest().body(distanceError);

        Activity a = new Activity();
        a.setGroup(group);
        a.setHost(me);
        a.setTitle(req.title().trim());
        a.setDescription(req.description());
        a.setCategory(req.category());
        a.setLocation(req.location());
        a.setLat(req.lat());
        a.setLng(req.lng());
        a.setScheduledAt(scheduledAt);
        a.setCapacity(req.capacity());
        a.setMinAge(req.minAge());
        a.setMaxAge(req.maxAge());
        a.setJoinPolicy(normalizeJoinPolicy(req.joinPolicy()));
        a.setLocationPrecision(normalizeLocationPrecision(req.locationPrecision()));
        activities.save(a);

        // The host is automatically "going" to their own activity.
        ActivityRsvp rsvp = new ActivityRsvp();
        rsvp.setActivity(a);
        rsvp.setUser(me);
        rsvps.save(rsvp);

        return ResponseEntity.ok(toView(a, me));
    }

    // Creates an activity straight from the Explore/Map tab, with a
    // guaranteed pin - the caller doesn't need to have already joined (or
    // even seen) the destination's cohort group. Mirrors the RSVP auto-join
    // pattern below: creating a public event for a city means "I'm in",
    // so this silently creates/joins that city's group (still invisible by
    // default in any roster unless the caller opts in separately) rather
    // than requiring a prior join step.
    @PostMapping("/city")
    public ResponseEntity<?> createOnCityMap(@RequestBody CreateCityActivityRequest req, Authentication auth) {
        AppUser me = currentUser(auth);

        Instant scheduledAt;
        try {
            scheduledAt = Instant.parse(req.scheduledAt());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date/time.");
        }

        String distanceError = distanceGateError(req.country(), req.city(), req.lat(), req.lng());
        if (distanceError != null) return ResponseEntity.badRequest().body(distanceError);

        CohortGroup group = groups.findByCountryAndCity(req.country(), req.city()).orElseGet(() -> {
            CohortGroup g = new CohortGroup();
            g.setCountry(req.country());
            g.setCity(req.city());
            return groups.save(g);
        });
        if (!isMember(group, me)) {
            com.masar.model.CohortMembership membership = new com.masar.model.CohortMembership();
            membership.setGroup(group);
            membership.setUser(me);
            memberships.save(membership);
        }

        Activity a = new Activity();
        a.setGroup(group);
        a.setHost(me);
        a.setTitle(req.title().trim());
        a.setDescription(req.description());
        a.setCategory(req.category());
        a.setLocation(req.location());
        a.setLat(req.lat());
        a.setLng(req.lng());
        a.setScheduledAt(scheduledAt);
        a.setCapacity(req.capacity());
        a.setMinAge(req.minAge());
        a.setMaxAge(req.maxAge());
        a.setJoinPolicy(normalizeJoinPolicy(req.joinPolicy()));
        a.setLocationPrecision(normalizeLocationPrecision(req.locationPrecision()));
        activities.save(a);

        ActivityRsvp rsvp = new ActivityRsvp();
        rsvp.setActivity(a);
        rsvp.setUser(me);
        rsvps.save(rsvp);

        return ResponseEntity.ok(new CityActivityView(a.getId(), group.getId(), a.getHost().getId(), a.getTitle(), a.getDescription(),
                a.getCategory(), a.getLocation(), a.getLat(), a.getLng(), a.getScheduledAt().toString(),
                rsvps.countByActivity(a), a.getMinAge(), a.getMaxAge(), a.getJoinPolicy(), a.getLocationPrecision(),
                "going"));
    }

    @PostMapping("/{activityId}/rsvp")
    public ResponseEntity<?> rsvp(@PathVariable Long activityId, @RequestBody RsvpRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        Activity a = activities.findById(activityId).orElseThrow();

        if (req.going()) {
            // Age gate applies before anything else, whether the activity is
            // open or private - "who can join" in the wizard means it, not a
            // hint.
            String ageError = ageGateError(a, me);
            if (ageError != null) return ResponseEntity.status(403).body(ageError);
        }

        // RSVPing to a public activity (found via the city-wide Explore map)
        // auto-joins its cohort group rather than 403ing - joining is what
        // "I'm going" should mean here. Visibility still defaults to false,
        // same privacy-by-default rule as joining from the Community tab.
        // Applies whether the activity itself is open or private, since the
        // cohort group chat is a separate thing from this activity's guest list.
        if (!isMember(a.getGroup(), me)) {
            com.masar.model.CohortMembership membership = new com.masar.model.CohortMembership();
            membership.setGroup(a.getGroup());
            membership.setUser(me);
            memberships.save(membership);
        }

        boolean isPrivate = "private".equals(a.getJoinPolicy());

        if (req.going()) {
            if (rsvps.findByActivityAndUser(a, me).isPresent()) {
                // Already going (e.g. double-tap) - nothing to do.
            } else if (isPrivate && !a.getHost().getId().equals(me.getId())) {
                // Private activity, not the host: this becomes a pending
                // request instead of an instant RSVP - re-requesting after an
                // earlier decline reuses the same row rather than piling up.
                ActivityJoinRequest jr = joinRequests.findByActivityAndUser(a, me).orElseGet(() -> {
                    ActivityJoinRequest n = new ActivityJoinRequest();
                    n.setActivity(a);
                    n.setUser(me);
                    return n;
                });
                jr.setStatus("PENDING");
                jr.setDecidedAt(null);
                joinRequests.save(jr);
            } else {
                ActivityRsvp rsvp = new ActivityRsvp();
                rsvp.setActivity(a);
                rsvp.setUser(me);
                rsvps.save(rsvp);
            }
        } else {
            rsvps.deleteByActivityAndUser(a, me);
            // Also withdraw any pending/decided request of theirs, so "leave"
            // cleanly resets state for a possible future re-request.
            joinRequests.findByActivityAndUser(a, me).ifPresent(joinRequests::delete);
        }
        return ResponseEntity.ok(toView(a, me));
    }

    // ---- Private-activity join requests (host side) ----

    @GetMapping("/{activityId}/join-requests")
    public ResponseEntity<?> listJoinRequests(@PathVariable Long activityId, Authentication auth) {
        AppUser me = currentUser(auth);
        Activity a = activities.findById(activityId).orElseThrow();
        if (!a.getHost().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("Only the host can view join requests.");
        }
        List<JoinRequestView> result = joinRequests.findByActivityAndStatusOrderByCreatedAtAsc(a, "PENDING").stream()
                .map(jr -> new JoinRequestView(jr.getId(), jr.getUser().getId(), jr.getUser().getDisplayName(),
                        jr.getCreatedAt().toString()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/join-requests/{requestId}/approve")
    public ResponseEntity<?> approveJoinRequest(@PathVariable Long requestId, Authentication auth) {
        AppUser me = currentUser(auth);
        ActivityJoinRequest jr = joinRequests.findById(requestId).orElseThrow();
        Activity a = jr.getActivity();
        if (!a.getHost().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("Only the host can approve join requests.");
        }
        jr.setStatus("APPROVED");
        jr.setDecidedAt(Instant.now());
        joinRequests.save(jr);
        if (rsvps.findByActivityAndUser(a, jr.getUser()).isEmpty()) {
            ActivityRsvp rsvp = new ActivityRsvp();
            rsvp.setActivity(a);
            rsvp.setUser(jr.getUser());
            rsvps.save(rsvp);
        }
        return ResponseEntity.ok(toView(a, me));
    }

    @PostMapping("/join-requests/{requestId}/decline")
    public ResponseEntity<?> declineJoinRequest(@PathVariable Long requestId, Authentication auth) {
        AppUser me = currentUser(auth);
        ActivityJoinRequest jr = joinRequests.findById(requestId).orElseThrow();
        Activity a = jr.getActivity();
        if (!a.getHost().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("Only the host can decline join requests.");
        }
        jr.setStatus("DECLINED");
        jr.setDecidedAt(Instant.now());
        joinRequests.save(jr);
        return ResponseEntity.ok(toView(a, me));
    }

    private ActivityView toView(Activity a, AppUser me) {
        long going = rsvps.countByActivity(a);
        String status = joinStatusFor(a, me);
        return new ActivityView(a.getId(), a.getTitle(), a.getDescription(), a.getCategory(), a.getLocation(),
                a.getLat(), a.getLng(), a.getScheduledAt().toString(), a.getCapacity(),
                a.getHost().getDisplayName(), going, "going".equals(status),
                a.getMinAge(), a.getMaxAge(), a.getJoinPolicy(), a.getLocationPrecision(), status);
    }

    // "going" | "pending" | null - null covers both "never requested" and an
    // anonymous caller (me == null, only possible from the public forCity list).
    private String joinStatusFor(Activity a, AppUser me) {
        if (me == null) return null;
        if (rsvps.findByActivityAndUser(a, me).isPresent()) return "going";
        return joinRequests.findByActivityAndUser(a, me)
                .filter(jr -> "PENDING".equals(jr.getStatus()))
                .map(jr -> "pending")
                .orElse(null);
    }

    // null when the activity has no age restriction, or the caller clears it;
    // otherwise a message explaining why they can't RSVP.
    private String ageGateError(Activity a, AppUser me) {
        if (a.getMinAge() == null && a.getMaxAge() == null) return null;
        if (me.getBirthDate() == null) {
            return "Add your date of birth in Personal Info to join age-restricted activities.";
        }
        int age = Period.between(me.getBirthDate(), LocalDate.now()).getYears();
        if (a.getMinAge() != null && age < a.getMinAge()) return "This activity is for ages " + a.getMinAge() + "+.";
        if (a.getMaxAge() != null && age > a.getMaxAge()) return "This activity is limited to ages up to " + a.getMaxAge() + ".";
        return null;
    }

    private String normalizeJoinPolicy(String value) {
        return "private".equals(value) ? "private" : "open";
    }

    private String normalizeLocationPrecision(String value) {
        return "general".equals(value) ? "general" : "specific";
    }

    // null when the pin is fine (or there's no known center to check
    // against), otherwise a message explaining why it was rejected. Same
    // ~80km radius the frontend wizard checks client-side for instant
    // feedback (see cityCoordinates.js's haversineKm) - this is the
    // authoritative copy, since the client-side one can be bypassed.
    private String distanceGateError(String country, String city, Double lat, Double lng) {
        if (lat == null || lng == null) return null;
        CityCoordinates.LatLng center = CityCoordinates.resolve(country, city);
        double distanceKm = haversineKm(lat, lng, center.lat, center.lng);
        if (distanceKm > MAX_ACTIVITY_DISTANCE_KM) {
            return "That spot is " + Math.round(distanceKm) + " km from " + city + " - activities must be within "
                    + (int) MAX_ACTIVITY_DISTANCE_KM + " km of the city.";
        }
        return null;
    }

    private double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double earthRadiusKm = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    private boolean isMember(CohortGroup group, AppUser user) {
        return memberships.findByGroupAndUser(group, user).isPresent();
    }

    private AppUser currentUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return users.findByEmail(email).orElseThrow();
    }

    // Like currentUser, but for the one endpoint that's public (forCity) -
    // Spring Security's anonymous-auth filter still hands us a non-null
    // Authentication for a logged-out caller, with principal "anonymousUser"
    // (a plain String, not an account) rather than leaving auth null.
    private AppUser optionalUser(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof String email) || "anonymousUser".equals(email)) {
            return null;
        }
        return users.findByEmail(email).orElse(null);
    }
}
