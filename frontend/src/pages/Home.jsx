import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sections as sectionsApi, checklist as checklistApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useDestination, COUNTRIES } from '../i18n/DestinationContext.jsx';
import { pickSectionTitle } from '../i18n/pick.js';
import { FEATURE_ICON_MAP, IconCheck, IconChevronRight, IconArrowRight } from '../components/Icons.jsx';

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

// Solid per-destination gradients - matches the "Path" design concept's
// bold-color card treatment (Home hero + destination cards use these
// instead of photos, so the app's signature color system is what students
// actually see, not stock photography).
const DEST_GRADIENT = {
  es: 'linear-gradient(165deg,#FF6A45,var(--m-teal-deep))',
  fr: 'linear-gradient(165deg,#5A4AA8,var(--m-dusk))',
  it: 'linear-gradient(165deg,#E8A33D,#8A5A12)',
};

export default function Home() {
  const [sections, setSections] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const { lang } = useLanguage();
  const { country } = useDestination();
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
      <div className="m-greeting-sub">Your path to <em className="m-em">Europe</em> starts here.</div>

      <div className="m-hero">
        <span className="m-hero-badge">Featured</span>
        <h2>{hero.title}</h2>
        <p>{hero.sub}</p>
        <div className="m-hero-btn"><IconArrowRight size={16} /></div>
      </div>

      <Link to="/community" className="m-community-teaser">
        <span className="avatars">
          <span style={{ background: 'var(--m-teal)' }}>A</span>
          <span style={{ background: 'var(--m-orange)' }}>M</span>
          <span style={{ background: 'var(--m-blue)' }}>S</span>
          <span style={{ background: 'var(--m-green)' }}>L</span>
        </span>
        <span className="text">
          <strong>Open to every student</strong>
          <span>From anywhere, heading anywhere — see who's around.</span>
        </span>
        <IconChevronRight size={14} />
      </Link>

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
          <p>Don't miss a step.</p>
        </div>
        <span className="m-checklist-chev"><IconChevronRight /></span>
      </Link>

      <div className="m-section-head">
        <div>
          <div className="m-section-title">Top destinations</div>
          <div className="m-section-sub">Discover the countries you can go to.</div>
        </div>
        <span className="m-see-all">See all <IconChevronRight size={14} /></span>
      </div>
      <div className="m-dest-scroll">
        {/* Display-only, like the design concept's cards - your destination is
            set once during onboarding (or changed later from Profile), so
            tapping here doesn't silently switch it. */}
        {COUNTRIES.map((c) => (
          <div key={c.code} className="m-dest-card" style={{ background: DEST_GRADIENT[c.code] || DEST_GRADIENT.es }}>
            <span className="go"><IconArrowRight size={13} /></span>
            <span className="pill"><span className="flag">{c.flag}</span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
