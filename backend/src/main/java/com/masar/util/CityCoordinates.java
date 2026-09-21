package com.masar.util;

import java.util.LinkedHashMap;
import java.util.Map;

// Backend mirror of frontend/src/data/cityCoordinates.js - kept in sync
// deliberately (same real, verified city-center coordinates) so the
// PlaceSeeder queries Overpass around the exact same points the map centers
// on. If you add a city on the frontend, add it here too.
public final class CityCoordinates {

    public static final class LatLng {
        public final double lat;
        public final double lng;
        public LatLng(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    public static final Map<String, LatLng> BY_CITY = new LinkedHashMap<>();
    static {
        // Spain
        BY_CITY.put("Madrid", new LatLng(40.4168, -3.7038));
        BY_CITY.put("Barcelona", new LatLng(41.3874, 2.1686));
        BY_CITY.put("Valencia", new LatLng(39.4699, -0.3763));
        BY_CITY.put("Granada", new LatLng(37.1773, -3.5986));
        BY_CITY.put("Alicante", new LatLng(38.3452, -0.481));
        BY_CITY.put("Zaragoza", new LatLng(41.6488, -0.8891));
        BY_CITY.put("Sevilla", new LatLng(37.3891, -5.9845));
        // France
        BY_CITY.put("Paris", new LatLng(48.8566, 2.3522));
        BY_CITY.put("Lyon", new LatLng(45.764, 4.8357));
        BY_CITY.put("Marseille", new LatLng(43.2965, 5.3698));
        BY_CITY.put("Lille", new LatLng(50.6292, 3.0573));
        BY_CITY.put("Strasbourg", new LatLng(48.5734, 7.7521));
        BY_CITY.put("Bordeaux", new LatLng(44.8378, -0.5792));
        BY_CITY.put("Montpellier", new LatLng(43.6108, 3.8767));
        BY_CITY.put("Nantes", new LatLng(47.2184, -1.5536));
        // Italy
        BY_CITY.put("Rome", new LatLng(41.9028, 12.4964));
        BY_CITY.put("Milan", new LatLng(45.4642, 9.19));
        BY_CITY.put("Turin", new LatLng(45.0703, 7.6869));
        BY_CITY.put("Bologna", new LatLng(44.4949, 11.3426));
        BY_CITY.put("Padua", new LatLng(45.4064, 11.8768));
        BY_CITY.put("Pisa", new LatLng(43.7228, 10.4017));
        BY_CITY.put("Florence", new LatLng(43.7696, 11.2558));
        BY_CITY.put("Naples", new LatLng(40.8518, 14.2681));
    }

    public static final Map<String, LatLng> COUNTRY_FALLBACK = new LinkedHashMap<>();
    static {
        COUNTRY_FALLBACK.put("es", new LatLng(40.4168, -3.7038));
        COUNTRY_FALLBACK.put("fr", new LatLng(48.8566, 2.3522));
        COUNTRY_FALLBACK.put("it", new LatLng(41.9028, 12.4964));
    }

    public static LatLng resolve(String country, String city) {
        LatLng byCity = BY_CITY.get(city);
        if (byCity != null) return byCity;
        LatLng fallback = COUNTRY_FALLBACK.get(country);
        return fallback != null ? fallback : new LatLng(41.9, 12.5);
    }

    private CityCoordinates() {}
}
