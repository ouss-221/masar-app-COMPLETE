import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sections as sectionsApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { pickSectionTitle } from '../i18n/pick.js';
import { useDestination, COUNTRIES } from '../i18n/DestinationContext.jsx';

const ICONS = ['🎓', '🛂', '🏠', '🏦', '📖', '💼', '📅', '🌍', '❓', '💶', '📋', '🏛️', '✈️'];
const ICON_BG = ['var(--m-blue-bg)', 'var(--m-green-bg)', 'var(--m-orange-bg)', 'var(--m-purple-bg)', 'var(--m-pink-bg)'];
const ICON_FG = ['var(--m-blue)', 'var(--m-green)', 'var(--m-orange)', 'var(--m-purple)', 'var(--m-pink)'];

export default function Resources() {
  const [sections, setSections] = useState([]);
  const { lang } = useLanguage();
  const { country, setCountry } = useDestination();

  useEffect(() => {
    sectionsApi.all(country).then((res) => setSections(res.data)).catch(() => setSections([]));
  }, [country]);

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>Resources</div>
      <div className="m-section-sub">Useful links, documents and guidance for every step.</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {COUNTRIES.map((c) => (
          <button
            key={c.code}
            onClick={() => setCountry(c.code)}
            className="masar-dest-btn"
            style={{
              background: c.code === country ? 'var(--m-teal)' : 'var(--m-surface)',
              color: c.code === country ? '#fff' : 'var(--m-navy)',
              border: '1px solid var(--m-line)', borderRadius: 999, padding: '6px 14px', fontSize: 13,
            }}
          >
            {c.flag} {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sections.map((s, i) => (
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
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
            }}>
              {ICONS[i % ICONS.length]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{pickSectionTitle(s, lang)}</div>
            </div>
            <div style={{ opacity: 0.35 }}>›</div>
          </Link>
        ))}
        {sections.length === 0 && <p style={{ opacity: 0.6, fontSize: 14 }}>Loading…</p>}
      </div>
    </div>
  );
}
