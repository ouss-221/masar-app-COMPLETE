import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { universitiesApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { COUNTRIES } from '../i18n/DestinationContext.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';
import { IconChevronRight, IconChevronDown, IconPin } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    title: 'Toutes les universités',
    sub: 'Affinez par pays, ville, domaine, langue et plus.',
    loading: 'Chargement…',
    empty: 'Aucune université ne correspond à ces filtres.',
    results: (n) => `${n} université${n > 1 ? 's' : ''} trouvée${n > 1 ? 's' : ''}`,
    clear: 'Réinitialiser',
    filters: 'Filtres',
    f: {
      country: 'Pays', city: 'Ville', type: 'Public / Privé', degree: 'Diplôme', field: 'Domaine',
      language: "Langue d'enseignement", tuition: 'Frais de scolarité',
    },
    all: 'Tous',
    typePublic: 'Public', typePrivate: 'Privé',
    tuitionOpts: { under: "Jusqu'à 1 500 €/an", mid: '1 500 – 3 000 €/an', high: '3 000 €/an et plus', varies: 'Variable (privé) — voir le site' },
    founded: 'Fondée en',
  },
  en: {
    title: 'All universities',
    sub: 'Narrow down by country, city, field, language and more.',
    loading: 'Loading…',
    empty: 'No universities match these filters.',
    results: (n) => `${n} universit${n > 1 ? 'ies' : 'y'} found`,
    clear: 'Clear filters',
    filters: 'Filters',
    f: {
      country: 'Country', city: 'City', type: 'Public / Private', degree: 'Degree', field: 'Field',
      language: 'Language', tuition: 'Tuition',
    },
    all: 'All',
    typePublic: 'Public', typePrivate: 'Private',
    tuitionOpts: { under: 'Up to €1,500/yr', mid: '€1,500 – 3,000/yr', high: '€3,000+/yr', varies: 'Varies (private) — see website' },
    founded: 'Founded in',
  },
  ar: {
    title: 'كل الجامعات',
    sub: 'صفّي النتائج حسب البلد والمدينة والمجال واللغة وغيرها.',
    loading: 'جارٍ التحميل…',
    empty: 'لا توجد جامعات مطابقة لهذه الفلاتر.',
    results: (n) => `${n} جامعة موجودة`,
    clear: 'إعادة تعيين',
    filters: 'الفلاتر',
    f: {
      country: 'البلد', city: 'المدينة', type: 'عمومي / خاص', degree: 'الشهادة', field: 'المجال',
      language: 'لغة التدريس', tuition: 'الرسوم الدراسية',
    },
    all: 'الكل',
    typePublic: 'عمومي', typePrivate: 'خاص',
    tuitionOpts: { under: 'حتى 1500 يورو/سنة', mid: '1500 – 3000 يورو/سنة', high: '3000 يورو فأكثر/سنة', varies: 'متغيرة (خاص) — راجع الموقع' },
    founded: 'تأسست سنة',
  },
};

const DEGREE_OPTIONS = ["Bachelor's", "Master's", 'PhD'];

