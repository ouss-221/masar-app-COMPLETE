// Shared map look for every Leaflet map in the app (the Explore/Map tab and
// CohortRoom's activity map): a clean, colorful basemap instead of raw
// OpenStreetMap tiles, and circular emoji badge pins instead of teardrop
// markers - closer to the modern, easy-to-scan look the user asked for
// (referencing a Nomadtable-style map).
//
// Tile source, current: Mapbox's "Light" style (api.mapbox.com), using the
// user's own free-tier access token (VITE_MAPBOX_TOKEN, set in
// frontend/.env - same pattern as RESEND_API_KEY earlier in this project;
// Mapbox's free tier is 50,000 map loads/month, no credit card required -
// see the pricing discussion earlier in this project). Live-verified this
// session with the user's real token (real ~60-80KB tiles over Madrid,
// status 200) before shipping. Falls back to the free/keyless Esri "Light
// Gray Canvas" (two stacked layers - base + labels) if VITE_MAPBOX_TOKEN
// isn't set, e.g. a teammate running this project without their own Mapbox
// account/frontend/.env yet, so the app never breaks for lack of a token.
//
// History: an earlier version of this file used CARTO's Voyager basemap
// (basemaps.cartocdn.com), which turned out to now require an API key -
// CARTO started rendering "API KEY REQUIRED" watermark tiles in production,
// confirmed by the user's own screenshot. A later version used Esri's
// (colorful) World Street Map, then Esri's Light Gray Canvas (the user
// didn't like the yellow/tan World Street Map colors), both free/keyless -
// Light Gray Canvas is kept as the fallback below. If Mapbox's free tier is
// ever exhausted, plain OSM tiles
// (https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png, subdomains 'abc')
// remain the ultimate free/keyless fallback - reliable throughout this
// project.
import L from 'leaflet';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Every consumer (ExploreMap.jsx, ActivityMap.jsx) renders one <TileLayer>
// per entry here, in order - Mapbox's style bakes streets+labels into one
// layer, Esri's Light Gray Canvas needs its base and reference-labels
// layers stacked as two, so this list can be 1 or 2 items depending on
// which provider is active.
export const MAP_LAYERS = MAPBOX_TOKEN
  ? [
      {
        // Mapbox's tile scheme is the usual z/x/y.
        url: `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    ]
  : [
      {
        // Esri's tile scheme is z/y/x (not the usual z/x/y) - Leaflet's
        // TileLayer just substitutes each {placeholder} by name, so this is
        // fine as-is.
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors, and the GIS User Community',
      },
      {
        // Labels (street/place names), transparent background, stacked on
        // top of the base layer above - never used alone.
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      },
    ];

// Circular badge pin with an emoji glyph, colored per category - built as an
// inline-SVG-free plain div icon (not Leaflet's default marker images,
// which reference relative paths that break under Vite's bundling).
export function pinIcon(emoji, color, size = 34) {
  const r = size / 2;
  return L.divIcon({
    className: 'm-map-pin',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:2.5px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
      font-size:${Math.round(size * 0.52)}px;line-height:1;
    ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [r, r],
    popupAnchor: [0, -r],
  });
}

// The classic "you are here" blue dot with a soft pulsing halo, for the
// Explore map's opt-in "locate me" button (see Explore.jsx) - this is a
// one-tap, client-side-only position lookup via the browser's own
// Geolocation API, never sent to or stored on the backend. Distinct from
// this app's separate, backend-tracked "Nearby Students" location-sharing
// feature (see LocationController/NearbyStudents.jsx) - this one is just
// "where am I on this map right now."
let pulseStyleInjected = false;
function ensurePulseStyle() {
  if (pulseStyleInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes m-map-pulse { 0% { transform: scale(0.6); opacity: 0.55; } 100% { transform: scale(2.2); opacity: 0; } }
  `;
  document.head.appendChild(style);
  pulseStyleInjected = true;
}

export function myLocationIcon(size = 20) {
  ensurePulseStyle();
  const r = size / 2;
  return L.divIcon({
    className: 'm-map-pin m-map-pin-me',
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:#2E7CF6;
        animation:m-map-pulse 1.8s ease-out infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:#2E7CF6;
        border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [r, r],
    popupAnchor: [0, -r],
  });
}
