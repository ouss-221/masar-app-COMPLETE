import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, Pane, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_COORDINATES, COUNTRY_FALLBACK_CENTER } from '../data/cityCoordinates.js';
import { MAP_LAYERS, pinIcon, myLocationIcon } from '../utils/mapPins.js';
import { categoryFor } from '../data/activityCategories.js';

// Nomadtable-style activity map: student-created activities only (the real
// restaurant/cafe/bar/landmark venue layer that used to live here was
// removed - the user didn't want it, and it never covered every city anyway,
// see masar-community-map-plan.md's history notes). Kept as its own
// component rather than folding into ActivityMap.jsx so CohortRoom's picker
// usage stays untouched.
const PIN_ICON_CACHE = new Map();
function iconFor(categoryKey) {
  if (!PIN_ICON_CACHE.has(categoryKey)) {
    const c = categoryFor(categoryKey);
    PIN_ICON_CACHE.set(categoryKey, pinIcon(c.emoji, c.color));
  }
  return PIN_ICON_CACHE.get(categoryKey);
}

const ME_ICON = myLocationIcon();

// Recenters the map on myPosition whenever it changes (e.g. right after a
// "locate me" tap, or the automatic on-load locate) without fighting the
// user's own pan/zoom afterward - only fires again if the position itself
// changes.
//
// Real report: "it's showing but the second I refresh it goes [away]." This
// used to always snap to a tight zoom=15 around the live GPS fix alone - if
// an already-visible activity (e.g. one just created a short walk from the
// exact spot the phone's GPS reports, which can easily differ by a few
// hundred meters to a couple km) wasn't within that much tighter viewport,
// the auto-recenter would scroll it straight off-screen a moment after the
// page loaded and looked fine. Now, when there are pins to consider, it fits
// the map to a bounds that includes the live position AND every currently-
// loaded activity, so recentering on "me" can never strand an existing pin
// out of view; maxZoom keeps it from zooming in absurdly tight when
// everything happens to be right next to each other.
function RecenterOnPosition({ position, pins = [], zoom = 15 }) {
  const map = useMap();
  const lastRef = useRef(null);
  useEffect(() => {
    if (!position) return;
    const last = lastRef.current;
    if (last && last[0] === position[0] && last[1] === position[1]) return;
    lastRef.current = position;
    if (pins.length > 0) {
      const bounds = L.latLngBounds([position, ...pins.map((p) => [p.lat, p.lng])]);
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: zoom });
    } else {
      map.setView(position, zoom);
    }
  }, [position, zoom, map, pins]);
  return null;
}

// activities: [{id, category, title, lat, lng, scheduledAt, goingCount,
// joinPolicy, locationPrecision, joinStatus, minAge, maxAge}]. An activity
// with locationPrecision === 'general' (the wizard's "rough area" choice)
// renders as a translucent circle instead of a precise pin - the host only
// shared a neighborhood, not an exact spot. myPosition (optional): [lat,
// lng] from the browser's own Geolocation API (see Explore.jsx's "locate
// me" button) - purely client-side, never sent to the backend.
export default function ExploreMap({ activities = [], country, city, onSelectActivity, myPosition, height = 320, t }) {
  const center = myPosition || CITY_COORDINATES[city] || COUNTRY_FALLBACK_CENTER[country] || [41.9, 12.5];

  // Defensive: adding a pin is optional when a student creates an activity
  // from within CohortRoom (see its own "add a pin" toggle), so some
  // activities coming back from GET /api/activities/city may have no
  // lat/lng - skip those here rather than pass a null position into
  // Leaflet, which throws.
  const pinned = activities.filter((a) => typeof a.lat === 'number' && typeof a.lng === 'number');

  const popupBody = (a) => {
    const cat = categoryFor(a.category);
    return (
      <div style={{ minWidth: 140 }}>
        <strong>{cat.emoji} {a.title}</strong>
        {a.scheduledAt && <div style={{ fontSize: 12 }}>{new Date(a.scheduledAt).toLocaleString()}</div>}
        <div style={{ fontSize: 12, display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
          {a.goingCount != null && <span>{a.goingCount} {t?.going || 'going'}</span>}
          {a.joinPolicy === 'private' && <span title="Private">🔒</span>}
        </div>
        {a.joinStatus === 'pending' && (
          <div style={{ fontSize: 11.5, color: '#B85C2E', marginTop: 2 }}>{t?.pending || 'Request pending'}</div>
        )}
        {a.joinStatus === 'going' && (
          <div style={{ fontSize: 11.5, color: '#0B5C56', marginTop: 2 }}>{t?.youreGoing || "You're going"}</div>
        )}
        {onSelectActivity && (
          <button type="button" onClick={() => onSelectActivity(a)}
            style={{ marginTop: 6, fontSize: 12, border: 'none', background: 'none', color: '#2E7CF6', padding: 0, cursor: 'pointer' }}>
            {t?.viewDetails || 'View details →'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ height, borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        {MAP_LAYERS.map((layer, i) => (
          <TileLayer key={i} url={layer.url} attribution={layer.attribution} />
        ))}
        {pinned.map((a) =>
          a.locationPrecision === 'general' ? (
            <Circle key={`a-${a.id}`} center={[a.lat, a.lng]} radius={280}
              pathOptions={{ color: categoryFor(a.category).color, fillColor: categoryFor(a.category).color, fillOpacity: 0.25, weight: 1.5 }}>
              <Popup>{popupBody(a)}</Popup>
            </Circle>
          ) : (
            <Marker key={`a-${a.id}`} position={[a.lat, a.lng]} icon={iconFor(a.category)}>
              <Popup>{popupBody(a)}</Popup>
            </Marker>
          )
        )}
        {/* A newly-created activity often sits right on top of the host's own
            live position (the wizard's map opens centered there, and it's easy
            not to drag the pin away) - a real report: "I made one but I can't
            see it on the map." It IS there (the count badge for its category
            proves the whole city sees it - GET /api/activities/city has no
            per-caller filtering), it was just hidden underneath this "you are
            here" dot. A dedicated pane below both the vector overlayPane
            (Circles, z400) and the markerPane (Markers, z600) guarantees any
            activity - pin or fuzzy-area circle - always paints above it,
            instead of the two competing on insertion order/latitude. */}
        {myPosition && (
          <Pane name="m-my-location-pane" style={{ zIndex: 350 }}>
            <Marker position={myPosition} icon={ME_ICON} />
          </Pane>
        )}
        <RecenterOnPosition position={myPosition} pins={pinned} />
      </MapContainer>
    </div>
  );
}
