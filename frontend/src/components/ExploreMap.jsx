import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
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
// "locate me" tap) without fighting the user's own pan/zoom afterward -
// only fires again if the position itself changes.
function RecenterOnPosition({ position, zoom = 15 }) {
  const map = useMap();
  const lastRef = useRef(null);
  useEffect(() => {
    if (!position) return;
    const last = lastRef.current;
    if (last && last[0] === position[0] && last[1] === position[1]) return;
    lastRef.current = position;
    map.setView(position, zoom);
  }, [position, zoom, map]);
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
        {myPosition && <Marker position={myPosition} icon={ME_ICON} />}
        <RecenterOnPosition position={myPosition} />
      </MapContainer>
    </div>
  );
}
