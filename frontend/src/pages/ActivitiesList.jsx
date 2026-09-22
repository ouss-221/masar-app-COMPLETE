import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { activities as activitiesApi, auth } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useDestination } from '../i18n/DestinationContext.jsx';
import { CITIES_BY_COUNTRY } from '../data/profileOptions.js';
import { categoryFor } from '../data/activityCategories.js';
import { haversineKm } from '../data/cityCoordinates.js';
import { IconLock } from '../components/Icons.jsx';

// A dedicated "Activities" list, matching the approved design concept
// exactly (Nearby / This Week / All pill tabs, "← Back to Map"). Reached
// from Explore.jsx's map/list toggle. Shares its data source and
// RSVP/join-request logic with Explore.jsx's own card list (same
// activitiesApi.forCity + rsvp/joinRequests endpoints) - this page is a
// different filter/visual presentation of the same city-wide activities,
// not a separate feature.
const NEARBY_RADIUS_KM = 15;

const TEXT = {
  fr: {
    back: '← Retour à la carte', title: 'Activités',
    tabNearby: 'Proximité', tabWeek: 'Cette semaine', tabAll: 'Tout',
    loading: 'Chargement…', empty: 'Aucune activité ici pour le moment.',
    going: (n) => `${n} participant${n > 1 ? 's' : ''}`,
    private: 'Privé', ageBadge: (min, max) => min && max ? `${min}-${max} ans` : min ? `${min}+ ans` : `jusqu'à ${max} ans`,
    join: 'Rejoindre', requestJoin: 'Demander', leave: 'Quitter', pending: 'Demande envoyée', youreGoing: 'Vous participez',
    reviewRequests: 'Gérer les demandes', hide: 'Masquer', noRequests: 'Aucune demande en attente.',
    approve: 'Accepter', decline: 'Refuser',
    nearbyPrompt: 'Activez la localisation pour voir ce qui est proche de vous.',
    enableLocation: 'Activer ma position',
  },
  en: {
    back: '← Back to Map', title: 'Activities',
    tabNearby: 'Nearby', tabWeek: 'This Week', tabAll: 'All',
    loading: 'Loading…', empty: 'Nothing here yet.',
    going: (n) => `${n} going`,
    private: 'Private', ageBadge: (min, max) => min && max ? `${min}-${max}` : min ? `${min}+` : `up to ${max}`,
    join: 'Join', requestJoin: 'Request', leave: 'Leave', pending: 'Request sent', youreGoing: "You're going",
    reviewRequests: 'Review requests', hide: 'Hide', noRequests: 'No pending requests.',
    approve: 'Approve', decline: 'Decline',
    nearbyPrompt: 'Turn on location to see what’s near you.',
    enableLocation: 'Use my location',
  },
  ar: {
    back: '← العودة إلى الخريطة', title: 'الأنشطة',
    tabNearby: 'القريبة', tabWeek: 'هذا الأسبوع', tabAll: 'الكل',
    loading: 'جارٍ التحميل…', empty: 'لا يوجد شيء هنا بعد.',
    going: (n) => `${n} مشارك`,
    private: 'خاص', ageBadge: (min, max) => min && max ? `${min}-${max}` : min ? `+${min}` : `حتى ${max}`,
    join: 'انضمام', requestJoin: 'طلب', leave: 'مغادرة', pending: 'تم إرسال الطلب', youreGoing: 'أنت مشارك',
    reviewRequests: 'مراجعة الطلبات', hide: 'إخفاء', noRequests: 'لا توجد طلبات معلّقة.',
    approve: 'قبول', decline: 'رفض',
    nearbyPrompt: 'فعّل الموقع لرؤية ما هو قريب منك.',
    enableLocation: 'استخدام موقعي',
  },
};

