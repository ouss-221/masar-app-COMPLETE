// Small line-icon set used on the redesigned Home screen (and anywhere else
// that wants a matching icon instead of an emoji). Plain inline SVG, no
// icon-font dependency, so it renders identically across platforms
// (including the Capacitor/Android build).

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconCap({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6 11.7v4.3c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.3" />
      <path d="M21 9.5v6" />
    </svg>
  );
}

export function IconVisa({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <circle cx="9" cy="10.3" r="1.9" />
      <path d="M5.3 16.5c.6-1.7 2-2.6 3.7-2.6s3.1.9 3.7 2.6" />
      <path d="M15 9.5h4M15 12.5h4" />
    </svg>
  );
}

export function IconHome({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M4 11.2 12 4l8 7.2" />
      <path d="M6 9.7V20h12V9.7" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

export function IconBank({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M3 10.5 12 5l9 5.5" />
      <path d="M4.5 10.5h15V19h-15z" />
      <path d="M8 10.5V19M12 10.5V19M16 10.5V19" />
      <path d="M3 19h18" />
    </svg>
  );
}

export function IconBriefcase({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M8 8V6.2C8 5 8.9 4 10.1 4h3.8C15.1 4 16 5 16 6.2V8" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function IconInfo({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCheck({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M5 12.5 9.8 17 19 6.5" />
    </svg>
  );
}

export function IconChevronRight({ size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M9 5.5 15.5 12 9 18.5" />
    </svg>
  );
}

export function IconArrowRight({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M4.5 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconCar({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M4 16v-3.2l2-4.3c.4-.9 1.3-1.5 2.3-1.5h7.4c1 0 1.9.6 2.3 1.5l2 4.3V16" />
      <rect x="2.5" y="16" width="19" height="3.4" rx="1.4" />
      <circle cx="7.2" cy="19.6" r="1.6" />
      <circle cx="16.8" cy="19.6" r="1.6" />
      <path d="M4 12.8h16" />
    </svg>
  );
}

export function IconGlobe({ size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

export function IconChevronDown({ size = 12, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M5.5 9 12 15.5 18.5 9" />
    </svg>
  );
}

// Replaces the header's old literal "🔔" emoji - the app's own design
// direction (the "Path" redesign) explicitly avoids emoji in the UI in
// favor of this same inline-stroke-SVG treatment used everywhere else
// (IconUsers, IconChevronDown, etc.), and a bare emoji glyph renders
// inconsistently (and, at header-icon size, illegibly) across platforms.
export function IconEye({ size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconBell({ size = 19, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4.2 1.3 5.8 2 6.5H4c.7-.7 2-2.3 2-6.5Z" />
      <path d="M9.7 19.5a2.4 2.4 0 0 0 4.6 0" />
    </svg>
  );
}

// The mountain-and-sun brand mark (splash badges, the header badge, and
// anywhere else a compact mark is useful). Redrawn with smooth, rounded
// peaks - matching a reference mark the user picked out - instead of the
// original sharp triangular silhouette. Same single-color treatment as
// everywhere else in the app: rendered in `currentColor`, so it's always
// whatever color the badge around it sets (white on the signature-orange
// badges used throughout).
export function IconMasarMark({ size = 40, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" {...rest}>
      <circle cx="35" cy="11" r="5" fill="currentColor" />
      <path
        d="M4 36
           C4 36 9 18 16 14
           C19 16 22 20 24 25
           C26 20 29 16.5 33 17
           C38 17.5 43 30 44 36
           Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Bottom navigation icons - plain line icons, matching the mockup's minimal
// nav style (no colorful emoji, which also don't render consistently across
// platforms - Windows in particular has no color flag/emoji font for some of
// the set used before).
export function IconNavHome({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M4 11.2 12 4l8 7.2" />
      <path d="M6 9.7V20h12V9.7" />
    </svg>
  );
}

export function IconClipboard({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="5" y="4.5" width="14" height="17" rx="2.2" />
      <path d="M9 4.5V3.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v.9" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4.5" />
    </svg>
  );
}

export function IconFolder({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M3.5 7.2c0-1 .8-1.7 1.7-1.7h4.2l1.8 2.1h7.6c1 0 1.7.8 1.7 1.7v9c0 1-.8 1.7-1.7 1.7H5.2c-1 0-1.7-.8-1.7-1.7Z" />
    </svg>
  );
}

export function IconUser({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.5 20c1.1-3.6 4-5.6 7.5-5.6s6.4 2 7.5 5.6" />
    </svg>
  );
}

export function IconSearch({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="M20 20l-4.6-4.6" />
    </svg>
  );
}

export function IconHeart({ size = 18, filled = false, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} fill={filled ? 'currentColor' : 'none'} {...rest}>
      <path d="M12 20.2C7 16.6 3.5 13.4 3.5 9.6 3.5 6.9 5.6 5 8.1 5c1.5 0 3 .8 3.9 2.2C12.9 5.8 14.4 5 15.9 5c2.5 0 4.6 1.9 4.6 4.6 0 3.8-3.5 7-8.5 10.6Z" />
    </svg>
  );
}

export function IconExternalLink({ size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M9 6H5.8C5 6 4 7 4 7.8v10.4C4 19 5 20 5.8 20h10.4c.8 0 1.8-1 1.8-1.8V15" />
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
    </svg>
  );
}

export function IconBook({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M4 5.2c0-.7.6-1.2 1.3-1.1 2 .3 4.7 1 6.7 2.4 2-1.4 4.7-2.1 6.7-2.4.7-.1 1.3.4 1.3 1.1v13c0 .6-.5 1.1-1.1 1.2-2 .2-4.9.9-6.9 2.4-2-1.5-4.9-2.2-6.9-2.4-.6-.1-1.1-.6-1.1-1.2Z" />
      <path d="M12 6.5V19" />
    </svg>
  );
}

export function IconDocument({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M7 3.5h7l4 4v13c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-16c0-.55.45-1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M8.5 13h7M8.5 16.3h7" />
    </svg>
  );
}

export function IconImage({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="3.2" y="4.5" width="17.6" height="15" rx="2.2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M3.6 16.5 8.5 12l3 2.8 3.4-3.8 5.5 5.5" />
    </svg>
  );
}

export function IconPin({ size = 15, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M12 21.5c4.5-4.8 7-8.4 7-11.8A7 7 0 0 0 5 9.7c0 3.4 2.5 7 7 11.8Z" />
      <circle cx="12" cy="9.7" r="2.4" />
    </svg>
  );
}

export function IconRing({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 12 15.8 8" />
    </svg>
  );
}

export function IconMail({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  );
}

export function IconShield({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M12 3 4.5 5.7v6c0 4.7 3.2 8.4 7.5 9.8 4.3-1.4 7.5-5.1 7.5-9.8v-6L12 3Z" />
      <path d="M9 12.2 11.3 14.5 15.5 9.8" />
    </svg>
  );
}

export function IconLock({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="5" y="11" width="14" height="9.5" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconUsers({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <circle cx="9" cy="8.2" r="3.2" />
      <path d="M3 20c.9-3.1 3.3-4.8 6-4.8s5.1 1.7 6 4.8" />
      <path d="M15.5 5.2c1.4.3 2.4 1.5 2.4 3s-1 2.7-2.4 3" />
      <path d="M17.5 15.4c2.1.4 3.6 1.9 4.2 4.6" />
    </svg>
  );
}

export function IconMap({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M9 4.5 4 6.3v13.2l5-1.8 6 1.8 5-1.8V4.5l-5 1.8-6-1.8Z" />
      <path d="M9 4.5v13.2M15 6.3v13.2" />
    </svg>
  );
}

export function IconNavigation({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M12 3 20 20l-8-4.5L4 20Z" />
    </svg>
  );
}

export function IconPlus({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// Profile photo: the camera/edit badge on the avatar (Profile.jsx).
export function IconCamera({ size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </svg>
  );
}

// Profile photo: "Remove photo" action in the avatar edit sheet.
export function IconTrash({ size = 16, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M4.5 7h15M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l.7 12a1.5 1.5 0 0 0 1.5 1.4h6.6a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
      <path d="M10.3 11v6M13.7 11v6" />
    </svg>
  );
}

// Generic close (X) - the avatar photo modal's dismiss button.
export function IconX({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export const NAV_ICON_MAP = {
  home: IconNavHome,
  checklist: IconClipboard,
  resources: IconFolder,
  profile: IconUser,
};

export const FEATURE_ICON_MAP = {
  admission: IconCap,
  visa: IconVisa,
  housing: IconHome,
  money: IconBank,
  travail: IconBriefcase,
  transport: IconCar,
  life: IconInfo,
};
