import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { universitiesApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useDestination, destPhotoBackground } from '../i18n/DestinationContext.jsx';
import { pickUniDescription, pickUniFields, pickUniTuitionNote } from '../i18n/pick.js';
import { IconHeart, IconExternalLink, IconCap, IconBook, IconDocument, IconImage, IconPin } from '../components/Icons.jsx';
import { isFavorite, toggleFavorite } from '../utils/favorites.js';

const TEXT = {
  fr: {
    overview: 'Aperçu', programs: 'Programmes', admission: 'Admission', gallery: 'Galerie',
    founded: 'Fondée en', type: 'Type', publicUni: 'Université publique', tuition: 'Frais de scolarité (approx./an)',
    fields: 'Domaines', visit: 'Visiter le site officiel', save: 'Ajouter aux favoris', saved: 'Dans vos favoris',
    degreeLevels: 'Niveaux de diplôme proposés', bachelor: "Licence / Bachelor", master: 'Master', phd: 'Doctorat',
    admissionText: "Chaque université gère ses propres admissions internationales. Consultez le site officiel ci-dessus pour les conditions exactes, les délais et les documents demandés selon votre pays.",
    portalNote: 'Portail national de candidature pour ce pays :',
    notFound: 'Université introuvable.', cityView: 'Vue générale de',
    tuitionVaries: 'Variable — voir le site',
    photoCredit: 'Photo :', noCampusPhoto: "Aucune photo vérifiée du campus n'a pu être trouvée pour cette université — voici une photo de la ville.",
  },
  en: {
    overview: 'Overview', programs: 'Programs', admission: 'Admission', gallery: 'Gallery',
    founded: 'Founded in', type: 'Type', publicUni: 'Public university', tuition: 'Tuition (approx./year)',
    fields: 'Fields', visit: 'Visit official website', save: 'Add to favorites', saved: 'Saved to favorites',
    degreeLevels: 'Degree levels offered', bachelor: "Bachelor's", master: "Master's", phd: 'PhD / Doctorate',
    admissionText: "Each university runs its own international admissions. Check the official website above for exact requirements, deadlines and documents for your country.",
    portalNote: 'National application portal for this country:',
    notFound: 'University not found.', cityView: 'General view of',
    tuitionVaries: 'Varies — see website',
    photoCredit: 'Photo:', noCampusPhoto: 'No verified campus photo could be found for this university — here is a photo of the city instead.',
  },
  ar: {
    overview: 'نظرة عامة', programs: 'البرامج', admission: 'القبول', gallery: 'معرض الصور',
    founded: 'تأسست سنة', type: 'النوع', publicUni: 'جامعة عمومية', tuition: 'الرسوم الدراسية (تقريبًا/سنويًا)',
    fields: 'المجالات', visit: 'زيارة الموقع الرسمي', save: 'إضافة إلى المفضلة', saved: 'في المفضلة',
    degreeLevels: 'مستويات الشهادات المتاحة', bachelor: 'الإجازة / البكالوريوس', master: 'الماستر', phd: 'الدكتوراه',
    admissionText: "تدير كل جامعة عملية القبول الدولي الخاصة بها. راجع الموقع الرسمي أعلاه للاطلاع على الشروط الدقيقة والمواعيد والوثائق المطلوبة حسب بلدك.",
    portalNote: 'بوابة الترشح الوطنية لهذا البلد:',
    notFound: 'الجامعة غير موجودة.', cityView: 'منظر عام لمدينة',
    tuitionVaries: 'متغيرة — راجع الموقع',
    photoCredit: 'الصورة:', noCampusPhoto: 'لم نتمكن من العثور على صورة موثقة للحرم الجامعي لهذه الجامعة — إليك صورة للمدينة بدلاً من ذلك.',
  },
};

const PORTALS = {
  es: { label: 'UNEDasiss', url: 'https://www.uned.es/universidad/inicio/en/estudios/masteres/informacion-general/acceso-titulados-extranjeros.html' },
  fr: { label: 'Études en France (Campus France)', url: 'https://www.campusfrance.org/en' },
  it: { label: 'Universitaly', url: 'https://www.universitaly.it/it/first-steps' },
};

