import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activities as activitiesApi, auth, location as locationApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useDestination } from '../i18n/DestinationContext.jsx';
import { CITIES_BY_COUNTRY } from '../data/profileOptions.js';
import { ACTIVITY_CATEGORIES } from '../data/activityCategories.js';
import { CITY_COORDINATES, COUNTRY_FALLBACK_CENTER, haversineKm, MAX_ACTIVITY_DISTANCE_KM } from '../data/cityCoordinates.js';
import ExploreMap from '../components/ExploreMap.jsx';
import ActivityMap from '../components/ActivityMap.jsx';
import { IconNavigation, IconPlus } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    title: 'Explorer', sub: 'Les activités créées par les étudiants Masar près de chez vous.',
    all: 'Tout', list: 'Liste', map: 'Carte', loading: 'Chargement…',
    empty: 'Aucune activité ici pour le moment. Soyez le premier à en ajouter une !',
    going: (n) => `${n} participant${n > 1 ? 's' : ''}`,
    locateMe: 'Ma position', locating: 'Localisation…',
    locateUnsupported: "Votre navigateur ne prend pas en charge la géolocalisation.",
    locateDenied: "Impossible d'accéder à votre position — vérifiez l'autorisation de localisation du navigateur.",
    addActivity: 'Ajouter une activité',
    travelersHere: (n) => `${n} voyageur${n > 1 ? 's' : ''} ici`,
    travelersCta: 'Voir qui est à proximité',
    private: 'Privé', ageBadge: (min, max) => min && max ? `${min}-${max} ans` : min ? `${min}+ ans` : `jusqu'à ${max} ans`,
    join: 'Rejoindre', requestJoin: 'Demander à rejoindre', leave: 'Quitter', pending: 'Demande envoyée',
    youreGoing: "Vous participez", viewDetails: 'Voir les détails',
    pendingRequests: (n) => `${n} demande${n > 1 ? 's' : ''} en attente`,
    approve: 'Accepter', decline: 'Refuser', reviewRequests: 'Gérer les demandes', hide: 'Masquer',
    noRequests: 'Aucune demande en attente.',
    wizardTitle: 'Nouvelle activité', wizardStepOf: (s) => `Étape ${s} sur 5`,
    wantLabel: 'Je veux...', wantPlaceholder: 'ex. Aller au bowling, visiter un musée…',
    moreDetails: 'Plus de détails (optionnel)',
    typeLabel: 'Quel type ?',
    whereLabel: 'Où ?', whereGeneral: 'Zone générale', whereGeneralHint: 'Montre un cercle approximatif — pour rester discret sur le lieu exact.',
    whereSpecific: 'Lieu précis', whereSpecificHint: "Montre une épingle exacte sur la carte.",
    pinInstructions: 'Faites glisser la carte pour positionner le repère sur le lieu exact.',
    locationName: 'Nom du lieu (optionnel)',
    whenLabel: 'Quand ?', today: "Aujourd'hui", tomorrow: 'Demain', otherDate: 'Autre date',
    timeFlexible: 'Horaire flexible', timeFlexibleHint: "Vous déciderez de l'heure exacte avec le groupe.",
    timeSpecific: 'Heure précise',
    whoLabel: 'Qui peut participer ?', ageRange: "Tranche d'âge (optionnel)", capacity: 'Places (optionnel)',
    joinOpen: 'Ouvert', joinOpenHint: "N'importe qui peut rejoindre instantanément.",
    joinPrivate: 'Privé', joinPrivateHint: "Vous approuvez chaque demande avant qu'elle rejoigne.",
    back: 'Retour', next: 'Suivant', addToMap: 'Ajouter à la carte !',
    cancel: 'Annuler', activityCreateError: "Impossible de créer l'activité. Réessayez.",
    activityNetworkError: "Connexion au serveur impossible. Vérifiez votre connexion et réessayez.",
    ageGateGeneric: "Vous ne remplissez pas la tranche d'âge de cette activité.",
    addBirthDate: 'Ajouter ma date de naissance',
    tooFar: (c, km) => `Trop loin de ${c} (${km} km) — placez le repère à moins de ${MAX_ACTIVITY_DISTANCE_KM} km.`,
  },
  en: {
    title: 'Explore', sub: 'Activities Masar students have created near you.',
    all: 'All', list: 'List', map: 'Map', loading: 'Loading…',
    empty: 'Nothing here yet. Be the first to add an activity!',
    going: (n) => `${n} going`,
    locateMe: 'My location', locating: 'Locating…',
    locateUnsupported: "Your browser doesn't support geolocation.",
    locateDenied: "Couldn't get your location — check your browser's location permission for this site.",
    addActivity: 'Add activity',
    travelersHere: (n) => `${n} traveler${n > 1 ? 's' : ''} here`,
    travelersCta: 'See who’s nearby',
    private: 'Private', ageBadge: (min, max) => min && max ? `${min}-${max}` : min ? `${min}+` : `up to ${max}`,
    join: 'Join', requestJoin: 'Request to join', leave: 'Leave', pending: 'Request sent',
    youreGoing: "You're going", viewDetails: 'View details',
    pendingRequests: (n) => `${n} pending request${n > 1 ? 's' : ''}`,
    approve: 'Approve', decline: 'Decline', reviewRequests: 'Review requests', hide: 'Hide',
    noRequests: 'No pending requests.',
    wizardTitle: 'New activity', wizardStepOf: (s) => `Step ${s} of 5`,
    wantLabel: 'I want to...', wantPlaceholder: 'e.g. Go bowling, visit a museum…',
    moreDetails: 'More details (optional)',
    typeLabel: 'What type?',
    whereLabel: 'Where?', whereGeneral: 'General area', whereGeneralHint: "Shows a rough circle — keeps the exact spot private.",
    whereSpecific: 'Specific location', whereSpecificHint: 'Shows an exact pin on the map.',
    pinInstructions: 'Drag the map so the pin marks the exact spot.',
    locationName: 'Place name (optional)',
    whenLabel: 'When?', today: 'Today', tomorrow: 'Tomorrow', otherDate: 'Other date',
    timeFlexible: 'Flexible time', timeFlexibleHint: "You'll sort out the exact time with the group.",
    timeSpecific: 'Set a specific time',
    whoLabel: 'Who can join?', ageRange: 'Age range (optional)', capacity: 'Capacity (optional)',
    joinOpen: 'Open', joinOpenHint: 'Anyone can join instantly.',
    joinPrivate: 'Private', joinPrivateHint: 'You approve each request before they join.',
    back: 'Back', next: 'Next', addToMap: 'Add to Map!',
    cancel: 'Cancel', activityCreateError: "Couldn't create the activity. Please try again.",
    activityNetworkError: "Couldn't reach the server. Check your connection and try again.",
    ageGateGeneric: "You don't meet this activity's age range.",
    addBirthDate: 'Add my date of birth',
    tooFar: (c, km) => `Too far from ${c} (${km} km away) — drag the pin to within ${MAX_ACTIVITY_DISTANCE_KM} km.`,
  },
  ar: {
    title: 'استكشاف', sub: 'أنشطة أنشأها طلبة Masar بالقرب منك.',
    all: 'الكل', list: 'قائمة', map: 'خريطة', loading: 'جارٍ التحميل…',
    empty: 'لا يوجد شيء هنا بعد. كن أول من يضيف نشاطًا!',
    going: (n) => `${n} مشارك`,
    locateMe: 'موقعي', locating: 'جارٍ تحديد الموقع…',
    locateUnsupported: 'متصفحك لا يدعم تحديد الموقع الجغرافي.',
    locateDenied: 'تعذّر الوصول إلى موقعك — تحقق من إذن الموقع في المتصفح لهذا الموقع.',
    addActivity: 'إضافة نشاط',
    travelersHere: (n) => `${n} مسافر هنا`,
    travelersCta: 'مشاهدة من هو قريب',
    private: 'خاص', ageBadge: (min, max) => min && max ? `${min}-${max}` : min ? `+${min}` : `حتى ${max}`,
    join: 'انضمام', requestJoin: 'طلب الانضمام', leave: 'مغادرة', pending: 'تم إرسال الطلب',
    youreGoing: 'أنت مشارك', viewDetails: 'عرض التفاصيل',
    pendingRequests: (n) => `${n} طلب معلّق`,
    approve: 'قبول', decline: 'رفض', reviewRequests: 'مراجعة الطلبات', hide: 'إخفاء',
    noRequests: 'لا توجد طلبات معلّقة.',
    wizardTitle: 'نشاط جديد', wizardStepOf: (s) => `الخطوة ${s} من 5`,
    wantLabel: 'أريد أن...', wantPlaceholder: 'مثال: لعب البولينغ، زيارة متحف…',
    moreDetails: 'تفاصيل إضافية (اختياري)',
    typeLabel: 'ما النوع؟',
    whereLabel: 'أين؟', whereGeneral: 'منطقة عامة', whereGeneralHint: 'يُظهر دائرة تقريبية — للحفاظ على خصوصية المكان الدقيق.',
    whereSpecific: 'مكان محدد', whereSpecificHint: 'يُظهر علامة دقيقة على الخريطة.',
    pinInstructions: 'اسحب الخريطة لتحديد الموقع الدقيق بالعلامة.',
    locationName: 'اسم المكان (اختياري)',
    whenLabel: 'متى؟', today: 'اليوم', tomorrow: 'غدًا', otherDate: 'تاريخ آخر',
    timeFlexible: 'وقت مرن', timeFlexibleHint: 'ستحددون الوقت الدقيق مع المجموعة.',
    timeSpecific: 'تحديد وقت دقيق',
    whoLabel: 'من يمكنه الانضمام؟', ageRange: 'الفئة العمرية (اختياري)', capacity: 'عدد الأماكن (اختياري)',
    joinOpen: 'مفتوح', joinOpenHint: 'يمكن لأي شخص الانضمام فورًا.',
    joinPrivate: 'خاص', joinPrivateHint: 'توافق على كل طلب قبل انضمامه.',
    back: 'رجوع', next: 'التالي', addToMap: 'أضف إلى الخريطة!',
    cancel: 'إلغاء', activityCreateError: 'تعذّر إنشاء النشاط. حاول مرة أخرى.',
    activityNetworkError: 'تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.',
    ageGateGeneric: 'أنت لا تندرج ضمن الفئة العمرية لهذا النشاط.',
    addBirthDate: 'إضافة تاريخ ميلادي',
    tooFar: (c, km) => `بعيد جدًا عن ${c} (${km} كم) — اسحب العلامة لتكون ضمن ${MAX_ACTIVITY_DISTANCE_KM} كم.`,
  },
};

