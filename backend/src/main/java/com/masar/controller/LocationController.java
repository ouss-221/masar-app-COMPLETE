package com.masar.controller;

import com.masar.model.AppUser;
import com.masar.model.UserLocation;
import com.masar.repository.AppUserRepository;
import com.masar.repository.UserBlockRepository;
import com.masar.repository.UserLocationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

// Opt-in, browser-session live location - see UserLocation for the "why" and
// the safety notes in claude/masar-community-map-plan.md. Two things this
// deliberately does NOT do, on purpose: it never returns another user's raw
// lat/lng to a caller (only a rounded, server-computed distance), and it
// never runs in the background - the frontend only pings while its Nearby
// tab is actually open, so "live" here means "live while you're looking at
// the page", not a persistent background location service.
@RestController
@RequestMapping("/api/location")
public class LocationController {

    private static final double STALE_AFTER_MINUTES = 60;   // don't show positions older than this at all
    private static final double ONLINE_WITHIN_MINUTES = 5;  // "Online" vs "Away"

    private final UserLocationRepository locations;
    private final AppUserRepository users;
    private final UserBlockRepository blocks;

    public LocationController(UserLocationRepository locations, AppUserRepository users, UserBlockRepository blocks) {
        this.locations = locations;
        this.users = users;
        this.blocks = blocks;
    }

    public record SharingRequest(boolean sharing) {}
    public record PingRequest(double lat, double lng) {}
    public record NearbyUser(Long userId, String displayName, String originCountry, String university,
                              String programType, double distanceKm, boolean online) {}

    // Turn location sharing on/off. Turning off immediately clears the stored
    // position - see UserLocation's javadoc for why that matters.
    @PutMapping("/sharing")
    public ResponseEntity<?> setSharing(@RequestBody SharingRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        UserLocation loc = locations.findByUser(me).orElseGet(() -> {
            UserLocation l = new UserLocation();
            l.setUser(me);
            return l;
        });
        loc.setSharing(req.sharing());
        if (!req.sharing()) {
            loc.setLat(null);
            loc.setLng(null);
        }
        loc.setUpdatedAt(Instant.now());
        locations.save(loc);
        return ResponseEntity.ok().build();
    }

    // Periodic position update - the frontend only calls this while sharing
    // is on AND the Nearby tab is open, never in the background.
    @PutMapping("/ping")
    public ResponseEntity<?> ping(@RequestBody PingRequest req, Authentication auth) {
        AppUser me = currentUser(auth);
        UserLocation loc = locations.findByUser(me).orElse(null);
        if (loc == null || !loc.isSharing()) {
            return ResponseEntity.status(400).body("Turn on location sharing first.");
        }
        loc.setLat(req.lat());
        loc.setLng(req.lng());
        loc.setUpdatedAt(Instant.now());
        locations.save(loc);
        return ResponseEntity.ok().build();
    }

    // Requires the caller to be sharing too (reciprocity - you can only
    // browse who's nearby if you're also visible to them), and the caller's
    // own current position is passed straight from the browser rather than
    // trusted from the DB, so it's as fresh as possible.
    @GetMapping("/nearby")
    public ResponseEntity<?> nearby(@RequestParam double lat, @RequestParam double lng,
                                     @RequestParam(defaultValue = "10") double radiusKm, Authentication auth) {
        AppUser me = currentUser(auth);
        UserLocation myLoc = locations.findByUser(me).orElse(null);
        if (myLoc == null || !myLoc.isSharing()) {
            return ResponseEntity.status(403).body("Turn on location sharing to see nearby students.");
        }

        Instant staleCutoff = Instant.now().minus((long) STALE_AFTER_MINUTES, ChronoUnit.MINUTES);
        Instant onlineCutoff = Instant.now().minus((long) ONLINE_WITHIN_MINUTES, ChronoUnit.MINUTES);

        List<NearbyUser> result = locations.findBySharingTrue().stream()
                .filter(loc -> loc.getLat() != null && loc.getLng() != null)
                .filter(loc -> !loc.getUser().getId().equals(me.getId()))
                .filter(loc -> loc.getUpdatedAt().isAfter(staleCutoff))
                .filter(loc -> !blocks.existsByBlockerAndBlocked(me, loc.getUser()))
                .filter(loc -> !blocks.existsByBlockerAndBlocked(loc.getUser(), me))
                .map(loc -> {
                    double distanceKm = haversineKm(lat, lng, loc.getLat(), loc.getLng());
                    boolean online = loc.getUpdatedAt().isAfter(onlineCutoff);
                    AppUser u = loc.getUser();
                    return new NearbyUser(u.getId(), u.getDisplayName(), u.getOriginCountry(), u.getUniversity(),
                            u.getProgramType(), Math.round(distanceKm * 10) / 10.0, online);
                })
                .filter(nu -> nu.distanceKm() <= radiusKm)
                .sorted((a, b) -> Double.compare(a.distanceKm(), b.distanceKm()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
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

    private AppUser currentUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return users.findByEmail(email).orElseThrow();
    }
}
