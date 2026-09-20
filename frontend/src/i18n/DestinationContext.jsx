import { createContext, useContext, useState } from 'react';

export const COUNTRIES = [
  { code: 'es', label: 'Espagne', flag: '🇪🇸' },
  { code: 'fr', label: 'France', flag: '🇫🇷' },
  { code: 'it', label: 'Italie', flag: '🇮🇹' },
];

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