function nextDays(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push(d);
  }
  return out;
}

const EMPTY_WIZARD = {
  title: '', description: '', category: null, precision: 'specific', pin: null, locationName: '',
  date: null, timeMode: 'flexible', time: '13:00', minAge: '', maxAge: '', joinPolicy: 'open', capacity: '',
};

export default function Explore() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = TEXT[lang] || TEXT.en;
  const { country: destCountry } = useDestination();
  const loggedIn = auth.isLoggedIn();

  const country = localStorage.getItem('masar_user_country') || destCountry || 'es';
  const initialCity = localStorage.getItem('masar_user_city') || (CITIES_BY_COUNTRY[country] || [])[0] || 'Madrid';
  const [city] = useState(initialCity);

  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // "Locate me": a one-tap, client-side-only lookup via the browser's own
  // Geolocation API - never sent to or stored on the backend, and separate
  // from this app's opt-in, server-tracked "Nearby Students" location
  // sharing that the Travelers badge below reuses.
  const [myPosition, setMyPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState('');

  const [travelers, setTravelers] = useState(null); // null = unknown, number once fetched

  useEffect(() => {
    if (!loggedIn || !navigator.geolocation) return;
    const sharing = localStorage.getItem('masar_location_sharing') === 'true';
    if (!sharing) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationApi.nearby(pos.coords.latitude, pos.coords.longitude, 15)
          .then((res) => setTravelers(res.data.length))
          .catch(() => {});
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [loggedIn]);

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocateError(t.locateUnsupported);
      return;
    }
    setLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocateError(t.locateDenied);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Center on the user's real live position automatically on load, instead
  // of only after they tap the locate button - a real complaint from
  // testing ("im in linares it shows me my direct live where iam not
  // showing me madrid like it shows now"). Falls back silently to the
  // profile's saved city (ExploreMap's own default) if permission is
  // denied or geolocation isn't available; the button stays for
  // re-centering later.
  useEffect(() => {
    locateMe();
    // Deliberately once on mount only - locateMe is stable enough for this
    // (it doesn't depend on props/state that change meaningfully here).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = () => {
    setLoading(true);
    activitiesApi.forCity(country, city).then((r) => setAllActivities(r.data)).catch(() => setAllActivities([])).finally(() => setLoading(false));
  };
  useEffect(load, [country, city]);

  const counts = useMemo(() => {
    const c = {};
    ACTIVITY_CATEGORIES.forEach((cat) => { c[cat.key] = 0; });
    allActivities.forEach((a) => { if (c[a.category] != null) c[a.category]++; });
    return c;
  }, [allActivities]);

  const filtered = filter === 'all' ? allActivities : allActivities.filter((a) => a.category === filter);

  // ---- "+ Add activity" wizard ----

  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [wizard, setWizard] = useState(EMPTY_WIZARD);
  const [dateChips] = useState(() => nextDays(6));
  const [customDate, setCustomDate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const openWizard = () => {
    setWizard(EMPTY_WIZARD);
    setStep(1);
    setCustomDate(false);
    setCreateError('');
    setShowWizard(true);
  };
  const closeWizard = () => setShowWizard(false);

  // Activities are tied to this destination's cohort city, so the pin has to
  // actually be somewhere near it - otherwise "creating an Alicante activity
  // while pinned in Granada" (a real complaint) would be possible. Checked
  // client-side here for immediate feedback; the backend enforces the same
  // ~80km radius as the authoritative check (see ActivityController).
  const cityCenter = CITY_COORDINATES[city] || COUNTRY_FALLBACK_CENTER[country] || null;
  const pinDistanceKm = wizard.pin && cityCenter ? haversineKm(wizard.pin, cityCenter) : null;
  const distanceWarning = pinDistanceKm != null && pinDistanceKm > MAX_ACTIVITY_DISTANCE_KM
    ? t.tooFar(city, Math.round(pinDistanceKm))
    : '';

  const canNext = {
    1: wizard.title.trim().length > 0,
    2: !!wizard.category,
    3: !!wizard.pin && !distanceWarning,
    4: !!wizard.date && (wizard.timeMode === 'flexible' || !!wizard.time),
    5: true,
  }[step];

  const submitWizard = async () => {
    setCreating(true);
    setCreateError('');
    try {
      const scheduledAt = new Date(`${wizard.date}T${wizard.timeMode === 'specific' ? wizard.time : '13:00'}:00`).toISOString();
      const res = await activitiesApi.createOnMap(country, city, {
        title: wizard.title.trim(),
        description: (wizard.description.trim() || (wizard.timeMode === 'flexible' ? '' : '')) || null,
        category: wizard.category,
        location: wizard.locationName.trim() || null,
        lat: wizard.pin[0],
        lng: wizard.pin[1],
        scheduledAt,
        capacity: wizard.capacity ? Number(wizard.capacity) : null,
        minAge: wizard.minAge ? Number(wizard.minAge) : null,
        maxAge: wizard.maxAge ? Number(wizard.maxAge) : null,
        joinPolicy: wizard.joinPolicy,
        locationPrecision: wizard.precision,
      });
      setShowWizard(false);
      // Straight into the new activity's own chat room, same as tapping any
      // other activity - a real request: "when u create an activty it takes
      // u to a chat room". No need to also refresh this page's list here,
      // since we're navigating away from it.
      navigate(`/activities/${res.data.id}/chat`);
    } catch (err) {
      // The backend usually replies with a plain-text reason (age gate,
      // too-far-from-the-city, invalid date...) which is just a string and
      // renders directly. But a few other cases used to fall through to the
      // generic fallback with no way to tell what actually happened - a real
      // complaint ("it said couldn't be created" with no further detail):
      //  - no response at all (network/CORS failure, or the backend hasn't
      //    picked up a recent rebuild yet) - err.response is undefined.
      //  - a non-string body, e.g. Spring's default JSON error object for an
      //    unhandled exception ({timestamp, status, error, message, path}) -
      //    rendering that object directly would crash the page instead of
      //    showing a message.
      // eslint-disable-next-line no-console
      console.error('Activity creation failed:', err);
      const data = err.response?.data;
      let message;
      if (typeof data === 'string' && data) message = data;
      else if (data && typeof data === 'object') message = data.message || data.error || t.activityCreateError;
      else if (!err.response) message = t.activityNetworkError;
      else message = t.activityCreateError;
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  const fmtDate = (d) => d.toLocaleDateString(lang === 'ar' ? 'ar' : lang, { weekday: 'short', day: 'numeric', month: 'short' });
  const isToday = (d) => d.toDateString() === new Date().toDateString();
  const isTomorrow = (d) => { const tm = new Date(); tm.setDate(tm.getDate() + 1); return d.toDateString() === tm.toDateString(); };
  const iso = (d) => d.toISOString().slice(0, 10);

  return (
    <div className="m-page" style={{ paddingBottom: 8 }}>
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <div className="m-section-sub">{t.sub}</div>

      <div className="m-explore-chips">
        <button type="button" className={'m-explore-chip' + (filter === 'all' ? ' active' : '')} onClick={() => setFilter('all')}>
          {t.all} ({allActivities.length})
        </button>
        {ACTIVITY_CATEGORIES.map((cat) => (
          <button key={cat.key} type="button" className={'m-explore-chip' + (filter === cat.key ? ' active' : '')} onClick={() => setFilter(cat.key)}>
            {cat.emoji} {cat.label[lang] || cat.label.en} ({counts[cat.key] || 0})
          </button>
        ))}
      </div>

      {loading && <p className="m-page-loading">{t.loading}</p>}

      {!loading && (
        <>
          <div style={{ marginTop: 10, position: 'relative' }}>
            <ExploreMap
              activities={filtered}
              country={country}
              city={city}
              height={380}
              myPosition={myPosition}
              onSelectActivity={(a) => navigate(`/activities/${a.id}/chat`)}
              t={t}
            />

            {loggedIn && (travelers != null ? (
              <button type="button" className="m-map-badge m-map-badge-pill" onClick={() => navigate('/people')}>
                🧭 {t.travelersHere(travelers)}
              </button>
            ) : (
              <button type="button" className="m-map-badge m-map-badge-pill m-map-badge-cta" onClick={() => navigate('/people')}>
                {t.travelersCta}
              </button>
            ))}

            <button
              type="button"
              className="m-map-badge m-map-badge-round"
              onClick={locateMe}
              disabled={locating}
              title={t.locateMe}
              aria-label={t.locateMe}
            >
              <IconNavigation size={17} />
            </button>
            {locateError && (
              <p className="m-map-error">{locateError}</p>
            )}
          </div>

          {filtered.length === 0 && (
            <p className="m-page-empty">{t.empty}</p>
          )}

          <button
            type="button"
            className="m-explore-view-toggle"
            onClick={() => navigate('/map/activities')}
          >
            {t.list}
          </button>
        </>
      )}

      {!showWizard && (
        <button type="button" className="m-fab" onClick={openWizard}>
          <span className="m-fab-icon"><IconPlus size={14} /></span>
          {t.addActivity}
        </button>
      )}

      {showWizard && (
        // No onClick here on purpose: an accidental tap on the backdrop used
        // to silently discard the whole in-progress wizard (real complaint -
        // "i touched the screen behind and everything got wiped off"). The
        // explicit × button below and the Cancel button on step 1 are the
        // only ways to close/discard now.
        <div className="m-report-overlay">
          <div className="m-report-modal" style={{ maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="m-wizard-header">
              <div className="m-section-title" style={{ fontSize: 18 }}>{t.wizardTitle}</div>
              <div className="m-wizard-step-label">
                <span className="m-wizard-step-count">{t.wizardStepOf(step)}</span>
                <button type="button" onClick={closeWizard} aria-label={t.cancel} className="m-modal-close">×</button>
              </div>
            </div>
            <div className="m-wizard-progress">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={'m-wizard-progress-dot' + (s <= step ? ' active' : '')} />
              ))}
            </div>

            {step === 1 && (
              <div>
                <label className="m-wizard-label">{t.wantLabel}</label>
                <input className="form-control mb-3" placeholder={t.wantPlaceholder} value={wizard.title} autoFocus
                  onChange={(e) => setWizard((s) => ({ ...s, title: e.target.value }))} />
                <label className="m-wizard-label" style={{ marginTop: 12 }}>{t.moreDetails}</label>
                <textarea className="form-control" rows={2} value={wizard.description}
                  onChange={(e) => setWizard((s) => ({ ...s, description: e.target.value }))} />
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="m-wizard-label">{t.typeLabel}</label>
                <div className="m-cat-grid">
                  {ACTIVITY_CATEGORIES.map((cat) => (
                    <button key={cat.key} type="button" className="m-cat-card" onClick={() => setWizard((s) => ({ ...s, category: cat.key }))}
                      style={{ borderColor: wizard.category === cat.key ? cat.color : undefined, background: wizard.category === cat.key ? `${cat.color}14` : undefined }}>
                      <span className="m-cat-icon" style={{ background: `${cat.color}1f` }}>{cat.emoji}</span>
                      <span className="m-cat-label">{cat.label[lang] || cat.label.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="m-wizard-label">{t.whereLabel}</label>
                <div className="m-option-row" style={{ marginBottom: 12 }}>
                  {[
                    { key: 'general', label: t.whereGeneral, hint: t.whereGeneralHint },
                    { key: 'specific', label: t.whereSpecific, hint: t.whereSpecificHint },
                  ].map((opt) => (
                    <button key={opt.key} type="button" className={'m-option-card' + (wizard.precision === opt.key ? ' selected' : '')}
                      onClick={() => setWizard((s) => ({ ...s, precision: opt.key }))}>
                      <div className="m-option-card-title">{opt.label}</div>
                      <div className="m-option-card-hint">{opt.hint}</div>
                    </button>
                  ))}
                </div>
                <input className="form-control mb-2" placeholder={t.locationName} value={wizard.locationName}
                  onChange={(e) => setWizard((s) => ({ ...s, locationName: e.target.value }))} />
                <p className="m-wizard-hint">{t.pinInstructions}</p>
                <ActivityMap activities={[]} country={country} city={city} height={200} pickMode="center"
                  onPick={(lat, lng) => setWizard((s) => ({ ...s, pin: [lat, lng] }))} pickedPosition={wizard.pin} />
                {distanceWarning && <p className="m-wizard-error">{distanceWarning}</p>}
              </div>
            )}

            {step === 4 && (
              <div>
                <label className="m-wizard-label">{t.whenLabel}</label>
                <div className="m-date-chips">
                  {dateChips.map((d) => (
                    <button key={iso(d)} type="button" className={'m-date-chip' + (!customDate && wizard.date === iso(d) ? ' selected' : '')}
                      onClick={() => { setCustomDate(false); setWizard((s) => ({ ...s, date: iso(d) })); }}>
                      {isToday(d) ? t.today : isTomorrow(d) ? t.tomorrow : fmtDate(d)}
                    </button>
                  ))}
                  <button type="button" className={'m-date-chip' + (customDate ? ' selected' : '')} onClick={() => setCustomDate(true)}>
                    {t.otherDate}
                  </button>
                </div>
                {customDate && (
                  <input type="date" className="form-control mb-3" value={wizard.date || ''}
                    onChange={(e) => setWizard((s) => ({ ...s, date: e.target.value }))} />
                )}
                <div className="m-option-row">
                  {[
                    { key: 'flexible', label: t.timeFlexible, hint: t.timeFlexibleHint },
                    { key: 'specific', label: t.timeSpecific, hint: null },
                  ].map((opt) => (
                    <button key={opt.key} type="button" className={'m-option-card' + (wizard.timeMode === opt.key ? ' selected' : '')}
                      onClick={() => setWizard((s) => ({ ...s, timeMode: opt.key }))}>
                      <div className="m-option-card-title">{opt.label}</div>
                      {opt.hint && <div className="m-option-card-hint">{opt.hint}</div>}
                    </button>
                  ))}
                </div>
                {wizard.timeMode === 'specific' && (
                  <input type="time" className="form-control mt-2" value={wizard.time}
                    onChange={(e) => setWizard((s) => ({ ...s, time: e.target.value }))} />
                )}
              </div>
            )}

            {step === 5 && (
              <div>
                <label className="m-wizard-label" style={{ marginBottom: 6 }}>{t.whoLabel}</label>

                <div className="m-option-row" style={{ marginBottom: 14 }}>
                  {[
                    { key: 'open', label: t.joinOpen, hint: t.joinOpenHint },
                    { key: 'private', label: t.joinPrivate, hint: t.joinPrivateHint },
                  ].map((opt) => (
                    <button key={opt.key} type="button" className={'m-option-card' + (wizard.joinPolicy === opt.key ? ' selected' : '')}
                      onClick={() => setWizard((s) => ({ ...s, joinPolicy: opt.key }))}>
                      <div className="m-option-card-title">{opt.label}</div>
                      <div className="m-option-card-hint">{opt.hint}</div>
                    </button>
                  ))}
                </div>

                <label className="m-wizard-label">{t.ageRange}</label>
                <div className="m-age-range">
                  <select className="form-select" value={wizard.minAge} onChange={(e) => setWizard((s) => ({ ...s, minAge: e.target.value }))}>
                    <option value="">—</option>
                    {Array.from({ length: 63 }, (_, i) => 18 + i).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <span className="m-age-range-sep">–</span>
                  <select className="form-select" value={wizard.maxAge} onChange={(e) => setWizard((s) => ({ ...s, maxAge: e.target.value }))}>
                    <option value="">80+</option>
                    {Array.from({ length: 63 }, (_, i) => 18 + i).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <label className="m-wizard-label" style={{ marginTop: 12 }}>{t.capacity}</label>
                <input type="number" min="1" className="form-control" value={wizard.capacity}
                  onChange={(e) => setWizard((s) => ({ ...s, capacity: e.target.value }))} />
              </div>
            )}

            {createError && <p className="m-wizard-error">{createError}</p>}

            <div className="m-wizard-actions">
              <button type="button" className="btn btn-outline-dark w-100" onClick={step === 1 ? closeWizard : () => setStep((s) => s - 1)}>
                {step === 1 ? t.cancel : t.back}
              </button>
              {step < 5 ? (
                <button type="button" className="btn btn-dark w-100" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                  {t.next}
                </button>
              ) : (
                <button type="button" className="btn btn-dark w-100" disabled={creating} onClick={submitWizard}>
                  {creating ? t.loading : t.addToMap}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
