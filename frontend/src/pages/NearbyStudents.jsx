import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, location as locationApi, students as studentsApi, community } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { COUNTRIES } from '../i18n/DestinationContext.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';
import Avatar from '../components/Avatar.jsx';

const TEXT = {
  fr: {
    title: 'Étudiants', sub: 'Retrouvez et rejoignez d’autres étudiants Masar.',
    tabAll: 'Tout', tabNearby: 'Proximité', tabUniversity: 'Université', tabGroups: 'Groupes',
    loginPrompt: 'Connectez-vous pour voir les autres étudiants.', loginBtn: 'Se connecter',
    nearbyTitle: 'Étudiants à proximité', seeAll: 'Voir tout',
    consentTitle: 'Activer la localisation en direct ?',
    consentBody: "Partagez votre position approximative pendant que cette page est ouverte pour voir quels étudiants Masar discoverable sont proches de vous, avec la distance. Vous pouvez désactiver à tout moment — votre position n'est jamais partagée en exact, seule la distance arrondie l'est.",
    enable: 'Activer', disable: 'Désactiver le partage',
    permissionDenied: "Localisation refusée par le navigateur. Vous pouvez l'activer dans les réglages de votre navigateur.",
    online: 'En ligne', away: 'Absent', km: 'km',
    noOne: "Personne à proximité pour l'instant.",
    universityTitle: 'Étudiants de votre université',
    discoverableNeeded: "Activez « Permettre aux autres étudiants de me trouver » dans votre profil pour voir cette liste.",
    goToProfile: 'Aller au profil',
    noUniversity: 'Ajoutez votre université dans votre profil pour utiliser cet onglet.',
    groupsTitle: 'Destinations populaires', groupsHint: 'Ouvrez une destination pour rejoindre son groupe de discussion.',
    loading: 'Chargement…',
  },
  en: {
    title: 'Students', sub: 'Find and join other Masar students.',
    tabAll: 'All', tabNearby: 'Nearby', tabUniversity: 'University', tabGroups: 'Groups',
    loginPrompt: 'Log in to see other students.', loginBtn: 'Log in',
    nearbyTitle: 'Nearby students', seeAll: 'See all',
    consentTitle: 'Turn on live location?',
    consentBody: "Share your approximate location while this page is open to see which discoverable Masar students are nearby, with distance. Turn it off anytime — your exact position is never shared, only a rounded distance.",
    enable: 'Turn on', disable: 'Turn off sharing',
    permissionDenied: 'Location was denied by the browser. You can enable it in your browser settings.',
    online: 'Online', away: 'Away', km: 'km',
    noOne: 'No one nearby right now.',
    universityTitle: 'Students at your university',
    discoverableNeeded: "Turn on \"Let other students find me\" in your profile to see this list.",
    goToProfile: 'Go to profile',
    noUniversity: 'Add your university in your profile to use this tab.',
    groupsTitle: 'Popular destinations', groupsHint: "Open a destination to join its group chat.",
    loading: 'Loading…',
  },
  ar: {
    title: 'الطلبة', sub: 'ابحث عن طلبة Masar آخرين وانضم إليهم.',
    tabAll: 'الكل', tabNearby: 'القريبون', tabUniversity: 'الجامعة', tabGroups: 'المجموعات',
    loginPrompt: 'سجّل الدخول لرؤية الطلبة الآخرين.', loginBtn: 'تسجيل الدخول',
    nearbyTitle: 'طلبة قريبون', seeAll: 'عرض الكل',
    consentTitle: 'تفعيل الموقع المباشر؟',
    consentBody: 'شارك موقعك التقريبي أثناء فتح هذه الصفحة لمعرفة من هم طلبة Masar القريبون منك مع المسافة. يمكنك إيقاف ذلك في أي وقت — لا تتم مشاركة موقعك الدقيق أبدًا، فقط مسافة مقرّبة.',
    enable: 'تفعيل', disable: 'إيقاف المشاركة',
    permissionDenied: 'تم رفض إذن الموقع من المتصفح. يمكنك تفعيله من إعدادات المتصفح.',
    online: 'متصل', away: 'غائب', km: 'كم',
    noOne: 'لا يوجد أحد قريب حاليًا.',
    universityTitle: 'طلبة جامعتك',
    discoverableNeeded: 'فعّل "السماح للطلبة الآخرين بإيجادي" في ملفك الشخصي لرؤية هذه القائمة.',
    goToProfile: 'الذهاب إلى الملف الشخصي',
    noUniversity: 'أضف جامعتك في ملفك الشخصي لاستخدام هذا القسم.',
    groupsTitle: 'وجهات شائعة', groupsHint: 'افتح وجهة للانضمام إلى محادثتها الجماعية.',
    loading: 'جارٍ التحميل…',
  },
};

function StudentRow({ u, t }) {
  return (
    <div className="m-nearby-row">
      <Avatar userId={u.userId} name={u.displayName} size={38} />
      <div className="m-nearby-info">
        <div className="m-nearby-name">{u.displayName || '—'}</div>
        <div className="m-nearby-meta">
          {u.university || ''} {u.programType ? `· ${u.programType}` : ''}
        </div>
      </div>
      {u.distanceKm != null && (
        <div className="m-nearby-status">
          <span>{u.distanceKm} {t.km}</span>
          <span className={u.online ? 'online' : 'away'}>{u.online ? t.online : t.away}</span>
        </div>
      )}
    </div>
  );
}

