import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LANGUAGES } from '../i18n/translations.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { IconMasarMark, IconGlobe, IconChevronDown, IconUsers } from '../components/Icons.jsx';

export default function Header() {
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeLang = lang || 'en';

  return (
    <div className="m-header">
      <Link to="/" className="m-brand" style={{ textDecoration: 'none' }}>
        <div className="m-brand-mark"><IconMasarMark size={28} /></div>
        <div>
          <div className="m-brand-word">MASAR</div>
          <div className="m-brand-ar">مسار</div>
        </div>
      </Link>

      <div className="m-header-icons">
        <div className="m-header-langpill" onClick={() => setMenuOpen((o) => !o)} role="button" tabIndex={0}>
          <IconGlobe size={13} />
          <span>{activeLang.toUpperCase()}</span>
          <IconChevronDown size={11} />
          {menuOpen && (
            <div className="m-header-langmenu" onClick={(e) => e.stopPropagation()}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={'m-header-langopt' + (l.code === activeLang ? ' active' : '')}
                  onClick={() => { setLang(l.code); setMenuOpen(false); }}
                >
                  <span>{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link to="/people" className="m-icon-btn" aria-label="Find students">
          <IconUsers size={19} />
        </Link>
        <Link to="/profile" className="m-icon-btn" aria-label="Notifications">🔔</Link>
      </div>
    </div>
  );
}