// A real photo (campus or city, from Wikimedia Commons / Unsplash / Pexels -
// see the project's gallery-photos research notes) as a cover background
// with a dark gradient for text legibility, matching destPhotoBackground's
// look. Kept separate from destPhotoBackground because these URLs come from
// several different hosts, not all of which support the same resize query
// params, so the raw URL is used as-is rather than appending w/q params.
function photoBackground(url, fallbackColor) {
  return {
    backgroundColor: fallbackColor,
    backgroundImage: `linear-gradient(180deg, rgba(8,30,28,0.15), rgba(8,30,28,0.72)), url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

export default function UniversityDetail() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const { country } = useDestination();
  const [u, setU] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [fav, setFav] = useState(false);
  const t = TEXT[lang] || TEXT.en;

  useEffect(() => {
    setLoading(true);
    universitiesApi.bySlug(slug)
      .then((res) => { setU(res.data); setFav(isFavorite(res.data.slug)); })
      .catch(() => setU(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="m-page"><p style={{ opacity: 0.6 }}>Loading…</p></div>;
  if (!u) return <div className="m-page"><p style={{ opacity: 0.6 }}>{t.notFound}</p></div>;

  const portal = PORTALS[u.country];
  const fieldsList = (pickUniFields(u, lang) || '').split(',').map((f) => f.trim()).filter(Boolean);
  const fallbackColor = { es: '#B85C2E', fr: '#16324A', it: '#0B5C56' }[u.country] || '#16324A';
  // Prefer the university's own real campus photo for the banner; fall back
  // to the real city photo, then to the generic per-country stock photo only
  // if neither was found for this institution.
  const bannerPhotoUrl = u.campusPhotoUrl || u.cityPhotoUrl;

  const doFav = () => {
    toggleFavorite(u.slug);
    setFav((f) => !f);
  };

  return (
    <div className="m-page">
      <div className="m-banner m-uni-banner" style={bannerPhotoUrl ? photoBackground(bannerPhotoUrl, fallbackColor) : destPhotoBackground(u.country, { w: 1300, q: 82 })}>
        <button type="button" className="m-uni-detail-fav" onClick={doFav} aria-label="favorite">
          <IconHeart size={19} filled={fav} />
        </button>
        <div className="eyebrow"><IconPin size={12} /> {u.city}</div>
        <h1 className="title">{u.name}</h1>
      </div>

      <div className="m-uni-stat-grid">
        <div className="m-uni-stat"><div className="n">{u.foundedYear || '—'}</div><div className="l">{t.founded}</div></div>
        <div className="m-uni-stat">
          <div className="n">{u.tuitionMinEur != null && u.tuitionMaxEur != null ? `${u.tuitionMinEur}–${u.tuitionMaxEur}€` : t.tuitionVaries}</div>
          <div className="l">{t.tuition}</div>
        </div>
        <div className="m-uni-stat"><div className="n">{t.publicUni}</div><div className="l">{t.type}</div></div>
      </div>

      <a href={u.websiteUrl} target="_blank" rel="noreferrer" className="m-uni-visit-btn">
        {t.visit} <IconExternalLink size={15} />
      </a>
      <button type="button" className="m-uni-save-btn" onClick={doFav}>
        <IconHeart size={15} filled={fav} /> {fav ? t.saved : t.save}
      </button>

      <div className="m-uni-tabs">
        {[
          ['overview', t.overview],
          ['programs', t.programs],
          ['admission', t.admission],
          ['gallery', t.gallery],
        ].map(([key, label]) => (
          <button key={key} type="button" className={'m-uni-tab' + (tab === key ? ' active' : '')} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="m-uni-tabpanel">
          <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{pickUniDescription(u, lang)}</p>
          <div className="m-section-title" style={{ fontSize: 14, marginTop: 18 }}>{t.fields}</div>
          <div className="m-uni-chips">
            {fieldsList.map((f) => <span key={f} className="m-uni-chip">{f}</span>)}
          </div>
          {pickUniTuitionNote(u, lang) && (
            <div className="masar-nationality-note" style={{ marginTop: 20 }}>
              <div className="label">{t.tuition}</div>
              <div className="body">{pickUniTuitionNote(u, lang)}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'programs' && (
        <div className="m-uni-tabpanel">
          <div className="m-section-title" style={{ fontSize: 14 }}>{t.degreeLevels}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {[
              [t.bachelor, IconBook],
              [t.master, IconCap],
              [t.phd, IconDocument],
            ].map(([label, Icon]) => (
              <div key={label} className="m-uni-program-row">
                <Icon size={17} /> <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="m-uni-chips" style={{ marginTop: 16 }}>
            {fieldsList.map((f) => <span key={f} className="m-uni-chip">{f}</span>)}
          </div>
        </div>
      )}

      {tab === 'admission' && (
        <div className="m-uni-tabpanel">
          <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{t.admissionText}</p>
          {portal && (
            <a href={portal.url} target="_blank" rel="noreferrer" className="m-uni-portal-link">
              <IconExternalLink size={15} /> {t.portalNote} {portal.label}
            </a>
          )}
          <Link to={`/section/visa`} className="m-uni-portal-link" style={{ marginTop: 8 }}>
            <IconDocument size={15} /> {TEXT[lang]?.admission || 'Visa'} — Masar guide
          </Link>
        </div>
      )}

      {tab === 'gallery' && (
        <div className="m-uni-tabpanel">
          {u.campusPhotoUrl ? (
            <>
              <div className="m-uni-gallery-photo" style={photoBackground(u.campusPhotoUrl, fallbackColor)}>
                <span className="cap">{u.name}</span>
              </div>
              {(u.campusPhotoCredit || u.campusPhotoLicense) && (
                <div className="m-uni-gallery-credit">
                  {t.photoCredit} {u.campusPhotoCredit}{u.campusPhotoCredit && u.campusPhotoLicense ? ' · ' : ''}{u.campusPhotoLicense}{u.campusPhotoLicense && u.campusPhotoLicense.startsWith('CC') ? ' · Wikimedia Commons' : ''}
                </div>
              )}
              {u.cityPhotoUrl && (
                <div className="m-uni-gallery-photo" style={{ ...photoBackground(u.cityPhotoUrl, fallbackColor), marginTop: 14 }}>
                  <span className="cap">{t.cityView} {u.city}</span>
                </div>
              )}
            </>
          ) : u.cityPhotoUrl ? (
            <>
              <div className="m-uni-gallery-photo" style={photoBackground(u.cityPhotoUrl, fallbackColor)}>
                <span className="cap">{t.cityView} {u.city}</span>
              </div>
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 10, lineHeight: 1.5 }}>{t.noCampusPhoto}</p>
            </>
          ) : (
            <div className="m-uni-gallery-photo" style={destPhotoBackground(u.country, { w: 1000, q: 80 })}>
              <span className="cap">{t.cityView} {u.city}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
