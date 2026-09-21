import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sections as sectionsApi, checklist as checklistApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useDestination, COUNTRIES, destPhotoBackground } from '../i18n/DestinationContext.jsx';
import { useNationality, NATIONALITIES } from '../i18n/NationalityContext.jsx';
import { pickSectionTitle } from '../i18n/pick.js';
import { FEATURE_ICON_MAP, IconCheck, IconChevronRight, IconArrowRight } from '../components/Icons.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';

// Matches the app mockup's hero copy exactly (a fixed tagline, not a
// personalized one) - kept local since nothing else reuses it.
const HERO_TEXT = {
  fr: { title: 'Étudier • Bouger • Construire votre avenir', sub: 'Tout ce que vous devez savoir, au même endroit.' },
  en: { title: 'Study • Move • Build your future', sub: 'Everything you need to know in one place.' },
  ar: { title: 'ادرس • انتقل • ابنِ مستقبلك', sub: 'كل ما تحتاج معرفته في مكان واحد.' },
};

// The 6 featured cards on Home are a curated highlight strip, not the full
// resource list (that's the Resources tab, which lists every section
// including "travail"/student work). Slugs map to real backend sections;
// title/desc here are fixed app-level card copy, independent of whatever
// title the backend content itself uses.
const FEATURE_SLUGS = ['admission', 'visa', 'housing', 'money', 'transport', 'life'];
const FEATURE_BG = ['var(--m-blue-bg)', 'var(--m-green-bg)', 'var(--m-orange-bg)', 'var(--m-purple-bg)', 'var(--m-blue-bg)', 'var(--m-green-bg)'];
const FEATURE_FG = ['var(--m-blue)', 'var(--m-green)', 'var(--m-orange)', 'var(--m-purple)', 'var(--m-blue)', 'var(--m-green)'];
const FEATURE_TITLE = {
  admission: 'Universities',
  visa: 'Visa & Residence',
  housing: 'Housing',
  money: 'Banking',
  transport: 'Transport',
  life: 'Useful Info',
};
const FEATURE_DESC = {
  admission: 'Find your perfect university',
  visa: 'Documents, permits, processes',
  housing: 'Find a place to live',
  money: 'Open an account, manage your money',
  transport: 'Get around easily',
  life: 'Life, culture, health and more',
};

function ChecklistArt({ className }) {
  return (
    <svg className={className} viewBox="0 0 160 90" aria-hidden="true">
      <path d="M14 68C44 30 96 78 146 22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" opacity="0.7" />
      <circle cx="14" cy="68" r="6" fill="currentColor" opacity="0.55" />
      <circle cx="146" cy="22" r="6" fill="currentColor" opacity="0.85" />
      <path d="M146 12a10 10 0 0 1 0 20 10 12 0 0 1-10-16c1-3 5-4 10-4Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export default function Home() {
  const [sections, setSections] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const { lang } = useLanguage();
  const { country, setCountry } = useDestination();
  const { nationality, setNationality } = useNationality();
  const userName = localStorage.getItem('masar_user_name') || localStorage.getItem('masar_user_email');

  useEffect(() => {
    sectionsApi.all(country)
      .then((res) => setSections(res.data))
      .catch((err) => {
        console.error('Failed to load sections for', country, err);
        setSections([]);
      });
  }, [country]);

  useEffect(() => {
    if (!localStorage.getItem('masar_access_token')) return;
    checklistApi.mine().then((res) => setChecklistItems(res.data)).catch(() => setChecklistItems([]));
  }, []);

  const hero = HERO_TEXT[lang] || HERO_TEXT.en;

  const findSlug = (slug) => sections.find((s) => s.slug === slug);
  const features = FEATURE_SLUGS.map((slug, i) => ({ slug, section: findSlug(slug), icon: FEATURE_ICON_MAP[slug], bg: FEATURE_BG[i], fg: FEATURE_FG[i] }))
    .filter((f) => f.section);

  return (
    <div className="m-page">
      <div className="m-greeting-name">Hello{userName ? `, ${userName}` : ''} 👋</div>
      <div className="m-greeting-sub">Your journey to Europe starts here.</div>

      <div className="m-hero" style={destPhotoBackground(country, { w: 1300, q: 82 })}>
        <span className="m-hero-badge">Featured</span>
        <h2>{hero.title}</h2>
        <p>{hero.sub}</p>
        <div className="m-hero-btn"><IconArrowRight size={16} /></div>
      </div>

      <div className="m-flag-row">
        {NATIONALITIES.map((n) => {
          const Flag = FLAG_MAP[n.code];
          return (
            <button key={n.code} className={'m-flag-chip' + (n.code === nationality ? ' active' : '')} onClick={() => setNationality(n.code)}>
              <span className="circle"><Flag size={26} /></span>
              <span className="label">{n.label}</span>
            </button>
          );
        })}
        <span className="m-flag-arrow">→</span>
        {COUNTRIES.map((c) => {
          const Flag = FLAG_MAP[c.code];
          return (
          <button key={c.code} className={'m-flag-chip' + (c.code === country ? ' active' : '')} onClick={() => setCountry(c.code)}>
            <span className="circle"><Flag size={26} /></span>
            <span className="label">{c.label}</span>
          </button>
          );
        })}
      </div>

      <div className="m-feature-grid">
        {features.map((f) => {
          const Icon = f.icon;
          const to = f.slug === 'admission' ? '/universities' : `/section/${f.section.slug}`;
          return (
            <Link key={f.slug} to={to} className="m-feature-card">
              <div className="m-feature-icon" style={{ background: f.bg, color: f.fg }}>
                <Icon size={18} />
              </div>
              <div className="m-feature-row">
                <h3>{FEATURE_TITLE[f.slug] || pickSectionTitle(f.section, lang)}</h3>
                <span className="chev"><IconChevronRight size={14} /></span>
              </div>
              <p>{FEATURE_DESC[f.slug]}</p>
            </Link>
          );
        })}
      </div>

      <Link to="/checklist" className="m-checklist-card">
        <div className="m-checklist-icon"><IconCheck size={18} /></div>
        <div>
          <h3>My Checklist</h3>
          <p>Track your progress, don't miss anything.</p>
        </div>
        <span className="m-checklist-chev"><IconChevronRight /></span>
        <ChecklistArt className="m-checklist-art" />
      </Link>

      <div className="m-section-head">
        <div>
          <div className="m-section-title">Top destinations</div>
          <div className="m-section-sub">Discover the countries you can go to.</div>
        </div>
        <span className="m-see-all">See all <IconChevronRight size={14} /></span>
      </div>
      <div className="m-dest-scroll">
        {COUNTRIES.map((c) => (
          <button key={c.code} onClick={() => setCountry(c.code)} className="m-dest-card" style={destPhotoBackground(c.code, { w: 700, q: 80 })}>
            <span className="go"><IconArrowRight size={13} /></span>
            <span className="pill"><span className="flag">{c.flag}</span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
