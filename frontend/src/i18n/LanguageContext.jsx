import { createContext, useContext, useEffect, useState } from 'react';
import { translations, RTL_LANGUAGES } from './translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('masar_lang') || null);

  useEffect(() => {
    if (!lang) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (code) => {
    localStorage.setItem('masar_lang', code);
    setLangState(code);
  };

  const t = (key) => (translations[lang] && translations[lang][key]) || translations.fr[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
