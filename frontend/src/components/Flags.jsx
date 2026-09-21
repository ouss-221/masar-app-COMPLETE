import { useId } from 'react';

// Small circular flag badges for the 6 nationalities/destinations the app
// supports. Windows doesn't ship a color flag-emoji font, so Chrome/Edge on
// Windows silently fall back to plain letters ("DZ", "ES"...) instead of a
// picture wherever the app used a flag emoji character - these are plain
// inline SVG, so they render identically (and crisply) on every platform.

function Badge({ size, children }) {
  const clipId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <clipPath id={clipId}><circle cx="18" cy="18" r="18" /></clipPath>
      <g clipPath={`url(#${clipId})`}>{children}</g>
      <circle cx="18" cy="18" r="17.4" fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" />
    </svg>
  );
}

export function FlagDZ({ size = 28 }) {
  return (
    <Badge size={size}>
      <rect x="0" y="0" width="18" height="36" fill="#006233" />
      <rect x="18" y="0" width="18" height="36" fill="#fff" />
      <circle cx="19.5" cy="18" r="6.5" fill="#D21034" />
      <circle cx="22" cy="18" r="5.4" fill="#fff" />
      <polygon fill="#D21034" points="24.5,13.2 25.6,16.6 29.2,16.6 26.3,18.7 27.4,22.1 24.5,20 21.6,22.1 22.7,18.7 19.8,16.6 23.4,16.6" />
    </Badge>
  );
}

export function FlagMA({ size = 28 }) {
  return (
    <Badge size={size}>
      <rect width="36" height="36" fill="#C1272D" />
      <polygon
        points="18,9.5 20.35,16.5 27.7,16.5 21.8,20.8 24,27.8 18,23.4 12,27.8 14.2,20.8 8.3,16.5 15.65,16.5"
        fill="none" stroke="#006233" strokeWidth="1.7" strokeLinejoin="round"
      />
    </Badge>
  );
}

export function FlagTN({ size = 28 }) {
  return (
    <Badge size={size}>
      <rect width="36" height="36" fill="#E70013" />
      <circle cx="18" cy="18" r="9.2" fill="#fff" />
      <circle cx="18" cy="18" r="6.6" fill="#E70013" />
      <circle cx="20.1" cy="18" r="5.3" fill="#fff" />
      <polygon fill="#E70013" points="20.3,14.6 21.2,17.2 24,17.2 21.7,18.8 22.6,21.4 20.3,19.8 18,21.4 18.9,18.8 16.6,17.2 19.4,17.2" />
    </Badge>
  );
}

export function FlagES({ size = 28 }) {
  return (
    <Badge size={size}>
      <rect width="36" height="36" fill="#AA151B" />
      <rect y="10.8" width="36" height="14.4" fill="#F1BF00" />
    </Badge>
  );
}

export function FlagFR({ size = 28 }) {
  return (
    <Badge size={size}>
      <rect x="0" width="12" height="36" fill="#0055A4" />
      <rect x="12" width="12" height="36" fill="#fff" />
      <rect x="24" width="12" height="36" fill="#EF4135" />
    </Badge>
  );
}

export function FlagIT({ size = 28 }) {
  return (
    <Badge size={size}>
      <rect x="0" width="12" height="36" fill="#009246" />
      <rect x="12" width="12" height="36" fill="#fff" />
      <rect x="24" width="12" height="36" fill="#CE2B37" />
    </Badge>
  );
}

export const FLAG_MAP = {
  dz: FlagDZ, ma: FlagMA, tn: FlagTN,
  es: FlagES, fr: FlagFR, it: FlagIT,
};
