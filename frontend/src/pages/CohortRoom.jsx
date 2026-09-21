import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { community, activities as activitiesApi, auth } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';
import ActivityMap from '../components/ActivityMap.jsx';
import { IconUser } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    back: 'Retour à la communauté', members: 'Membres', chat: 'Discussion', activities: 'Activités', map: 'Carte',
    loading: 'Chargement…', visible: 'Visible', notMember: "Vous n'êtes pas membre de ce groupe.",
    memberCount: (n) => `${n} membre${n > 1 ? 's' : ''}`, visibleCount: (n) => `${n} visible${n > 1 ? 's' : ''}`,
    noVisible: "Aucun membre visible pour l'instant — soyez le premier à activer votre visibilité dans les Paramètres du groupe.",
    showMe: 'Apparaître dans la liste', hideMe: 'Ne plus apparaître', leave: 'Quitter ce groupe',
    typePlaceholder: 'Écrivez un message…', send: 'Envoyer', noMessages: 'Aucun message pour le moment. Lancez la discussion !',
    report: 'Signaler', block: 'Bloquer', reportReason: 'Décrivez le problème…', submitReport: 'Envoyer le signalement', reported: 'Signalement envoyé.',
    newActivity: '+ Nouvelle activité', activityTitle: 'Titre', activityDesc: 'Description (optionnel)', activityCategory: 'Catégorie',
    activityLocation: 'Lieu (optionnel)', activityWhen: 'Date et heure', activityCapacity: 'Places limitées (optionnel)',
    createActivity: "Créer l'activité", noActivities: "Aucune activité pour l'instant.", going: 'inscrit(s)', joinActivity: 'Participer', leaveActivity: 'Se désinscrire',
    hostedBy: 'Organisé par', cancel: 'Annuler', addPin: 'Ajouter un point sur la carte (optionnel)', tapMap: 'Faites glisser la carte pour positionner le repère.',
    cat_meetup: 'Rencontre', cat_housing: 'Recherche de logement', cat_orientation: 'Orientation', cat_arrival: "Arrivée", cat_study: 'Étude', cat_other: 'Autre',
    minAge: 'Âge min. (optionnel)', maxAge: 'Âge max. (optionnel)', joinPolicy: 'Qui peut participer ?', joinOpen: 'Ouvert', joinPrivate: 'Privé (avec approbation)',
    requestPending: 'Demande en attente', requestJoin: 'Demander à participer',
  },
  en: {
    back: 'Back to Community', members: 'Members', chat: 'Chat', activities: 'Activities', map: 'Map',
    loading: 'Loading…', visible: 'Visible', notMember: "You're not a member of this group.",
    memberCount: (n) => `${n} member${n > 1 ? 's' : ''}`, visibleCount: (n) => `${n} visible`,
    noVisible: 'No visible members yet — be the first to turn on visibility in the group settings.',
    showMe: 'Show me in the list', hideMe: 'Hide me from the list', leave: 'Leave this group',
    typePlaceholder: 'Write a message…', send: 'Send', noMessages: 'No messages yet. Start the conversation!',
    report: 'Report', block: 'Block', reportReason: 'Describe the issue…', submitReport: 'Send report', reported: 'Report sent.',
    newActivity: '+ New activity', activityTitle: 'Title', activityDesc: 'Description (optional)', activityCategory: 'Category',
    activityLocation: 'Location (optional)', activityWhen: 'Date & time', activityCapacity: 'Limited spots (optional)',
    createActivity: 'Create activity', noActivities: 'No activities yet.', going: 'going', joinActivity: 'Join', leaveActivity: 'Leave',
    hostedBy: 'Hosted by', cancel: 'Cancel', addPin: 'Add a pin on the map (optional)', tapMap: 'Drag the map so the pin marks the spot.',
    cat_meetup: 'Meetup', cat_housing: 'Apartment hunting', cat_orientation: 'Orientation', cat_arrival: 'Arrival', cat_study: 'Study session', cat_other: 'Other',
    minAge: 'Min age (optional)', maxAge: 'Max age (optional)', joinPolicy: 'Who can join?', joinOpen: 'Open', joinPrivate: 'Private (needs approval)',
    requestPending: 'Request pending', requestJoin: 'Request to join',
  },
  ar: {
    back: 'العودة إلى المجتمع', members: 'الأعضاء', chat: 'الدردشة', activities: 'الأنشطة', map: 'الخريطة',
    loading: 'جارٍ التحميل…', visible: 'ظاهر', notMember: 'لست عضوًا في هذه المجموعة.',
    memberCount: (n) => `${n} عضو`, visibleCount: (n) => `${n} ظاهر`,
    noVisible: 'لا يوجد أعضاء ظاهرون بعد — كن أول من يفعّل الظهور في إعدادات المجموعة.',
    showMe: 'إظهاري في القائمة', hideMe: 'إخفائي من القائمة', leave: 'مغادرة هذه المجموعة',
    typePlaceholder: 'اكتب رسالة…', send: 'إرسال', noMessages: 'لا توجد رسائل بعد. ابدأ النقاش!',
    report: 'إبلاغ', block: 'حظر', reportReason: 'صف المشكلة…', submitReport: 'إرسال البلاغ', reported: 'تم إرسال البلاغ.',
    newActivity: '+ نشاط جديد', activityTitle: 'العنوان', activityDesc: 'الوصف (اختياري)', activityCategory: 'الفئة',
    activityLocation: 'المكان (اختياري)', activityWhen: 'التاريخ والوقت', activityCapacity: 'عدد الأماكن محدود (اختياري)',
    createActivity: 'إنشاء النشاط', noActivities: 'لا توجد أنشطة بعد.', going: 'مشارك', joinActivity: 'مشاركة', leaveActivity: 'إلغاء المشاركة',
    hostedBy: 'ينظمه', cancel: 'إلغاء', addPin: 'إضافة نقطة على الخريطة (اختياري)', tapMap: 'اسحب الخريطة لتحديد الموقع بالعلامة.',
    cat_meetup: 'لقاء', cat_housing: 'البحث عن سكن', cat_orientation: 'توجيه', cat_arrival: 'الوصول', cat_study: 'جلسة دراسة', cat_other: 'أخرى',
    minAge: 'الحد الأدنى للعمر (اختياري)', maxAge: 'الحد الأقصى للعمر (اختياري)', joinPolicy: 'من يمكنه المشاركة؟', joinOpen: 'مفتوح', joinPrivate: 'خاص (يتطلب موافقة)',
    requestPending: 'الطلب معلّق', requestJoin: 'طلب المشاركة',
  },
};

