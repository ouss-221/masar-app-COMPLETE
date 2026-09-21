import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sections as sectionsApi, sponsors as sponsorsApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { pickSectionTitle, pickSectionContent, pickNote } from '../i18n/pick.js';
import { useDestination, COUNTRIES, destPhotoBackground } from '../i18n/DestinationContext.jsx';
import { useNationality, NATIONALITIES } from '../i18n/NationalityContext.jsx';
import TabbedHtmlContent from '../components/TabbedHtmlContent.jsx';

const OVERVIEW_LABEL = { fr: 'Aperçu', en: 'Overview', ar: 'نظرة عامة', es: 'Resumen' };

export default function Section() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const { country } = useDestination();
  const { nationality } = useNationality();
  const [section, setSection] = useState(null);
  const [sponsorList, setSponsorList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([sectionsApi.bySlug(slug, country), sponsorsApi.forSection(slug)])
      .then(([sectionRes, sponsorRes]) => {
        setSection(sectionRes.data);
        setSponsorList(sponsorRes.data);
      })
      .catch(() => setSection(null))
      .finally(() => setLoading(false));
  }, [slug, country]);

  if (loading) return <p className="text-muted">Loading…</p>;
  if (!section) return <p className="text-muted">Section not found.</p>;

  const countryLabel = COUNTRIES.find((c) => c.code === country)?.label || '';

  return (
    <div>
      <div className="m-banner" style={destPhotoBackground(country, { w: 1300, q: 82 })}>
        <div className="eyebrow">{countryLabel} · Section {String(section.orderIndex).padStart(2, '0')}</div>
        <h1 className="title">{pickSectionTitle(section, lang)}</h1>
      </div>

      <TabbedHtmlContent html={pickSectionContent(section, lang)} overviewLabel={OVERVIEW_LABEL[lang] || OVERVIEW_LABEL.en} />

      {pickNote(section, nationality) && (
        <div className="masar-nationality-note">
          <div className="label">
            Spécifique {NATIONALITIES.find((n) => n.code === nationality)?.flag} {NATIONALITIES.find((n) => n.code === nationality)?.label}
          </div>
          <div className="body">{pickNote(section, nationality)}</div>
        </div>
      )}

      {sponsorList.map((sp) => (
        <div key={sp.id} className="masar-sponsor-card p-3 rounded-3 mt-4">
          <div className="masar-sponsor-label">{sp.label}</div>
          <div className="fw-semibold">{sp.name}</div>
          <p className="mb-2 small">{sp.description}</p>
          <a href={sp.ctaUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark">
            Get in touch
          </a>
        </div>
      ))}
    </div>
  );
}
