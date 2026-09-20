import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sections as sectionsApi, checklist as checklistApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useDestination, COUNTRIES } from '../i18n/DestinationContext.jsx';
import { useNationality, NATIONALITIES } from '../i18n/NationalityContext.jsx';
import { HOME_STATS, CAPITAL_CITY, DEST_ADJECTIVE, HERO_TEMPLATE } from '../i18n/homeContent.js';

const FEATURE_SLUGS = ['admission', 'visa', 'housing', 'money', 'travail', 'life'];
const FEATURE_ICONS = ['🎓', '🛂', '🏠', '🏦', '💼', 'ℹ️'];
const FEATURE_BG = ['var(--m-blue-bg)', 'var(--m-green-bg)', 'var(--m-orange-bg)', 'var(--m-purple-bg)', 'var(--m-pink-bg)', 'var(--m-blue-bg)'];
const FEATURE_FG = ['var(--m-blue)', 'var(--m-green)', 'var(--m-orange)', 'var(--m-purple)', 'var(--m-pink)', 'var(--m-blue)'];
const DEST_GRADIENTS = {
  es: 'linear-gradient(135deg,#E0A458,#B85C2E)',
  fr: 'linear-gradient(135deg,#3B6FA6,#16324A)',
  it: 'linear-gradient(135deg,#1FA971,#0B5C56)',
};

export default function Home() {
  const [sections, setSections] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const { lang } = useLanguage();
  const { country, setCountry } = useDestination();
  const { nationality, setNationality } = useNationality();
  const userName = localStorage.getItem('masar_user_name') || localStorage.getItem('masar_user_email');

  useEffect(() => {
    sectionsApi.all(country).then((res) => setSections(res.data)).catch(() => setSections([]));
  }, [country]);

  useEffect(() => {
    if (!localStorage.getItem('masar_access_token')) return;
    checklistApi.mine().then((res) => setChecklistItems(res.data)).catch(() => setChecklistItems([]));
  }, []);

  const city = CAPITAL_CITY[nationality]?.[lang] || CAPITAL_CITY.dz.en;
  const adjective = DEST_ADJECTIVE[country]?.[lang] || DEST_ADJECTIVE.es.en;
  const heroTitle = HERO_TEMPLATE[lang] ? HERO_TEMPLATE[lang](city, adjective) : HERO_TEMPLATE.en(city, adjective);
  const stats = HOME_STATS[country]?.[lang] || HOME_STATS.es.en;

  const findSlug = (slug) => sections.find((s) => s.slug === slug);
  const features = FEATURE_SLUGS.map((slug, i) => ({ section: findSlug(slug), icon: FEATURE_ICONS[i], bg: FEATURE_BG[i], fg: FEATURE_FG[i] }))
    .filter((f) => f.section);

  const done = checklistItems.filter((i) => i.done).length;
  const total = checklistItems.length;

  return (
    <div className="m-page">
      <div className="m-greeting-name">Hello{userName ? `, ${userName}` : ''} 👋</div>
      <div className="m-greeting-sub">Your journey to Europe starts here.</div>

      <div className="m-hero">
        <h2>{heroTitle}</h2>
        <p>Everything you need to know, in one place.</p>
        <div className="m-hero-btn">→</div>
      </div>

      <div className="m-flag-row">
        {NATIONALITIES.map((n) => (
          <button key={n.code} className={'m-flag-chip' + (n.code === nationality ? ' active' : '')} onClick={() => setNationality(n.code)}>
            <span className="circle">{n.flag}</span>
            <span className="label">{n.label}</span>
          </button>
        ))}
        <span className="m-flag-arrow">→</span>
        {COUNTRIES.map((c) => (
          <button key={c.code} className={'m-flag-chip' + (c.code === country ? ' active' : '')} onClick={() => setCountry(c.code)}>
            <span className="circle">{c.flag}</span>
            <span className="label">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="m-feature-grid">
        {stats.map((s, i) => (
          <div key={i} className="m-feature-card">
            <div className="m-feature-icon" style={{ background: FEATURE_BG[i % FEATURE_BG.length], color: FEATURE_FG[i % FEATURE_FG.length] }}>📊</div>
            <h3>{s.n}</h3>
            <p>{s.l}</p>
          </div>
        ))}
      </div>

      <Link to="/checklist" className="m-checklist-card">
        <div className="m-checklist-icon">✅</div>
        <div>
          <h3>My Checklist</h3>
          <p>Track your progress, don't miss anything.</p>
        </div>
        {total > 0 && (
          <div className="m-checklist-ring">
            <div className="frac">{done}/{total}</div>
            <div className="lbl">done</div>
          </div>
        )}
      </Link>

      <div className="m-section-title">Explore</div>
      <div className="m-section-sub">Everything for your move, organized by topic.</div>
      <div className="m-feature-grid">
        {features.map((f, i) => (
          <Link key={f.section.slug} to={`/section/${f.section.slug}`} className="m-feature-card">
            <div className="m-feature-icon" style={{ background: f.bg, color: f.fg }}>{f.icon}</div>
            <h3>{f.section.titleFr}</h3>
          </Link>
        ))}
      </div>

      <div className="m-section-title">Top destinations</div>
      <div className="m-section-sub">Discover the countries you can go to.</div>
      <div className="m-dest-scroll">
        {COUNTRIES.map((c) => (
          <button key={c.code} onClick={() => setCountry(c.code)} className="m-dest-card" style={{ background: DEST_GRADIENTS[c.code], border: 'none', cursor: 'pointer' }}>
            <span className="go">→</span>
            <span className="label">{c.flag} {c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