export default function ActivitiesList() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = TEXT[lang] || TEXT.en;
  const { country: destCountry } = useDestination();
  const loggedIn = auth.isLoggedIn();

  const country = localStorage.getItem('masar_user_country') || destCountry || 'es';
  const initialCity = localStorage.getItem('masar_user_city') || (CITIES_BY_COUNTRY[country] || [])[0] || 'Madrid';
  const [city] = useState(initialCity);

  const [tab, setTab] = useState('week');
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const [myPosition, setMyPosition] = useState(null);

  const [rsvpBusy, setRsvpBusy] = useState(null);
  const [rsvpError, setRsvpError] = useState('');
  const [openRequestsFor, setOpenRequestsFor] = useState(null);
  const [requestsByActivity, setRequestsByActivity] = useState({});

  useEffect(() => {
    if (!loggedIn) return;
    auth.me().then((res) => setMyId(res.data.id)).catch(() => {});
  }, [loggedIn]);

  const load = () => {
    setLoading(true);
    activitiesApi.forCity(country, city).then((r) => setAllActivities(r.data)).catch(() => setAllActivities([])).finally(() => setLoading(false));
  };
  useEffect(load, [country, city]);

  // Same one-tap, client-side-only lookup as Explore.jsx's "locate me" -
  // never sent to or stored on the backend, only used here to sort/filter
  // the Nearby tab.
  const enableLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const withDistance = useMemo(() => {
    if (!myPosition) return allActivities.map((a) => ({ ...a, _distanceKm: null }));
    return allActivities.map((a) => ({
      ...a,
      _distanceKm: typeof a.lat === 'number' && typeof a.lng === 'number' ? haversineKm(myPosition, [a.lat, a.lng]) : null,
    }));
  }, [allActivities, myPosition]);

  const filtered = useMemo(() => {
    if (tab === 'nearby') {
      return withDistance.filter((a) => a._distanceKm != null && a._distanceKm <= NEARBY_RADIUS_KM)
        .sort((a, b) => a._distanceKm - b._distanceKm);
    }
    if (tab === 'week') {
      const now = Date.now();
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      return withDistance.filter((a) => {
        const t2 = new Date(a.scheduledAt).getTime();
        return t2 >= now - 60 * 60 * 1000 && t2 <= now + weekMs;
      });
    }
    return withDistance;
  }, [withDistance, tab]);

  const doRsvp = async (activity, going) => {
    setRsvpBusy(activity.id);
    setRsvpError('');
    try {
      await activitiesApi.rsvp(activity.id, going);
      load();
    } catch (err) {
      setRsvpError(err.response?.data || '');
    } finally {
      setRsvpBusy(null);
    }
  };

  const toggleRequests = (activity) => {
    if (openRequestsFor === activity.id) { setOpenRequestsFor(null); return; }
    setOpenRequestsFor(activity.id);
    activitiesApi.joinRequests(activity.id).then((res) => {
      setRequestsByActivity((s) => ({ ...s, [activity.id]: res.data }));
    }).catch(() => {});
  };

  const decideRequest = async (activityId, requestId, approve) => {
    try {
      if (approve) await activitiesApi.approveJoinRequest(requestId);
      else await activitiesApi.declineJoinRequest(requestId);
      const res = await activitiesApi.joinRequests(activityId);
      setRequestsByActivity((s) => ({ ...s, [activityId]: res.data }));
      load();
    } catch {
      // leave the panel as-is - the host can retry
    }
  };

  const renderActionPill = (a) => {
    const busy = rsvpBusy === a.id;
    if (a.joinStatus === 'going') {
      return <button type="button" className="m-act-pill outline" disabled={busy} onClick={(e) => { e.stopPropagation(); doRsvp(a, false); }}>{t.leave}</button>;
    }
    if (a.joinStatus === 'pending') {
      return <button type="button" className="m-act-pill outline" disabled>{t.pending}</button>;
    }
    return (
      <button type="button" className="m-act-pill" disabled={busy} onClick={(e) => { e.stopPropagation(); doRsvp(a, true); }}>
        {a.joinPolicy === 'private' ? t.requestJoin : t.join}
      </button>
    );
  };

  return (
    <div className="m-page" style={{ paddingBottom: 8 }}>
      <Link to="/map" className="m-chatroom-back">{t.back}</Link>
      <div className="m-section-title" style={{ marginTop: 6 }}>{t.title}</div>

      <div className="m-comm-tabs" style={{ marginTop: 12 }}>
        {['nearby', 'week', 'all'].map((tb) => (
          <button
            key={tb}
            type="button"
            className={'m-comm-tab' + (tab === tb ? ' active' : '')}
            onClick={() => { setTab(tb); if (tb === 'nearby' && !myPosition) enableLocation(); }}
          >
            {t['tab' + tb.charAt(0).toUpperCase() + tb.slice(1)]}
          </button>
        ))}
      </div>

      {rsvpError && <p className="m-page-error">{rsvpError}</p>}
      {loading && <p className="m-page-loading">{t.loading}</p>}

      {!loading && tab === 'nearby' && !myPosition && (
        <div className="m-community-join-panel" style={{ marginTop: 14 }}>
          <p style={{ fontSize: 13, marginBottom: 8 }}>{t.nearbyPrompt}</p>
          <button type="button" className="btn btn-dark btn-sm" onClick={enableLocation}>{t.enableLocation}</button>
        </div>
      )}

      {!loading && (
        <div className="m-act-list">
          {filtered.map((a, i) => {
            const cat = categoryFor(a.category);
            const isHost = myId != null && a.hostId === myId;
            const featured = i === 0;
            return (
              <div
                key={a.id}
                className={'m-act-card' + (featured ? ' featured' : '')}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/activities/${a.id}/chat`)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/activities/${a.id}/chat`); }}
              >
                <span className="m-act-badges">
                  <span className="m-act-cat" style={featured ? { background: cat.color, color: '#fff' } : { background: `${cat.color}1f`, color: cat.color }}>
                    {cat.emoji} {cat.label[lang] || cat.label.en}
                  </span>
                  {a.joinPolicy === 'private' && (
                    <span className="m-act-cat m-act-private"><IconLock size={9} /> {t.private}</span>
                  )}
                </span>
                <div className="m-act-title">{a.title}</div>
                <div className="m-act-meta">
                  {new Date(a.scheduledAt).toLocaleString(lang === 'ar' ? 'ar' : lang, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                  {a.location ? ` · ${a.location}` : ''}
                </div>
                <div className="m-act-row">
                  <span className="m-act-going">
                    {a.joinStatus === 'going' ? t.youreGoing : t.going(a.goingCount)}
                  </span>
                  {loggedIn && renderActionPill(a)}
                </div>
                {isHost && a.joinPolicy === 'private' && (
                  <div className="m-activity-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => toggleRequests(a)}>
                      {openRequestsFor === a.id ? t.hide : t.reviewRequests}
                    </button>
                  </div>
                )}
                {isHost && openRequestsFor === a.id && (
                  <div className="m-request-panel" onClick={(e) => e.stopPropagation()}>
                    {(requestsByActivity[a.id] || []).length === 0 && <p className="m-request-empty">{t.noRequests}</p>}
                    {(requestsByActivity[a.id] || []).map((r) => (
                      <div key={r.id} className="m-request-row">
                        <span className="m-request-name">{r.userName}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button type="button" className="btn btn-dark btn-sm" onClick={() => decideRequest(a.id, r.id, true)}>{t.approve}</button>
                          <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => decideRequest(a.id, r.id, false)}>{t.decline}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <p className="m-page-empty">{t.empty}</p>}
        </div>
      )}
    </div>
  );
}
