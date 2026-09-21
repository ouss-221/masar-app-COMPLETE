import { createContext, useContext, useState } from 'react';

// photo: a verified real photo for that destination (Unsplash, free license,
// no attribution required) - used as the background for hero/banner/card
// imagery across Home, Resources and Section. Query params are appended by
// the component that renders it (size/crop differs per placement).
export const COUNTRIES = [
  { code: 'es', label: 'Espagne', flag: '🇪🇸', photo: 'https://images.unsplash.com/photo-1583422409516-2895a77efded', photoCredit: 'Barcelona, Spain' },
  { code: 'fr', label: 'France', flag: '🇫🇷', photo: 'https://images.unsplash.com/photo-1760281854309-3c5ea36d5d83', photoCredit: 'Paris, France' },
  { code: 'it', label: 'Italie', flag: '🇮🇹', photo: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294', photoCredit: 'Rome, Italy' },
];

export function destPhotoUrl(photo, { w = 1200, q = 82 } = {}) {
  return `${photo}?auto=format&fit=crop&w=${w}&q=${q}`;
}

// Ready-to-spread inline style for any element that wants a destination photo
// as its background: a solid fallback color, a dark gradient overlaid over the
// photo for text legibility, cover/center sizing. Used by the Home hero and
// destination cards, and the Resources/Section banners.
export function destPhotoBackground(countryCode, opts) {
  const c = COUNTRIES.find((x) => x.code === countryCode) || COUNTRIES[0];
  const fallback = { es: '#B85C2E', fr: '#16324A', it: '#0B5C56' }[countryCode] || '#16324A';
  return {
    backgroundColor: fallback,
    backgroundImage: `linear-gradient(180deg, rgba(8,30,28,0.15), rgba(8,30,28,0.72)), url(${destPhotoUrl(c.photo, opts)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

const DestinationContext = createContext(null);

export function DestinationProvider({ children }) {
  const [country, setCountryState] = useState(() => localStorage.getItem('masar_country') || 'es');

  const setCountry = (code) => {
    localStorage.setItem('masar_country', code);
    setCountryState(code);
  };

  return (
    <DestinationContext.Provider value={{ country, setCountry }}>
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  const ctx = useContext(DestinationContext);
  if (!ctx) throw new Error('useDestination must be used within DestinationProvider');
  return ctx;
}
