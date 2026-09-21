import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_COORDINATES, COUNTRY_FALLBACK_CENTER } from '../data/cityCoordinates.js';
import { MAP_LAYERS, pinIcon } from '../utils/mapPins.js';
import { IconPin } from './Icons.jsx';

// react-leaflet + the shared Mapbox/Esri basemap (see utils/mapPins.js for
// the shared tile/pin styling used app-wide) with circular emoji pins
// instead of Leaflet's default marker images, since those reference
// relative image paths that break under Vite's bundling - this sidesteps
// that well-known issue entirely rather than fighting it.
const ACTIVITY_ICON = pinIcon('🎉', '#0B5C56');
const PICK_ICON = pinIcon('📍', '#B85C2E');

function ClickToPick({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

// "Center pin" picking - the map itself doesn't move a marker; instead a
// fixed pin overlay sits over the container's exact center (see the
// non-Leaflet <div> below) and the user drags/zooms the MAP underneath it,
// same pattern as Google Maps' or Uber's location picker. Far easier to
// land a precise spot with a thumb than tapping a specific pixel - a real
// complaint from testing ("touched the screen ... wiped off", asking for
// "a stick or something similar... to choose where to put it").
function CenterTracker({ onMove }) {
  const map = useMapEvents({
    moveend() {
      const c = map.getCenter();
      onMove(c.lat, c.lng);
    },
  });
  useEffect(() => {
    const c = map.getCenter();
    onMove(c.lat, c.lng);
    // Only on mount - moveend above handles every drag/zoom after this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// activities: [{id, title, lat, lng, scheduledAt, goingCount}] - items
// without lat/lng are filtered out defensively below (a map pin is optional
// when creating an activity). onPick (optional): when set, the map becomes
// a location picker. pickMode: 'tap' (default - click the map to drop a pin
// at that exact point, still used by CohortRoom's own activity form) or
// 'center' (drag the map under a fixed center pin instead - see
// CenterTracker above; used by Explore.jsx's wizard).
export default function ActivityMap({ activities = [], country, city, onPick, pickedPosition, pickMode = 'tap', height = 320 }) {
  const center = CITY_COORDINATES[city] || COUNTRY_FALLBACK_CENTER[country] || [41.9, 12.5];
  const pinned = activities.filter((a) => typeof a.lat === 'number' && typeof a.lng === 'number');
  const centerMode = onPick && pickMode === 'center';

  return (
    <div style={{ height, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
      <MapContainer center={pickedPosition || center} zoom={centerMode ? 15 : 12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={!!onPick}>
        {MAP_LAYERS.map((layer, i) => (
          <TileLayer key={i} url={layer.url} attribution={layer.attribution} />
        ))}
        {pinned.map((a) => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={ACTIVITY_ICON}>
            <Popup>
              <strong>{a.title}</strong>
              {a.scheduledAt && <div style={{ fontSize: 12 }}>{new Date(a.scheduledAt).toLocaleString()}</div>}
              {a.goingCount != null && <div style={{ fontSize: 12 }}>{a.goingCount} going</div>}
            </Popup>
          </Marker>
        ))}
        {onPick && !centerMode && <ClickToPick onPick={onPick} />}
        {onPick && centerMode && <CenterTracker onMove={onPick} />}
        {pickedPosition && !centerMode && <Marker position={pickedPosition} icon={PICK_ICON} />}
      </MapContainer>

      {centerMode && (
        <div className="m-map-center-pin" aria-hidden="true">
          <IconPin size={34} />
          <div className="m-map-center-pin-dot" />
        </div>
      )}
    </div>
  );
}
