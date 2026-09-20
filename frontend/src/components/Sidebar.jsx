import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { sections as sectionsApi, auth } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { pickSectionTitle } from '../i18n/pick.js';
import { LANGUAGES } from '../i18n/translations.js';
import { COUNTRIES, useDestination } from '../i18n/DestinationContext.jsx';
import { NATIONALITIES, useNationality } from '../i18n/NationalityContext.jsx';

export default function Sidebar({ open, onNavigate }) {
  const [sections, setSections] = useState([]);
  const { t, lang } = useLanguage();
  const { country, setCountry } = useDestination();
  const { nationality, setNationality } = useNationality();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('masar_user_email');
  const userName = localStorage.getItem('masar_user_name');

  useEffect(() => {
    sectionsApi.all(country).then((res) => setSections(res.data)).catch(() => setSections([]));
  }, [country]);

  const logout = async () => {
    await auth.logout();
    navigate('/');
    window.location.reload();
  };

  const handleNavClick = () => { if (onNavigate) onNavigate(); };

  return (
    <aside
      className={'masar-sidebar p-3' + (open ? ' open' : '')}
      style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column' }}
    >
      <div className="masar-brand">Masar</div>
      <div className="masar-brand-sub">{t('tagline')}</div>

      <button
        className="masar-lang-switch"
        onClick={() => navigate('/welcome')}
      >
        {LANGUAGES.find((l) => l.code === lang)?.flag} {LANGUAGES.find((l) => l.code === lang)?.label} <span style={{opacity:0.6}}>· change</span>
      </button>

      <div className="masar-nat-switch">
        {NATIONALITIES.map((n) => (
          <button
            key={n.code}
            className={'masar-dest-btn' + (n.code === nationality ? ' active' : '')}
            onClick={() => setNationality(n.code)}
          >
            {n.flag} {n.label}
          </button>
        ))}
      </div>

      <div className="masar-dest-switch">
        {COUNTRIES.map((c) => (
          <button
            key={c.code}
            className={'masar-dest-btn' + (c.code === country ? ' active' : '')}
            onClick={() => setCountry(c.code)}
          >
            {c.flag} {c.label}
          </button>
        ))}
      </div>

      {userEmail ? (
        <div style={{ fontSize: 12.5, opacity: 0.8, marginBottom: 16 }}>
          {t('signedInAs')} {userName || userEmail} ·{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{ color: '#EDE4D0' }}>
            {t('logout')}
          </a>
        </div>
      ) : (
        <div style={{ fontSize: 12.5, marginBottom: 16 }}>
          <NavLink to="/login" style={{ color: '#F3EDDD', fontWeight: 600 }}>{t('loginSignup')}</NavLink>
        </div>
      )}

      <nav className="d-flex flex-column gap-1" style={{ marginBottom: 20 }}>
        <NavLink to="/" className={({isActive}) => 'masar-nav-link' + (isActive ? ' active' : '')} onClick={handleNavClick} end>
          <span className="masar-nav-num">·</span> {t('startHere')}
        </NavLink>
        {sections.map((s, i) => (
          <NavLink
            key={s.slug}
            to={`/section/${s.slug}`}
            className={({isActive}) => 'masar-nav-link' + (isActive ? ' active' : '')}
            onClick={handleNavClick}
          >
            <span className="masar-nav-num">{String(i + 1).padStart(2, '0')}</span> {pickSectionTitle(s, lang)}
          </NavLink>
        ))}
        <NavLink to="/checklist" className={({isActive}) => 'masar-nav-link' + (isActive ? ' active' : '')} onClick={handleNavClick}>
          <span className="masar-nav-num">{String(sections.length + 1).padStart(2, '0')}</span> {t('myChecklist')}
        </NavLink>
      </nav>

      <div className="masar-sidebar-foot">
        Built from one Algerian student's own move to Spain for a master's degree. Rules change —
        always double-check with your consulate, university, or a lawyer before relying on this for
        legal steps.
      </div>
    </aside>
  );
}
