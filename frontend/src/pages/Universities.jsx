import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { universitiesApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { COUNTRIES } from '../i18n/DestinationContext.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';
import { IconChevronDown, IconChevronRight, IconArrowRight } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    title: 'Universités',
    sub: 'Trouvez une université qui correspond à vos objectifs.',
    empty: 'Aucune université trouvée pour le moment.',
    loading: 'Chargement…',
    viewAll: 'Voir toutes les universités',
    uniWord: (n) => (n > 1 ? 'universités' : 'université'),
  },
  en: {
    title: 'Universities',
    sub: 'Find a university that fits your goals.',
    empty: 'No universities found yet.',
    loading: 'Loading…',
    viewAll: 'View all universities',
    uniWord: (n) => (n > 1 ? 'universities' : 'university'),
  },
  ar: {
    title: 'الجامعات',
    sub: 'ابحث عن جامعة تناسب أهدافك.',
    empty: 'لا توجد جامعات حاليًا.',
    loading: 'جارٍ التحميل…',
    viewAll: 'عرض جميع الجامعات',
    uniWord: () => 'جامعة',
  },
};

export default function Universities() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCountry, setOpenCountry] = useState(null);
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

  const groups = COUNTRIES.map((c) => ({
    ...c,
    unis: list.filter((u) => u.country === c.code),
  }));

  const toggle = (code) => {
    setOpenCountry((cur) => (cur === code ? null : code));
  };

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <div className="m-section-sub">{t.sub}</div>

      {loading && <p style={{ opacity: 0.6, fontSize: 14 }}>{t.loading}</p>}

      {!loading && list.length === 0 && (
        <p style={{ opacity: 0.6, fontSize: 14 }}>{t.empty}</p>
      )}

      {!loading && list.length > 0 && (
        <div className="m-uni-accordion">
          {groups.map((g) => {
            const Flag = FLAG_MAP[g.code];
            const isOpen = openCountry === g.code;
            return (
              <div key={g.code} className={'m-uni-accordion-item' + (isOpen ? ' open' : '')}>
                <button
                  type="button"
                  className="m-uni-accordion-head"
                  onClick={() => toggle(g.code)}
                  aria-expanded={isOpen}
                >
                  <span className="m-uni-accordion-flag">{Flag ? <Flag size={22} /> : g.flag}</span>
                  <span className="m-uni-accordion-label">
                    <span className="name">{g.label}</span>
                    <span className="count">{g.unis.length} {t.uniWord(g.unis.length)}</span>
                  </span>
                  <span className="m-uni-accordion-chev"><IconChevronDown size={16} /></span>
                </button>

                {isOpen && (
                  <div className="m-uni-accordion-body">
                    {g.unis.map((u) => (
                      <Link key={u.slug} to={`/universities/${u.slug}`} className="m-uni-accordion-row">
                        <span>{u.name}</span>
                        <IconChevronRight size={15} />
                      </Link>
                    ))}
                    {g.unis.length === 0 && (
                      <div className="m-uni-accordion-row" style={{ opacity: 0.6 }}>{t.empty}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link to="/universities/browse" className="m-uni-viewall-btn">
        {t.viewAll} <IconArrowRight size={16} />
      </Link>
    </div>
  );
}
