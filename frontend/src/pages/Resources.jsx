import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sections as sectionsApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { pickSectionTitle } from '../i18n/pick.js';
import { useDestination, COUNTRIES, destPhotoBackground } from '../i18n/DestinationContext.jsx';
import { FEATURE_ICON_MAP, IconInfo, IconGlobe, IconDocument, IconBook, IconExternalLink, IconChevronRight } from '../components/Icons.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';
import { RESOURCE_LINKS, RESOURCE_CATEGORY_META } from '../data/resourceLinks.js';

const CATEGORY_ICON = { official: IconGlobe, documents: IconDocument, tools: IconBook, guides: IconInfo };

const TEXT = {
  fr: { title: 'Resources', sub: 'Liens utiles, documents et guides pour chaque étape.', allSections: 'Toutes les sections du guide' },
  en: { title: 'Resources', sub: 'Useful links, documents and guidance for every step.', allSections: 'All guide sections' },
  ar: { title: 'الموارد', sub: 'روابط مفيدة ووثائق وإرشادات لكل خطوة.', allSections: 'كل أقسام الدليل' },
};

const ICON_BG = ['var(--m-blue-bg)', 'var(--m-green-bg)', 'var(--m-orange-bg)', 'var(--m-purple-bg)', 'var(--m-pink-bg)'];
const ICON_FG = ['var(--m-blue)', 'var(--m-green)', 'var(--m-orange)', 'var(--m-purple)', 'var(--m-pink)'];

export default function Resources() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const { lang } = useLanguage();
  const { country, setCountry } = useDestination();
  const countryLabel = COUNTRIES.find((c) => c.code === country)?.label || '';
  const t = TEXT[lang] || TEXT.en;
  const links = RESOURCE_LINKS[country] || {};

  const load = () => {
    setLoading(true);
    setError(false);
    sectionsApi.all(country)
      .then((res) => setSections(res.data))
      .catch((err) => {
        console.error('Failed to load resources for', country, err);
        setSections([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [country]);

  return (
    <div className="m-page">
      <div className="m-banner" style={destPhotoBackground(country, { w: 1300, q: 82 })}>
        <div className="eyebrow">{countryLabel}</div>
        <h1 className="title">{t.title}</h1>
      </div>
      <div className="m-section-sub" style={{ marginTop: -8 }}>{t.sub}</div>

      <div style={{ display: 'flex', gap: 8, margin: '14px 0 18px', flexWrap: 'wrap' }}>
        {COUNTRIES.map((c) => {
          const Flag = FLAG_MAP[c.code];
          return (
            <button
              key={c.code}
              onClick={() => setCountry(c.code)}
              className="masar-dest-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: c.code === country ? 'var(--m-teal)' : 'var(--m-surface)',
                color: c.code === country ? '#fff' : 'var(--m-navy)',
                border: '1px solid var(--m-line)', borderRadius: 999, padding: '6px 14px', fontSize: 13,
              }}
            >
              <Flag size={16} /> {c.label}
            </button>
          );
        })}
      </div>

      <div className="m-res-cat-grid">
        {RESOURCE_CATEGORY_META.map((cat) => {
          const Icon = CATEGORY_ICON[cat.key];
          const isOpen = openCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              className={'m-res-cat-card' + (isOpen ? ' active' : '')}
              onClick={() => setOpenCategory(isOpen ? null : cat.key)}
            >
              <div className="m-res-cat-icon" style={{ background: cat.bg, color: cat.fg }}><Icon size={18} /></div>
              <div className="m-res-cat-label">{cat.label[lang] || cat.label.en}</div>
            </button>
          );
        })}
      </div>

      {openCategory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '4px 0 20px' }}>
          {(links[openCategory] || []).map((item) => {
            const label = item.label[lang] || item.label.en;
            const content = (
              <>
                <span style={{ flex: 1 }}>{label}</span>
                {item.external ? <IconExternalLink size={15} /> : <IconChevronRight size={15} />}
              </>
            );
            return item.external ? (
              <a key={item.url + label} href={item.url} target="_blank" rel="noreferrer" className="m-res-link-row">{content}</a>
            ) : (
              <Link key={item.url + label} to={item.url} className="m-res-link-row">{content}</Link>
            );
          })}
        </div>
      )}

      <div className="m-section-title" style={{ fontSize: 14, marginBottom: 10 }}>{t.allSections}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sections.map((s, i) => {
          const Icon = FEATURE_ICON_MAP[s.slug] || IconInfo;
          return (
            <Link
              key={s.slug}
              to={`/section/${s.slug}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, background: 'var(--m-surface)',
                borderRadius: 14, padding: '14px 16px', textDecoration: 'none', color: 'inherit',
                boxShadow: 'var(--m-shadow)',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: ICON_BG[i % ICON_BG.length], color: ICON_FG[i % ICON_FG.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{pickSectionTitle(s, lang)}</div>
              </div>
              <div style={{ opacity: 0.35 }}>›</div>
            </Link>
          );
        })}
        {loading && <p style={{ opacity: 0.6, fontSize: 14 }}>Loading…</p>}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 10 }}>
              Couldn't reach the server. Check that the backend is running, then try again.
            </p>
            <button type="button" className="masar-dest-btn" onClick={load} style={{
              border: '1px solid var(--m-line)', borderRadius: 999, padding: '6px 16px', fontSize: 13, background: 'var(--m-surface)',
            }}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && sections.length === 0 && (
          <p style={{ opacity: 0.6, fontSize: 14 }}>No resources found for this destination yet.</p>
        )}
      </div>
    </div>
  );
}