const CATEGORIES = ['meetup', 'housing', 'orientation', 'arrival', 'study', 'other'];

export default function CohortRoom() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const [group, setGroup] = useState(null);
  const [tab, setTab] = useState('members');
  const [loading, setLoading] = useState(true);
  const [blockedIds, setBlockedIds] = useState([]);

  const [members, setMembers] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [draft, setDraft] = useState('');
  const lastIdRef = useRef(null);
  const chatEndRef = useRef(null);

  const [activitiesList, setActivitiesList] = useState(null);
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', description: '', category: 'meetup', location: '', when: '', capacity: '', minAge: '', maxAge: '', joinPolicy: 'open' });
  const [wantsPin, setWantsPin] = useState(false);
  const [pinPosition, setPinPosition] = useState(null);
  const [rsvpBusy, setRsvpBusy] = useState(null);
  const [rsvpError, setRsvpError] = useState('');

  const [reportTarget, setReportTarget] = useState(null); // { userId, messageId }
  const [reportReason, setReportReason] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { navigate('/login'); return; }
    setLoading(true);
    community.groupById(groupId).then((res) => setGroup(res.data)).finally(() => setLoading(false));
    community.blockedIds().then((res) => setBlockedIds(res.data)).catch(() => setBlockedIds([]));
  }, [groupId, navigate]);

  useEffect(() => {
    if (tab === 'members' && members === null && group?.joined) {
      community.members(groupId).then((res) => setMembers(res.data)).catch(() => setMembers([]));
    }
    if (tab === 'activities' && activitiesList === null && group?.joined) {
      activitiesApi.forGroup(groupId).then((res) => setActivitiesList(res.data)).catch(() => setActivitiesList([]));
    }
  }, [tab, groupId, group, members, activitiesList]);

  // Poll chat only while the Chat tab is active.
  useEffect(() => {
    if (tab !== 'chat' || !group?.joined) return;
    let cancelled = false;
    const fetchNew = () => {
      community.messages(groupId, lastIdRef.current).then((res) => {
        if (cancelled || res.data.length === 0) return;
        setMessagesList((prev) => [...prev, ...res.data]);
        lastIdRef.current = res.data[res.data.length - 1].id;
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      });
    };
    fetchNew();
    const id = setInterval(fetchNew, 4000);
    return () => { cancelled = true; clearInterval(id); };
  }, [tab, groupId, group]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setDraft('');
    const res = await community.sendMessage(groupId, content);
    setMessagesList((prev) => [...prev, res.data]);
    lastIdRef.current = res.data.id;
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const toggleVisibility = async () => {
    const res = await community.setVisibility(groupId, !group.visible);
    setGroup(res.data);
    setMembers(null);
  };

  const leaveGroup = async () => {
    await community.leave(groupId);
    navigate('/community');
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    await community.report(reportTarget?.userId || null, reportTarget?.messageId || null, reportReason.trim());
    setReportStatus(t.reported);
    setReportReason('');
    setTimeout(() => { setReportTarget(null); setReportStatus(''); }, 1200);
  };

  const doBlock = async (userId) => {
    await community.block(userId);
    setBlockedIds((prev) => [...prev, userId]);
    setMessagesList((prev) => prev.filter((m) => m.userId !== userId));
    setMembers((prev) => (prev ? prev.filter((m) => m.userId !== userId) : prev));
  };

  const createActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.title.trim() || !newActivity.when) return;
    const payload = {
      title: newActivity.title.trim(),
      description: newActivity.description.trim() || null,
      category: newActivity.category,
      location: newActivity.location.trim() || null,
      lat: wantsPin && pinPosition ? pinPosition[0] : null,
      lng: wantsPin && pinPosition ? pinPosition[1] : null,
      scheduledAt: new Date(newActivity.when).toISOString(),
      capacity: newActivity.capacity ? Number(newActivity.capacity) : null,
      minAge: newActivity.minAge ? Number(newActivity.minAge) : null,
      maxAge: newActivity.maxAge ? Number(newActivity.maxAge) : null,
      joinPolicy: newActivity.joinPolicy,
    };
    const res = await activitiesApi.create(groupId, payload);
    setActivitiesList((prev) => [...(prev || []), res.data]);
    setShowNewActivity(false);
    setNewActivity({ title: '', description: '', category: 'meetup', location: '', when: '', capacity: '', minAge: '', maxAge: '', joinPolicy: 'open' });
    setWantsPin(false);
    setPinPosition(null);
  };

  // going=true on a "private" activity may come back with joinStatus
  // "pending" instead of an instant RSVP - see ActivityController.rsvp.
  const toggleRsvp = async (activity) => {
    setRsvpBusy(activity.id);
    setRsvpError('');
    try {
      const res = await activitiesApi.rsvp(activity.id, !activity.going);
      setActivitiesList((prev) => prev.map((a) => (a.id === activity.id ? res.data : a)));
    } catch (err) {
      setRsvpError(err.response?.data || '');
    } finally {
      setRsvpBusy(null);
    }
  };

  if (loading) return <div className="m-page"><p style={{ opacity: 0.6 }}>{t.loading}</p></div>;
  if (!group) return null;

  const Flag = FLAG_MAP[group.country];

  return (
    <div className="m-page">
      <Link to="/community" style={{ fontSize: 13, color: 'var(--m-navy-soft)', textDecoration: 'none' }}>← {t.back}</Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
        {Flag && <Flag size={26} />}
        <div>
          <div className="m-section-title" style={{ margin: 0 }}>{group.city}</div>
          <div style={{ fontSize: 12.5, opacity: 0.6 }}>{t.memberCount(group.memberCount)} · {t.visibleCount(group.visibleMemberCount)}</div>
        </div>
      </div>

      {!group.joined ? (
        <p style={{ fontSize: 13.5, opacity: 0.7, marginTop: 14 }}>{t.notMember}</p>
      ) : (
        <>
          <div className="m-uni-tabs" style={{ marginTop: 16 }}>
            {[['members', t.members], ['chat', t.chat], ['activities', t.activities], ['map', t.map]].map(([key, label]) => (
              <button key={key} type="button" className={'m-uni-tab' + (tab === key ? ' active' : '')} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'members' && (
            <div className="m-uni-tabpanel">
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, marginBottom: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={group.visible} onChange={toggleVisibility} />
                <span>{group.visible ? t.hideMe : t.showMe}</span>
              </label>

              {members === null && <p style={{ opacity: 0.6, fontSize: 13.5 }}>{t.loading}</p>}
              {members && members.length === 0 && <p style={{ opacity: 0.6, fontSize: 13.5 }}>{t.noVisible}</p>}
              {members && members.filter((m) => !blockedIds.includes(m.userId)).map((m) => {
                const OFlag = FLAG_MAP[m.originCountry];
                return (
                  <div key={m.userId} className="m-profile-row" style={{ marginBottom: 8 }}>
                    <span className="ic">{OFlag ? <OFlag size={17} /> : <IconUser size={17} />}</span>
                    <span className="lbl">
                      {m.displayName || '—'}
                      {(m.university || m.programType) && (
                        <span style={{ display: 'block', fontSize: 11.5, opacity: 0.6 }}>{[m.programType, m.university].filter(Boolean).join(' · ')}</span>
                      )}
                    </span>
                    <ReportBlock t={t} onReport={() => setReportTarget({ userId: m.userId })} onBlock={() => doBlock(m.userId)} />
                  </div>
                );
              })}

              <button type="button" className="btn btn-link p-0 mt-3" style={{ fontSize: 12.5, color: 'var(--m-pink)' }} onClick={leaveGroup}>
                {t.leave}
              </button>
            </div>
          )}

          {tab === 'chat' && (
            <div className="m-uni-tabpanel">
              <div className="m-chat-log">
                {messagesList.length === 0 && <p style={{ opacity: 0.55, fontSize: 13, textAlign: 'center' }}>{t.noMessages}</p>}
                {messagesList.filter((m) => !blockedIds.includes(m.userId)).map((m) => (
                  <div key={m.id} className="m-chat-message">
                    <div className="who">
                      {m.displayName || '—'}
                      <ReportBlock t={t} small onReport={() => setReportTarget({ userId: m.userId, messageId: m.id })} onBlock={() => doBlock(m.userId)} />
                    </div>
                    <div className="body">{m.content}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="m-chat-composer">
                <input className="form-control" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t.typePlaceholder} maxLength={1000} />
                <button type="submit" className="btn btn-dark btn-sm">{t.send}</button>
              </form>
            </div>
          )}

          {tab === 'activities' && (
            <div className="m-uni-tabpanel">
              <button type="button" className="btn btn-outline-dark btn-sm mb-3" onClick={() => setShowNewActivity((v) => !v)}>
                {showNewActivity ? t.cancel : t.newActivity}
              </button>

              {showNewActivity && (
                <form onSubmit={createActivity} className="m-activity-form">
                  <input className="form-control mb-2" placeholder={t.activityTitle} value={newActivity.title}
                    onChange={(e) => setNewActivity((s) => ({ ...s, title: e.target.value }))} required />
                  <textarea className="form-control mb-2" placeholder={t.activityDesc} rows={2} value={newActivity.description}
                    onChange={(e) => setNewActivity((s) => ({ ...s, description: e.target.value }))} />
                  <select className="form-select mb-2" value={newActivity.category}
                    onChange={(e) => setNewActivity((s) => ({ ...s, category: e.target.value }))}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{t['cat_' + c]}</option>)}
                  </select>
                  <input className="form-control mb-2" placeholder={t.activityLocation} value={newActivity.location}
                    onChange={(e) => setNewActivity((s) => ({ ...s, location: e.target.value }))} />
                  <input type="datetime-local" className="form-control mb-2" value={newActivity.when}
                    onChange={(e) => setNewActivity((s) => ({ ...s, when: e.target.value }))} required />
                  <input type="number" min="1" className="form-control mb-2" placeholder={t.activityCapacity} value={newActivity.capacity}
                    onChange={(e) => setNewActivity((s) => ({ ...s, capacity: e.target.value }))} />

                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input type="number" min="0" max="120" className="form-control" placeholder={t.minAge} value={newActivity.minAge}
                      onChange={(e) => setNewActivity((s) => ({ ...s, minAge: e.target.value }))} />
                    <input type="number" min="0" max="120" className="form-control" placeholder={t.maxAge} value={newActivity.maxAge}
                      onChange={(e) => setNewActivity((s) => ({ ...s, maxAge: e.target.value }))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">{t.joinPolicy}</label>
                    <select className="form-select" value={newActivity.joinPolicy}
                      onChange={(e) => setNewActivity((s) => ({ ...s, joinPolicy: e.target.value }))}>
                      <option value="open">{t.joinOpen}</option>
                      <option value="private">{t.joinPrivate}</option>
                    </select>
                  </div>

                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, marginBottom: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={wantsPin} onChange={(e) => setWantsPin(e.target.checked)} />
                    <span>{t.addPin}</span>
                  </label>
                  {wantsPin && (
                    <div className="mb-3">
                      <p style={{ fontSize: 11.5, opacity: 0.6, marginBottom: 6 }}>{t.tapMap}</p>
                      <ActivityMap activities={[]} country={group.country} city={group.city} height={220} pickMode="center"
                        onPick={(lat, lng) => setPinPosition([lat, lng])} pickedPosition={pinPosition} />
                    </div>
                  )}

                  <button type="submit" className="btn btn-dark w-100">{t.createActivity}</button>
                </form>
              )}

              {activitiesList === null && <p style={{ opacity: 0.6, fontSize: 13.5 }}>{t.loading}</p>}
              {activitiesList && activitiesList.length === 0 && <p style={{ opacity: 0.6, fontSize: 13.5 }}>{t.noActivities}</p>}
              {activitiesList && activitiesList.map((a) => (
                <div key={a.id} className="m-activity-card">
                  <div className="m-activity-cat">{t['cat_' + a.category] || a.category}</div>
                  <div className="m-activity-title">{a.title}</div>
                  {a.description && <div className="m-activity-desc">{a.description}</div>}
                  <div className="m-activity-meta">
                    {new Date(a.scheduledAt).toLocaleString(lang === 'ar' ? 'ar' : lang)}
                    {a.location && ` · ${a.location}`}
                  </div>
                  <div className="m-activity-meta">{t.hostedBy} {a.hostName} · {a.goingCount} {t.going}</div>
                  {a.joinStatus === 'pending' ? (
                    <button type="button" className="btn btn-sm mt-2" disabled style={{ opacity: 0.7 }}>{t.requestPending}</button>
                  ) : (
                    <button type="button" className={'btn btn-sm mt-2 ' + (a.going ? 'btn-outline-dark' : 'btn-dark')} disabled={rsvpBusy === a.id} onClick={() => toggleRsvp(a)}>
                      {a.going ? t.leaveActivity : (a.joinPolicy === 'private' ? t.requestJoin : t.joinActivity)}
                    </button>
                  )}
                </div>
              ))}
              {rsvpError && <p style={{ fontSize: 12, color: '#B23A3A', marginTop: 6 }}>{rsvpError}</p>}
            </div>
          )}

          {tab === 'map' && (
            <div className="m-uni-tabpanel">
              <ActivityMap activities={(activitiesList || []).filter((a) => a.lat != null && a.lng != null)} country={group.country} city={group.city} />
            </div>
          )}
        </>
      )}

      {reportTarget && (
        // No backdrop-dismiss here either - same reasoning as Explore.jsx's
        // wizard, kept consistent across every modal in this app now.
        <div className="m-report-overlay">
          <div className="m-report-modal" onClick={(e) => e.stopPropagation()}>
            <textarea className="form-control mb-2" rows={3} placeholder={t.reportReason} value={reportReason} onChange={(e) => setReportReason(e.target.value)} maxLength={500} />
            {reportStatus && <div className="alert alert-success py-2" style={{ fontSize: 13 }}>{reportStatus}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-dark btn-sm" onClick={submitReport}>{t.submitReport}</button>
              <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setReportTarget(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportBlock({ t, onReport, onBlock, small }) {
  return (
    <span style={{ display: 'inline-flex', gap: 8, marginInlineStart: small ? 8 : 'auto', fontSize: small ? 10.5 : 11.5, opacity: 0.55 }}>
      <button type="button" className="btn btn-link p-0" style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'underline' }} onClick={onReport}>{t.report}</button>
      <button type="button" className="btn btn-link p-0" style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'underline' }} onClick={onBlock}>{t.block}</button>
    </span>
  );
}
