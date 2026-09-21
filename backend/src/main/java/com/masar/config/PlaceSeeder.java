package com.masar.config;

import com.masar.repository.PlaceRepository;
import com.masar.service.PlaceSyncService;
import com.masar.util.CityCoordinates;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

// One-time background sync of real venues (restaurants/cafes/bars/landmarks)
// for every city the app offers, via OpenStreetMap's free Overpass API - see
// PlaceSyncService for why this exists instead of a paid places API.
//
// Runs on its OWN thread, off the Spring Boot startup path, specifically so a
// slow or unreachable Overpass endpoint never delays "Started
// MasarApplication" or looks like the app hung. Only runs once ever (skips if
// the places table already has rows), and every city is wrapped in its own
// try/catch so one failure doesn't stop the rest. Watch progress with
// `docker compose logs backend -f`.
@Component
public class PlaceSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(PlaceSeeder.class);

    // country code -> city name, matching CITIES_BY_COUNTRY in profileOptions.js
    private static final Map<String, String[]> CITIES = new LinkedHashMap<>();
    static {
        CITIES.put("es", new String[]{"Madrid", "Barcelona", "Valencia", "Granada", "Alicante", "Zaragoza", "Sevilla"});
        CITIES.put("fr", new String[]{"Paris", "Lyon", "Marseille", "Lille", "Strasbourg", "Bordeaux", "Montpellier", "Nantes"});
        CITIES.put("it", new String[]{"Rome", "Milan", "Turin", "Bologna", "Padua", "Pisa", "Florence", "Naples"});
    }

    private final PlaceRepository places;
    private final PlaceSyncService syncService;

    public PlaceSeeder(PlaceRepository places, PlaceSyncService syncService) {
        this.places = places;
        this.syncService = syncService;
    }

    @Override
    public void run(String... args) {
        if (places.count() > 0) {
            log.info("Place sync: places table already has data, skipping background sync.");
            return;
        }

        Thread syncThread = new Thread(this::syncAllCities, "place-sync");
        syncThread.setDaemon(true);
        syncThread.start();
    }

    private void syncAllCities() {
        int totalCities = CITIES.values().stream().mapToInt(a -> a.length).sum();
        int done = 0;
        log.info("Place sync: starting background sync for {} cities from OpenStreetMap...", totalCities);

        for (Map.Entry<String, String[]> entry : CITIES.entrySet()) {
            String country = entry.getKey();
            for (String city : entry.getValue()) {
                done++;
                try {
                    CityCoordinates.LatLng center = CityCoordinates.resolve(country, city);
                    int saved = syncService.syncCity(country, city, center.lat, center.lng);
                    log.info("Place sync ({}/{}): {} , {} -> {} places saved", done, totalCities, city, country, saved);
                } catch (Exception e) {
                    log.warn("Place sync ({}/{}): {} , {} FAILED: {}", done, totalCities, city, country, e.toString());
                }
                try {
                    Thread.sleep(1200); // fair-use spacing for the free public Overpass API
                } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
        log.info("Place sync: background sync finished ({} cities attempted).", totalCities);
    }
}
