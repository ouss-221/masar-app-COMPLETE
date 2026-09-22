import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, community, location as locationApi, students as studentsApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { COUNTRIES } from '../i18n/DestinationContext.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';
import { CITIES_BY_COUNTRY } from '../data/profileOptions.js';
import { IconEye } from '../components/Icons.jsx';
import Avatar from '../components/Avatar.jsx';

// Community v2 - matches the approved "Path" design concept exactly
// (Nearby / University / Groups pill tabs, a "Students near you" card,
// flat "Popular destinations" group cards, a privacy banner). Merges what
// used to be two separate pages: NearbyStudents.jsx's People tab (nearby
// geo list + university search, both reused as-is below) and this page's
// own old per-country/city accordion (now a flat Popular Destinations
// list instead). /people redirects here - see App.jsx.
const TEXT = {
  fr: {
    title: 'Communauté',
    subPre: 'Chaque étudiant vivant le même parcours — ', subEm: 'où que vous soyez', subPost: ', qui que vous soyez.',
    tabNearby: 'Proximité', tabUniversity: 'Université', tabGroups: 'Groupes',
    nearbyTitle: 'Étudiants à proximité', seeAll: 'Voir tout', seeLess: 'Réduire',
    online: 'En ligne', away: 'Absent', km: 'km', noOne: 'Personne à proximité pour le moment.',
    visibleLabel: 'Visible dans la liste des membres',
    consentTitle: 'Activer la localisation en direct ?',
    consentBody: "Partagez votre position approximative pendant que cette page est ouverte pour voir quels étudiants sont proches, avec la distance. Votre position exacte n'est jamais partagée, seule une distance arrondie l'est.",
    enable: 'Activer', permissionDenied: "Localisation refusée par le navigateur.",
    universityTitle: 'Étudiants de votre université',
    discoverableNeeded: 'Activez « Permettre aux autres étudiants de me trouver » dans votre profil pour voir cette liste.',
    goToProfile: 'Aller au profil',
    noUniversity: 'Ajoutez votre université dans votre profil pour utiliser cet onglet.',
    popularTitle: 'Destinations populaires', popularHint: 'Ouvrez un groupe — tous ceux qui vont là-bas sont les bienvenus.',
    students: (n) => `${n} étudiant${n > 1 ? 's' : ''}`,
    allOrigins: 'toutes origines bienvenues',
    join: 'Rejoindre', open: 'Ouvrir', joining: 'Un instant…',
    bannerText: "Les groupes sont organisés par destination, pas par origine — quelle que soit la façon dont vous êtes arrivé ici, vous êtes des nôtres.",
    loginPrompt: 'Connectez-vous pour rejoindre la communauté.', loginBtn: 'Se connecter',
    loading: 'Chargement…',
  },
  en: {
    title: 'Community',
    subPre: 'Every student on the same journey — ', subEm: 'wherever', subPost: " you're from, whoever you are.",
    tabNearby: 'Nearby', tabUniversity: 'University', tabGroups: 'Groups',
    nearbyTitle: 'Students near you', seeAll: 'See all', seeLess: 'See less',
    online: 'Online', away: 'Away', km: 'km', noOne: 'No one nearby right now.',
    visibleLabel: 'Visible in member list',
    consentTitle: 'Turn on live location?',
    consentBody: "Share your approximate location while this page is open to see which students are nearby, with distance. Your exact position is never shared, only a rounded distance.",
    enable: 'Turn on', permissionDenied: 'Location was denied by the browser.',
    universityTitle: 'Students at your university',
    discoverableNeeded: 'Turn on "Let other students find me" in your profile to see this list.',
    goToProfile: 'Go to profile',
    noUniversity: 'Add your university in your profile to use this tab.',
    popularTitle: 'Popular destinations', popularHint: 'Open a group — everyone heading here is welcome.',
    students: (n) => `${n} student${n > 1 ? 's' : ''}`,
    allOrigins: 'all origins welcome',
    join: 'Join', open: 'Open', joining: 'One moment…',
    bannerText: "Groups are organized by destination, not origin — so however you got here, you're in.",
    loginPrompt: 'Log in to join the community.', loginBtn: 'Log in',
    loading: 'Loading…',
  },
  ar: {
    title: 'المجتمع',
    subPre: 'كل طالب يعيش نفس المسار — ', subEm: 'أينما كنت', subPost: '، وأيًا كنت.',
    tabNearby: 'القريبون', tabUniversity: 'الجامعة', tabGroups: 'المجموعات',
    nearbyTitle: 'طلبة قريبون', seeAll: 'عرض الكل', seeLess: 'عرض أقل',
    online: 'متصل', away: 'غائب', km: 'كم', noOne: 'لا يوجد أحد قريب حاليًا.',
    visibleLabel: 'ظاهر في قائمة الأعضاء',
    consentTitle: 'تفعيل الموقع المباشر؟',
    consentBody: 'شارك موقعك التقريبي أثناء فتح هذه الصفحة لمعرفة الطلبة القريبين منك مع المسافة. لا تتم مشاركة موقعك الدقيق أبدًا، فقط مسافة مقرّبة.',
    enable: 'تفعيل', permissionDenied: 'تم رفض إذن الموقع من المتصفح.',
    universityTitle: 'طلبة جامعتك',
    discoverableNeeded: 'فعّل "السماح للطلبة الآخرين بإيجادي" في ملفك الشخصي لرؤية هذه القائمة.',
    goToProfile: 'الذهاب إلى الملف الشخصي',
    noUniversity: 'أضف جامعتك في ملفك الشخصي لاستخدام هذا القسم.',
    popularTitle: 'وجهات شائعة', popularHint: 'افتح مجموعة — كل من يقصد هذه الوجهة مرحّب به.',
    students: (n) => `${n} طالب`,
    allOrigins: 'الجميع مرحّب به مهما كان أصله',
    join: 'انضمام', open: 'فتح', joining: 'لحظة من فضلك…',
    bannerText: 'المجموعات مرتّبة حسب الوجهة، لا حسب الأصل — أيًا كانت طريقة وصولك، أنت من ضمننا.',
    loginPrompt: 'سجّل الدخول للانضمام إلى المجتمع.', loginBtn: 'تسجيل الدخول',
    loading: 'جارٍ التحميل…',
  },
};

