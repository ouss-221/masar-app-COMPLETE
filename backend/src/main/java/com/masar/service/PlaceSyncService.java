package com.masar.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.masar.model.Place;
import com.masar.repository.PlaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

// Pulls real, free venue data (restaurants, cafes, bars, landmarks) from
// OpenStreetMap's public Overpass API - see claude/masar-12-screen-rebuild.md
// for why: no ratings/reviews are fabricated anywhere in this app, and a real
// places API with ratings (Google Places) needs a billed API key the user
// doesn't have yet. Two public mirrors are tried in order since the main
// instance is sometimes overloaded - this is exactly the kind of flaky
// external dependency that should never take the whole app down, so every
// call site around this class wraps it in try/catch and just logs a warning
// on failure (see PlaceSeeder).
//
// IMPORTANT: this could not be live-tested from the build sandbox - the
// sandbox's network policy blocks overpass-api.de outright (403 at the
// egress proxy). The query shape and JSON response format below are taken
// from Overpass API's own documentation (wiki.openstreetmap.org/wiki/Overpass_API),
// not from a live response, so please watch `docker compose logs backend -f`
// after your first startup with this change and tell me what it logs.
@Service
public class PlaceSyncService {

    private static final Logger log = LoggerFactory.getLogger(PlaceSyncService.class);

    // Public Overpass mirrors, tried in order. All are free, no API key.
    private static final String[] ENDPOINTS = {
            "https://overpass-api.de/api/interpreter",
            "https://overpass.kumi.systems/api/interpreter",
            "https://lz4.overpass-api.de/api/interpreter",
    };

    private static final int RADIUS_METERS = 2500;
    private static final int MAX_PER_CATEGORY = 20;

    private final PlaceRepository places;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public PlaceSyncService(PlaceRepository places) {
        this.places = places;
    }

    /** Fetches real venues near (lat,lng) and upserts them for this country/city. Returns how many were saved (new). */
    public int syncCity(String country, String city, double lat, double lng) throws Exception {
        String query = buildQuery(lat, lng);
        JsonNode root = fetchWithFallback(query);
        JsonNode elements = root.path("elements");

        int saved = 0;
        for (JsonNode el : elements) {
            Long osmId = el.path("id").asLong(0);
            if (osmId == 0 || places.existsByOsmId(osmId)) continue;

            JsonNode tags = el.path("tags");
            String name = tags.path("name").asText(null);
            if (name == null || name.isBlank()) continue; // skip unnamed nodes - not useful pins

            String category = categorize(tags);
            if (category == null) continue;

            Place p = new Place();
            p.setOsmId(osmId);
            p.setCountry(country);
            p.setCity(city);
            p.setCategory(category);
            p.setName(name.trim());
            p.setLat(el.path("lat").asDouble());
            p.setLng(el.path("lon").asDouble());
            p.setAddress(buildAddress(tags));
            String hours = tags.path("opening_hours").asText(null);
            if (hours != null && hours.length() > 120) hours = hours.substring(0, 120);
            p.setOpeningHours(hours);
            places.save(p);
            saved++;
        }
        return saved;
    }

    private String buildQuery(double lat, double lng) {
        return "[out:json][timeout:25];" +
                "(" +
                "node[\"amenity\"~\"restaurant\"](around:" + RADIUS_METERS + "," + lat + "," + lng + ");" +
                "node[\"amenity\"~\"cafe\"](around:" + RADIUS_METERS + "," + lat + "," + lng + ");" +
                "node[\"amenity\"~\"bar|pub\"](around:" + RADIUS_METERS + "," + lat + "," + lng + ");" +
                "node[\"tourism\"~\"attraction|museum|viewpoint\"](around:" + RADIUS_METERS + "," + lat + "," + lng + ");" +
                ");" +
                "out body " + (MAX_PER_CATEGORY * 4) + ";";
    }

    private JsonNode fetchWithFallback(String query) throws Exception {
        Exception last = null;
        for (String endpoint : ENDPOINTS) {
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .timeout(Duration.ofSeconds(25))
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .POST(HttpRequest.BodyPublishers.ofString("data=" + java.net.URLEncoder.encode(query, "UTF-8")))
                        .build();
                HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    return mapper.readTree(response.body());
                }
                log.warn("Overpass endpoint {} returned HTTP {}", endpoint, response.statusCode());
            } catch (Exception e) {
                last = e;
                log.warn("Overpass endpoint {} failed: {}", endpoint, e.toString());
            }
        }
        throw last != null ? last : new RuntimeException("All Overpass endpoints failed");
    }

    private String categorize(JsonNode tags) {
        String amenity = tags.path("amenity").asText("");
        String tourism = tags.path("tourism").asText("");
        if (amenity.equals("restaurant")) return "restaurant";
        if (amenity.equals("cafe")) return "cafe";
        if (amenity.equals("bar") || amenity.equals("pub")) return "bar";
        if (!tourism.isEmpty()) return "landmark";
        return null;
    }

    private String buildAddress(JsonNode tags) {
        String houseNumber = tags.path("addr:housenumber").asText("");
        String street = tags.path("addr:street").asText("");
        List<String> parts = new ArrayList<>();
        if (!street.isEmpty()) {
            parts.add((houseNumber.isEmpty() ? "" : houseNumber + " ") + street);
        }
        String addr = String.join(", ", parts);
        return addr.isBlank() ? null : (addr.length() > 240 ? addr.substring(0, 240) : addr);
    }
}
