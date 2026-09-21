package com.masar.controller;

import com.masar.model.Place;
import com.masar.repository.PlaceRepository;
import com.masar.service.PlaceSyncService;
import com.masar.util.CityCoordinates;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Real venues (restaurant/cafe/bar/landmark), sourced from OpenStreetMap -
// see PlaceSyncService. GET is public (browsing venues shouldn't require an
// account, same reasoning as /api/community/counts); the manual re-sync
// endpoint requires login just so it can't be hammered by anonymous callers.
@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceRepository places;
    private final PlaceSyncService syncService;

    public PlaceController(PlaceRepository places, PlaceSyncService syncService) {
        this.places = places;
        this.syncService = syncService;
    }

    public record SyncResult(int saved) {}

    @GetMapping
    public List<Place> forCity(@RequestParam String country, @RequestParam String city,
                                @RequestParam(required = false) String category) {
        return category == null || category.isBlank()
                ? places.findByCountryAndCity(country, city)
                : places.findByCountryAndCityAndCategory(country, city, category);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> one(@PathVariable Long id) {
        return places.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Lets a logged-in user force a re-sync for their own city if the
    // background seeder hasn't produced results yet (e.g. it ran while
    // Overpass was briefly down). Authenticated only to discourage abuse of a
    // third-party free API.
    @PostMapping("/sync")
    public ResponseEntity<?> sync(@RequestParam String country, @RequestParam String city) {
        try {
            CityCoordinates.LatLng center = CityCoordinates.resolve(country, city);
            int saved = syncService.syncCity(country, city, center.lat, center.lng);
            return ResponseEntity.ok(new SyncResult(saved));
        } catch (Exception e) {
            return ResponseEntity.status(502).body("Could not reach OpenStreetMap right now: " + e.getMessage());
        }
    }
}