function tuitionBucket(u) {
  if (u.tuitionMinEur == null || u.tuitionMaxEur == null) return 'varies';
  if (u.tuitionMaxEur <= 1500) return 'under';
  if (u.tuitionMaxEur <= 3000) return 'mid';
  return 'high';
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

const EMPTY_FILTERS = { country: '', city: '', type: '', degree: '', field: '', language: '', tuition: '' };

export default function UniversitiesBrowse() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  useEffect(() => {
    setLoading(true);
    universitiesApi.all()
      .then((res) => setList(res.data))
      .catch((err) => {
        console.error('Failed to load universities', err);
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const cityOptions = useMemo(() => {
    const scoped = filters.country ? list.filter((u) => u.country === filters.country) : list;
    return uniqueSorted(scoped.map((u) => u.city));
  }, [list, filters.country]);

  const fieldOptions = useMemo(() => uniqueSorted(list.map((u) => u.primaryField)), [list]);
  const languageOptions = useMemo(() => uniqueSorted(list.map((u) => u.mainLanguage)), [list]);

  const countryRank = { es: 0, fr: 1, it: 2 };

  const filtered = useMemo(() => {
    return list
      .filter((u) => !filters.country || u.country === filters.country)
      .filter((u) => !filters.city || u.city === filters.city)
      .filter((u) => !filters.type || (filters.type === 'public' ? u.publicUniversity : !u.publicUniversity))
      .filter((u) => !filters.degree || (u.degreeLevels || '').split(',').map((d) => d.trim()).includes(filters.degree))
      .filter((u) => !filters.field || u.primaryField === filters.field)
      .filter((u) => !filters.language || u.mainLanguage === filters.language)
      .filter((u) => !filters.tuition || tuitionBucket(u) === filters.tuition)
      .sort((a, b) => (countryRank[a.country] - countryRank[b.country]) || (a.orderIndex - b.orderIndex));
  }, [list, filters]);

  const setFilter = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const clearFilters = () => setFilters(EMPTY_FILTERS);
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <div className="m-section-sub">{t.sub}</div>

      <div className="m-uni-filterbar">
        <div className="m-uni-filterbar-head">
          <span>{t.filters}{activeCount > 0 ? ` (${activeCount})` : ''}</span>
          {activeCount > 0 && (
            <button type="button" className="m-uni-filter-clear" onClick={clearFilters}>{t.clear}</button>
          )}
        </div>

        <div className="m-uni-filter-grid">
          <label className="m-uni-filter">
            <span>{t.f.country}</span>
            <div className="m-uni-select-wrap">
              <select value={filters.country} onChange={setFilter('country')}>
                <option value="">{t.all}</option>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <IconChevronDown size={12} />
            </div>
          </label>

          <label className="m-uni-filter">
            <span>{t.f.city}</span>
            <div className="m-uni-select-wrap">
              <select value={filters.city} onChange={setFilter('city')}>
                <option value="">{t.all}</option>
                {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <IconChevronDown size={12} />
            </div>
          </label>

          <label className="m-uni-filter">
            <span>{t.f.type}</span>
            <div className="m-uni-select-wrap">
              <select value={filters.type} onChange={setFilter('type')}>
                <option value="">{t.all}</option>
                <option value="public">{t.typePublic}</option>
                <option value="private">{t.typePrivate}</option>
              </select>
              <IconChevronDown size={12} />
            </div>
          </label>

          <label className="m-uni-filter">
            <span>{t.f.degree}</span>
            <div className="m-uni-select-wrap">
              <select value={filters.degree} onChange={setFilter('degree')}>
                <option value="">{t.all}</option>
                {DEGREE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <IconChevronDown size={12} />
            </div>
          </label>

          <label className="m-uni-filter">
            <span>{t.f.field}</span>
            <div className="m-uni-select-wrap">
              <select value={filters.field} onChange={setFilter('field')}>
                <option value="">{t.all}</option>
                {fieldOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <IconChevronDown size={12} />
            </div>
          </label>

          <label className="m-uni-filter">
            <span>{t.f.language}</span>
            <div className="m-uni-select-wrap">
              <select value={filters.language} onChange={setFilter('language')}>
                <option value="">{t.all}</option>
                {languageOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <IconChevronDown size={12} />
            </div>
          </label>

          <label className="m-uni-filter" style={{ gridColumn: '1 / -1' }}>
            <span>{t.f.tuition}</span>
            <div className="m-uni-select-wrap">
              <select value={filters.tuition} onChange={setFilter('tuition')}>
                <option value="">{t.all}</option>
                <option value="under">{t.tuitionOpts.under}</option>
                <option value="mid">{t.tuitionOpts.mid}</option>
                <option value="high">{t.tuitionOpts.high}</option>
                <option value="varies">{t.tuitionOpts.varies}</option>
              </select>
              <IconChevronDown size={12} />
            </div>
          </label>
        </div>
      </div>

      {loading && <p style={{ opacity: 0.6, fontSize: 14 }}>{t.loading}</p>}

      {!loading && (
        <>
          <div className="m-uni-results-count">{t.results(filtered.length)}</div>
          <div className="m-uni-list">
            {filtered.map((u) => {
              const Flag = FLAG_MAP[u.country];
              return (
                <Link key={u.slug} to={`/universities/${u.slug}`} className="m-uni-row">
                  <div className="m-uni-row-flag">{Flag ? <Flag size={22} /> : null}</div>
                  <div className="m-uni-row-body">
                    <div className="m-uni-row-name">{u.name}</div>
                    <div className="m-uni-row-meta">
                      <IconPin size={12} /> {u.city}{u.foundedYear ? ` · ${t.founded} ${u.foundedYear}` : ''}
                    </div>
                    <div className="m-uni-row-chips">
                      <span className="m-uni-row-chip">{u.publicUniversity ? t.typePublic : t.typePrivate}</span>
                      {u.primaryField && <span className="m-uni-row-chip">{u.primaryField}</span>}
                      {u.mainLanguage && <span className="m-uni-row-chip">{u.mainLanguage}</span>}
                    </div>
                  </div>
                  <IconChevronRight size={16} />
                </Link>
              );
            })}
            {filtered.length === 0 && <p style={{ opacity: 0.6, fontSize: 14 }}>{t.empty}</p>}
          </div>
        </>
      )}
    </div>
  );
}
