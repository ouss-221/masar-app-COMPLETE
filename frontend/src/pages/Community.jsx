import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { community, auth } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { COUNTRIES } from '../i18n/DestinationContext.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';
import { ORIGIN_COUNTRIES } from '../data/profileOptions.js';
import { IconChevronDown } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    title: 'Communauté', sub: "Trouvez les étudiants qui vivent le même parcours que vous — même destination, même moment.",
    loading: 'Chargement…', empty: 'Personne n’a encore choisi cette ville — soyez le premier à la lancer.',
    students: (n) => (n > 1 ? 'étudiants' : 'étudiant'),
    join: 'Rejoindre', joining: 'Un instant…', open: 'Ouvrir',
    visibleLabel: 'Apparaître dans la liste des membres (nom + programme visibles par le groupe)',
    visibleHint: "Désactivé par défaut. Vous pouvez discuter et participer même invisible — vous comptez dans le nombre total, mais votre nom n'apparaît nulle part tant que vous ne l'activez pas.",
    loginPrompt: 'Connectez-vous pour rejoindre une communauté.',
    loginBtn: 'Se connecter',
    otherOrigin: 'Autres',
  },
  en: {
    title: 'Community', sub: 'Find students on the exact same move as you — same destination, same time.',
    loading: 'Loading…', empty: "No one's picked this city yet — be the first to start it.",
    students: () => 'students',
    join: 'Join', joining: 'One moment…', open: 'Open',
    visibleLabel: 'Show me in the member list (name + program visible to the group)',
    visibleHint: "Off by default. You can chat and take part while invisible — you count toward the total, but your name shows nowhere until you turn this on.",
    loginPrompt: 'Log in to join a community.',
    loginBtn: 'Log in',
    otherOrigin: 'Other',
  },
  ar: {
    title: 'المجتمع', sub: 'تعرّف على الطلبة الذين يعيشون نفس المسار — نفس الوجهة، نفس التوقيت.',
    loading: 'جارٍ التحميل…', empty: 'لم يختر أحد هذه المدينة بعد — كن أول من يبدأها.',
    students: () => 'طالب',
    join: 'انضمام', joining: 'لحظة من فضلك…', open: 'فتح',
    visibleLabel: 'إظهاري في قائمة الأعضاء (الاسم والبرنامج مرئيان للمجموعة)',
    visibleHint: 'معطّل افتراضيًا. يمكنك الدردشة والمشاركة وأنت غير ظاهر — تُحتسب ضمن العدد الإجمالي، لكن اسمك لا يظهر إلى أن تفعّل هذا الخيار.',
    loginPrompt: 'سجّل الدخول للانضمام إلى مجتمع.',
    loginBtn: 'تسجيل الدخول',
    otherOrigin: 'أخرى',
  },
};

export default function Community() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = TEXT[lang] || TEXT.en;
  const loggedIn = auth.isLoggedIn();

  const [countsByCountry, setCountsByCountry] = useState({});
  const [loading, setLoading] = useState(true);
  const [openCountry, setOpenCountry] = useState(null);
  const [openCity, setOpenCity] = useState(null);
  const [visibleChoice, setVisibleChoice] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all(COUNTRIES.map((c) => community.counts(c.code).then((res) => [c.code, res.data]).catch(() => [c.code, []])))
      .then((entries) => setCountsByCountry(Object.fromEntries(entries)))
      .finally(() => setLoading(false));
  }, []);

  const toggleCountry = (code) => {
    setOpenCountry((cur) => (cur === code ? null : code));
    setOpenCity(null);
  };

  const toggleCity = (country, city) => {
    const key = `${country}|${city}`;
    setOpenCity((cur) => (cur === key ? null : key));
    setVisibleChoice(false);
  };

  const doJoin = async (country, city) => {
    if (!loggedIn) { navigate('/login'); return; }
    setJoining(true);
    try {
      const res = await community.join(country, city, visibleChoice);
      navigate(`/community/${res.data.id}`);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <div className="m-section-sub">{t.sub}</div>

      {loading && <p style={{ opacity: 0.6, fontSize: 14 }}>{t.loading}</p>}

      {!loading && (
        <div className="m-uni-accordion">
          {COUNTRIES.map((c) => {
            const Flag = FLAG_MAP[c.code];
            const cities = countsByCountry[c.code] || [];
            const total = cities.reduce((sum, city) => sum + city.total, 0);
            const isOpen = openCountry === c.code;
            return (
              <div key={c.code} className={'m-uni-accordion-item' + (isOpen ? ' open' : '')}>
                <button type="button" className="m-uni-accordion-head" onClick={() => toggleCountry(c.code)} aria-expanded={isOpen}>
                  <span className="m-uni-accordion-flag">{Flag ? <Flag size={22} /> : c.flag}</span>
                  <span className="m-uni-accordion-label">
                    <span className="name">{c.label}</span>
                    <span className="count">{total} {t.students(total)}</span>
                  </span>
                  <span className="m-uni-accordion-chev"><IconChevronDown size={16} /></span>
                </button>

                {isOpen && (
                  <div className="m-uni-accordion-body">
                    {cities.length === 0 && <div className="m-uni-accordion-row" style={{ opacity: 0.6 }}>{t.empty}</div>}
                    {cities.map((city) => {
                      const cityKey = `${c.code}|${city.city}`;
                      const cityOpen = openCity === cityKey;
                      return (
                        <div key={city.city} className="m-community-city">
                          <button type="button" className="m-uni-accordion-row" onClick={() => toggleCity(c.code, city.city)} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
                            <span>{city.city} — {city.total} {t.students(city.total)}</span>
                            <IconChevronDown size={14} />
                          </button>
                          {city.byOrigin && (
                            <div className="m-community-origin-chips">
                              {ORIGIN_COUNTRIES.map((o) => {
                                const n = city.byOrigin[o.code];
                                if (!n) return null;
                                const OFlag = FLAG_MAP[o.code];
                                return (
                                  <span key={o.code} className="m-community-chip">
                                    {OFlag ? <OFlag size={14} /> : o.flag} {n}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {cityOpen && (
                            <div className="m-community-join-panel">
                              {!loggedIn ? (
                                <>
                                  <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>{t.loginPrompt}</p>
                                  <button type="button" className="btn btn-dark btn-sm" onClick={() => navigate('/login')}>{t.loginBtn}</button>
                                </>
                              ) : (
                                <>
                                  <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, marginBottom: 6, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={visibleChoice} onChange={(e) => setVisibleChoice(e.target.checked)} style={{ marginTop: 3 }} />
                                    <span>{t.visibleLabel}</span>
                                  </label>
                                  <p style={{ fontSize: 11.5, opacity: 0.55, marginBottom: 10, lineHeight: 1.5 }}>{t.visibleHint}</p>
                                  <button type="button" className="btn btn-dark btn-sm" disabled={joining} onClick={() => doJoin(c.code, city.city)}>
                                    {joining ? t.joining : t.join}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