function PersonRow({ u, t }) {
  return (
    <div className="m-comm-row">
      <Avatar userId={u.userId} name={u.displayName} size={38} />
      <div className="info">
        <span className="name">{u.displayName || '—'}</span>
        <span className="meta">{u.university || ''} {u.programType ? `· ${u.programType}` : ''}</span>
      </div>
      {u.distanceKm != null && (
        <div className="status">
          <span className="dist">{u.distanceKm} {t.km}</span>
          <span className={'state' + (u.online ? ' online' : ' away')}>
            <span className={'dot' + (u.online ? ' online' : ' away')} />
            {u.online ? t.online : t.away}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Community() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = TEXT[lang] || TEXT.en;
  const loggedIn = auth.isLoggedIn();

  const [tab, setTab] = useState('nearby');

  // ---- Nearby ----
  const [sharing, setSharing] = useState(() => localStorage.getItem('masar_location_sharing') === 'true');
  const [geoError, setGeoError] = useState(false);
  const [nearby, setNearby] = useState([]);
  const [nearbyExpanded, setNearbyExpanded] = useState(false);
  const pingInterval = useRef(null);

  const fetchNearbyOnce = () => {
    if (!navigator.geolocation) { setGeoError(true); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        locationApi.ping(latitude, longitude).catch(() => {});
        locationApi.nearby(latitude, longitude, 15).then((res) => setNearby(res.data)).catch(() => {});
      },
      () => setGeoError(true),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!loggedIn || !sharing) return;
    fetchNearbyOnce();
    pingInterval.current = setInterval(fetchNearbyOnce, 30000);
    return () => clearInterval(pingInterval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, sharing]);

  const toggleSharing = () => {
    if (sharing) {
      locationApi.setSharing(false).then(() => {
        localStorage.setItem('masar_location_sharing', 'false');
        setSharing(false);
        setNearby([]);
        if (pingInterval.current) clearInterval(pingInterval.current);
      });
    } else {
      locationApi.setSharing(true).then(() => {
        localStorage.setItem('masar_location_sharing', 'true');
        setSharing(true);
      });
    }
  };

  // ---- University ----
  const [university, setUniversity] = useState([]);
  const [universityBlocked, setUniversityBlocked] = useState(false);
  const myUniversity = localStorage.getItem('masar_user_university') || '';

  useEffect(() => {
    if (tab !== 'university' || !loggedIn) return;
    studentsApi.byUniversity(myUniversity).then((res) => setUniversity(res.data)).catch((e) => {
      if (e?.response?.status === 403) setUniversityBlocked(true);
    });
  }, [tab, loggedIn, myUniversity]);

  // ---- Popular destinations (Groups) - one representative (top) city per
  // destination country, from the same public counts endpoint the old
  // accordion used. Fetched once regardless of tab, matching the approved
  // screen where this section sits below the Nearby card on the same view. ----
  const [topCityByCountry, setTopCityByCountry] = useState({});
  const [myGroupByCountry, setMyGroupByCountry] = useState({}); // country -> {id, joined} once known
  const [joining, setJoining] = useState(null); // country code currently mid-join

  useEffect(() => {
    Promise.all(COUNTRIES.map((c) => community.counts(c.code).then((res) => [c.code, res.data]).catch(() => [c.code, []])))
      .then((entries) => {
        const top = {};
        entries.forEach(([code, cities]) => {
          const best = [...cities].sort((a, b) => b.total - a.total)[0];
          top[code] = best || { city: (CITIES_BY_COUNTRY[code] || [])[0] || '', total: 0 };
        });
        setTopCityByCountry(top);
        if (!loggedIn) return;
        // Read-only lookup (GET /api/community/group never creates anything,
        // unlike join()) so this can run just to find out whether the
        // caller already belongs to each top city's group - lets the button
        // read "Open" instead of "Join" for a group they're already in,
        // matching the approved design, without risking a join() call that
        // would silently reset an existing member's visibility choice back
        // to false (see doJoinGroup below).
        Object.entries(top).forEach(([code, city]) => {
          if (!city.city) return;
          community.group(code, city.city).then((res) => {
            setMyGroupByCountry((s) => ({ ...s, [code]: { id: res.data.id, joined: res.data.joined } }));
          }).catch(() => {});
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const doJoinGroup = async (country) => {
    if (!loggedIn) { navigate('/login'); return; }
    const city = topCityByCountry[country]?.city;
    if (!city) return;
    const already = myGroupByCountry[country];
    if (already?.joined && already.id) {
      navigate(`/community/${already.id}`);
      return;
    }
    setJoining(country);
    try {
      // join() (not group()) is what actually creates the caller's
      // membership. Same privacy-by-default (visible: false) as every
      // other auto-join in this app; the member can turn visibility on
      // later from inside the room (or right here, for the top nearby-city
      // group, via the "Visible in member list" toggle above).
      const res = await community.join(country, city, false);
      navigate(`/community/${res.data.id}`);
    } finally {
      setJoining(null);
    }
  };

  if (!loggedIn) {
    return (
      <div className="m-page">
        <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
        <p style={{ fontSize: 14, opacity: 0.75, marginTop: 10 }}>{t.loginPrompt}</p>
        <button type="button" className="btn btn-dark btn-sm" onClick={() => navigate('/login')}>{t.loginBtn}</button>
      </div>
    );
  }

  const showPopular = tab !== 'university';
  const visibleNearby = nearbyExpanded ? nearby : nearby.slice(0, 3);

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10, marginBottom: 0 }}>{t.title}</div>
      <p className="m-section-sub" style={{ maxWidth: '92%' }}>{t.subPre}<em className="m-em">{t.subEm}</em>{t.subPost}</p>

      <div className="m-comm-tabs">
        {['nearby', 'university', 'groups'].map((tb) => (
          <button key={tb} type="button" className={'m-comm-tab' + (tab === tb ? ' active' : '')} onClick={() => setTab(tb)}>
            {t['tab' + tb.charAt(0).toUpperCase() + tb.slice(1)]}
          </button>
        ))}
      </div>

      {tab !== 'groups' && tab !== 'university' && (
        <div className="m-comm-card">
          <div className="m-comm-card-head">
            <span className="t">{t.nearbyTitle}</span>
            {nearby.length > 3 && (
              <button type="button" className="see-all" onClick={() => setNearbyExpanded((v) => !v)}>
                {nearbyExpanded ? t.seeLess : t.seeAll}
              </button>
            )}
          </div>

          {!sharing ? (
            <div className="m-community-join-panel" style={{ margin: '11px 0 0' }}>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.consentTitle}</p>
              <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 10, lineHeight: 1.5 }}>{t.consentBody}</p>
              {geoError && <p style={{ fontSize: 12, color: '#B3261E', marginBottom: 8 }}>{t.permissionDenied}</p>}
              <button type="button" className="btn btn-dark btn-sm" onClick={toggleSharing}>{t.enable}</button>
            </div>
          ) : (
            <div className="m-comm-list">
              {visibleNearby.map((u) => <PersonRow key={u.userId} u={u} t={t} />)}
              {nearby.length === 0 && <p className="m-comm-empty">{t.noOne}</p>}
            </div>
          )}

          <div className="m-comm-toggle-row">
            <IconEye size={13} />
            <span className="lbl">{t.visibleLabel}</span>
            <button type="button" className={'m-comm-toggle' + (sharing ? ' on' : '')} onClick={toggleSharing} aria-pressed={sharing} aria-label={t.visibleLabel}>
              <span className="knob" />
            </button>
          </div>
        </div>
      )}

      {tab === 'university' && (
        <div className="m-comm-card">
          <div className="m-comm-card-head">
            <span className="t">{t.universityTitle}</span>
          </div>
          {!myUniversity ? (
            <p className="m-comm-empty" style={{ marginTop: 11 }}>{t.noUniversity}</p>
          ) : universityBlocked ? (
            <div className="m-community-join-panel" style={{ margin: '11px 0 0' }}>
              <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>{t.discoverableNeeded}</p>
              <button type="button" className="btn btn-dark btn-sm" onClick={() => navigate('/profile/personal-info')}>{t.goToProfile}</button>
            </div>
          ) : (
            <div className="m-comm-list">
              {university.map((u) => <PersonRow key={u.userId} u={u} t={t} />)}
              {university.length === 0 && <p className="m-comm-empty">{t.noOne}</p>}
            </div>
          )}
        </div>
      )}

      {showPopular && (
        <>
          <div className="m-comm-section-head">
            <h3>{t.popularTitle}</h3>
            <div className="hint">{t.popularHint}</div>
          </div>

          <div className="m-dest-group-list">
            {COUNTRIES.map((c, i) => {
              const Flag = FLAG_MAP[c.code];
              const top = topCityByCountry[c.code];
              const isOpen = !!myGroupByCountry[c.code]?.joined;
              return (
                <button
                  key={c.code}
                  type="button"
                  className={'m-dest-group-card' + (i === 0 ? ' featured' : '')}
                  disabled={joining === c.code}
                  onClick={() => doJoinGroup(c.code)}
                >
                  <span className="flag">{Flag ? <Flag size={22} /> : c.flag}</span>
                  <span className="info">
                    <span className="name">{top?.city || c.label}</span>
                    <span className="count">{t.students(top?.total || 0)} · {t.allOrigins}</span>
                  </span>
                  <span className={'join-btn' + (isOpen ? ' open' : '')}>
                    {joining === c.code ? t.joining : isOpen ? t.open : t.join}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="m-comm-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <circle cx="9" cy="8.2" r="3.2" />
              <path d="M3 20c.9-3.1 3.3-4.8 6-4.8s5.1 1.7 6 4.8" />
              <path d="M15.5 5.2c1.4.3 2.4 1.5 2.4 3s-1 2.7-2.4 3" />
              <path d="M17.5 15.4c2.1.4 3.6 1.9 4.2 4.6" />
            </svg>
            <p>{t.bannerText}</p>
          </div>
        </>
      )}
    </div>
  );
}
