import { createContext, useContext, useState } from 'react';

export const NATIONALITIES = [
  { code: 'dz', label: 'Algérie', flag: '🇩🇿' },
  { code: 'ma', label: 'Maroc', flag: '🇲🇦' },
  { code: 'tn', label: 'Tunisie', flag: '🇹🇳' },
];

const NationalityContext = createContext(null);

export function NationalityProvider({ children }) {
  const [nationality, setNationalityState] = useState(() => localStorage.getItem('masar_nationality') || 'dz');

  const setNationality = (code) => {
    localStorage.setItem('masar_nationality', code);
    setNationalityState(code);
  };

  return (
    <NationalityContext.Provider value={{ nationality, setNationality }}>
      {children}
    </NationalityContext.Provider>
  );
}

export function useNationality() {
  const ctx = useContext(NationalityContext);
  if (!ctx) throw new Error('useNationality must be used within NationalityProvider');
  return ctx;
}