export default function NearbyStudents() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = TEXT[lang] || TEXT.en;
  const loggedIn = auth.isLoggedIn();

  const [tab, setTab] = useState('all');
  const [sharing, setSharing] = useState(() => localStorage.getItem('masar_location_sharing') === 'true');
  const [geoError, setGeoError] = useState(false);
  const [nearby, setNearby] = useState([]);
  const [university, setUniversity] = useState([]);
  const [universityBlocked, setUniversityBlocked] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const pingInterval = useRef(null);
  const myUniversity = localStorage.getItem('masar_user_university') || '';

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
    if (sharing && (tab === 'all' || tab === 'nearby')) {
      fetchNearbyOnce();
      pingInterval.current = setInterval(fetchNearbyOnce, 30000);
      return () => clearInterval(pingInterval.current);
    }
  }, [sharing, tab]);

  useEffect(() => {
    if ((tab === 'all' || tab === 'university') && loggedIn) {
      studentsApi.byUniversity(myUniversity).then((res) => setUniversity(res.data)).catch((e) => {
        if (e?.response?.status === 403) setUniversityBlocked(true);
      });
    }
  }, [tab, loggedIn]);

  useEffect(() => {
    if ((tab === 'all' || tab === 'groups') && loggedIn) {
      setLoading(true);
      Promise.all(COUNTRIES.map((c) => community.counts(c.code).then((res) => [c.code, res.data]).catch(() => [c.code, []])))
        .then((entries) => {
          const flat = [];
          entries.forEach(([code, cities]) => cities.forEach((c) => flat.push({ country: code, ...c })));
          flat.sort((a, b) => b.total - a.total);
          setGroups(flat.slice(0, 8));
        })
        .finally(() => setLoading(false));
    }
  }, [tab, loggedIn]);

  const enableSharing = () => {
    locationApi.setSharing(true).then(() => {
      localStorage.setItem('masar_location_sharing', 'true');
      setSharing(true);
    });
  };

  const disableSharing = () => {
    locationApi.setSharing(false).then(() => {
      localStorage.setItem('masar_location_sharing', 'false');
      setSharing(false);
      setNearby([]);
      if (pingInterval.current) clearInterval(pingInterval.current);
    });
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

  const showNearbySection = tab === 'all' || tab === 'nearby';
  const showUniversitySection = tab === 'university';
  const showGroupsSection = tab === 'all' || tab === 'groups';

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <div className="m-section-sub">{t.sub}</div>

      <div className="m-explore-chips">
        {['all', 'nearby', 'university', 'groups'].map((tb) => (
          <button key={tb} type="button" className={'m-explore-chip' + (tab === tb ? ' active' : '')} onClick={() => setTab(tb)}>
            {t['tab' + tb.charAt(0).toUpperCase() + tb.slice(1)]}
          </button>
        ))}
      </div>

      {showNearbySection && (
        <div style={{ marginTop: 16 }}>
          <div className="m-nearby-section-head">
            <span>{t.nearbyTitle}</span>
            {tab === 'all' && <button type="button" className="m-link-btn" onClick={() => setTab('nearby')}>{t.seeAll}</button>}
          </div>

          {!sharing ? (
            <div className="m-community-join-panel">
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{t.consentTitle}</p>
              <p style={{ fontSize: 12.5, opacity: 0.7, marginBottom: 10, lineHeight: 1.5 }}>{t.consentBody}</p>
              {geoError && <p style={{ fontSize: 12.5, color: '#B3261E', marginBottom: 8 }}>{t.permissionDenied}</p>}
              <button type="button" className="btn btn-dark btn-sm" onClick={enableSharing}>{t.enable}</button>
            </div>
          ) : (
            <>
              <div className="m-nearby-list">
                {(tab === 'all' ? nearby.slice(0, 4) : nearby).map((u) => <StudentRow key={u.userId} u={u} t={t} />)}
                {nearby.length === 0 && <p style={{ fontSize: 13, opacity: 0.6 }}>{t.noOne}</p>}
              </div>
              {tab === 'nearby' && (
                <button type="button" className="btn btn-sm" style={{ marginTop: 10 }} onClick={disableSharing}>{t.disable}</button>
              )}
            </>
          )}
        </div>
      )}

      {showUniversitySection && (
        <div style={{ marginTop: 16 }}>
          <div className="m-nearby-section-head"><span>{t.universityTitle}</span></div>
          {!myUniversity ? (
            <p style={{ fontSize: 13, opacity: 0.65 }}>{t.noUniversity}</p>
          ) : universityBlocked ? (
            <div className="m-community-join-panel">
              <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>{t.discoverableNeeded}</p>
              <button type="button" className="btn btn-dark btn-sm" onClick={() => navigate('/profile/personal-info')}>{t.goToProfile}</button>
            </div>
          ) : (
            <div className="m-nearby-list">
              {university.map((u) => <StudentRow key={u.userId} u={u} t={t} />)}
              {university.length === 0 && <p style={{ fontSize: 13, opacity: 0.6 }}>{t.noOne}</p>}
            </div>
          )}
        </div>
      )}

      {showGroupsSection && (
        <div style={{ marginTop: 16 }}>
          <div className="m-nearby-section-head">
            <span>{t.groupsTitle}</span>
            {tab === 'all' && <button type="button" className="m-link-btn" onClick={() => setTab('groups')}>{t.seeAll}</button>}
          </div>
          <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>{t.groupsHint}</p>
          {loading && <p style={{ fontSize: 13, opacity: 0.6 }}>{t.loading}</p>}
          <div className="m-nearby-list">
            {groups.map((g) => {
              const Flag = FLAG_MAP[g.country];
              return (
                <button key={`${g.country}-${g.city}`} type="button" className="m-nearby-row" style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/community')}>
                  <div className="m-nearby-avatar">{Flag ? <Flag size={20} /> : '🌍'}</div>
                  <div className="m-nearby-info">
                    <div className="m-nearby-name">{g.city}</div>
                    <div className="m-nearby-meta">{g.total} students</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
