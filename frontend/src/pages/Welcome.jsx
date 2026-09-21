import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../i18n/translations.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useNationality, NATIONALITIES } from '../i18n/NationalityContext.jsx';
import { useDestination, COUNTRIES } from '../i18n/DestinationContext.jsx';
import { IconArrowRight, IconGlobe, IconChevronDown, IconMasarMark } from '../components/Icons.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';

// A free, real Unsplash photo (not Unsplash+): a traveler with a backpack
// overlooking a city and water - the same "about to explore" feeling as the
// mockup's hero shot.
const SPLASH_PHOTO = 'https://images.unsplash.com/photo-1766704094335-b7f8e6e7930f';

// Chrome-only strings for this one screen - kept local instead of in the
// shared translations.js since nothing else reuses them.
const SPLASH_TEXT = {
  fr: {
    tagline1: "De l'Afrique du Nord vers l'Europe",
    tagline2: 'Votre voyage. Notre accompagnement.',
    start: 'Commencer',
    already: 'Vous avez déjà un compte ?',
    login: 'Connexion',
  },
  en: {
    tagline1: 'From North Africa to Europe',
    tagline2: 'Your journey. Our support.',
    start: 'Get Started',
    already: 'Already have an account?',
    login: 'Log in',
  },
  ar: {
    tagline1: 'من شمال أفريقيا إلى أوروبا',
    tagline2: 'رحلتك. دعمنا لك.',
    start: 'ابدأ الآن',
    already: 'هل لديك حساب بالفعل؟',
    login: 'تسجيل الدخول',
  },
};

export default function Welcome() {
  const { lang, setLang } = useLanguage();
  const { nationality, setNationality } = useNationality();
  const { country, setCountry } = useDestination();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Show a sensible default (English) in the pill and in the copy before the
  // visitor has actively chosen anything - but don't commit that default to
  // storage/state until they either pick a language or press Get Started, so
  // a fresh visit still lands on this screen every time.
  const activeLang = lang || 'en';
  const activeLangMeta = LANGUAGES.find((l) => l.code === activeLang) || LANGUAGES[1];
  const text = SPLASH_TEXT[activeLang] || SPLASH_TEXT.en;

  const chooseLang = (code) => {
    setLang(code);
    setMenuOpen(false);
  };

  const enterApp = (path = '/') => {
    if (!lang) setLang(activeLang);
    setMenuOpen(false);
    navigate(path, { replace: true });
  };

  return (
    <div
      className="m-splash"
      dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        backgroundImage:
          `linear-gradient(180deg, rgba(10,32,46,0.18) 0%, rgba(8,22,34,0.42) 55%, rgba(6,14,22,0.9) 100%), ` +
          `url(${SPLASH_PHOTO}?auto=format&fit=crop&w=1600&q=85)`,
      }}
    >
      <div className="m-splash-top">
        <div className="m-splash-langpill" onClick={() => setMenuOpen((o) => !o)} role="button" tabIndex={0}>
          <IconGlobe size={14} />
          <span>{activeLangMeta.code.toUpperCase()}</span>
          <IconChevronDown size={12} />
          {menuOpen && (
            <div className="m-splash-langmenu" onClick={(e) => e.stopPropagation()}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={'m-splash-langopt' + (l.code === activeLang ? ' active' : '')}
                  onClick={() => chooseLang(l.code)}
                >
                  <span>{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="m-splash-body">
        <div className="m-splash-logo"><IconMasarMark size={44} /></div>
        <div className="m-splash-word">MASAR</div>
        <div className="m-splash-ar">مسار</div>
        <div className="m-splash-tag1">{text.tagline1}</div>
        <div className="m-splash-tag2">{text.tagline2}</div>

        <div className="m-splash-flags">
          <div className="m-splash-flag-row">
            {NATIONALITIES.map((n) => {
              const Flag = FLAG_MAP[n.code];
              return (
                <button
                  key={n.code}
                  type="button"
                  className={'m-splash-avatar' + (n.code === nationality ? ' active' : '')}
                  onClick={() => setNationality(n.code)}
                >
                  <span className="m-splash-avatar-circle"><Flag size={44} /></span>
                  <span className="m-splash-avatar-label">{n.label}</span>
                </button>
              );
            })}
          </div>

          <div className="m-splash-flag-divider">
            <span className="line" />
            <span className="arrow"><IconArrowRight size={14} /></span>
            <span className="line" />
          </div>

          <div className="m-splash-flag-row">
            {COUNTRIES.map((c) => {
              const Flag = FLAG_MAP[c.code];
              return (
                <button
                  key={c.code}
                  type="button"
                  className={'m-splash-avatar' + (c.code === country ? ' active' : '')}
                  onClick={() => setCountry(c.code)}
                >
                  <span className="m-splash-avatar-circle"><Flag size={44} /></span>
                  <span className="m-splash-avatar-label">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button type="button" className="m-splash-cta" onClick={() => enterApp('/')}>
          {text.start} <IconArrowRight size={16} />
        </button>
        <div className="m-splash-login">
          {text.already}{' '}
          <button type="button" className="linklike" onClick={() => enterApp('/login')}>{text.login}</button>
        </div>
      </div>
    </div>
  );
}
