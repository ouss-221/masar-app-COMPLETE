import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { activities as activitiesApi, community, auth } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { categoryFor } from '../data/activityCategories.js';
import { IconLock, IconUsers } from '../components/Icons.jsx';
import Avatar from '../components/Avatar.jsx';

// The activity's own chat room - reached by tapping an activity anywhere in
// the app (Explore's map popup, its list cards) and automatically right
// after creating one from the wizard (see Explore.jsx's submitWizard). Only
// the host and whoever has actually RSVP'd "going" can read or post here -
// see ActivityController.canAccessChat. A pending join request on a private
// activity gets a "waiting for approval" screen instead of the chat, and
// anyone else gets a join/request prompt. Same poll-based delivery pattern
// as CohortRoom's cohort-wide chat (GroupMessage), mirrored here for
// ActivityMessage.
const TEXT = {
  fr: {
    back: "Retour à l'exploration", loading: 'Chargement…', loadError: "Impossible de charger cette activité.",
    going: (n) => `${n} participant${n > 1 ? 's' : ''}`, private: 'Privé',
    ageBadge: (min, max) => min && max ? `${min}-${max} ans` : min ? `${min}+ ans` : `jusqu'à ${max} ans`,
    hostedBy: 'Organisé par', you: 'vous',
    reviewRequests: 'Gérer les demandes', hide: 'Masquer', noRequests: 'Aucune demande en attente.',
    approve: 'Accepter', decline: 'Refuser',
    pendingTitle: 'Demande envoyée', pendingBody: "L'hôte doit approuver votre demande avant que vous puissiez discuter ici.",
    joinTitle: 'Rejoignez pour discuter', joinBodyOpen: "Participez à cette activité pour voir et envoyer des messages dans son salon de discussion.",
    joinBodyPrivate: "Cette activité est privée. Envoyez une demande - une fois approuvée par l'hôte, vous pourrez discuter ici.",
    join: 'Participer', requestJoin: 'Demander à participer', joinError: "Impossible de rejoindre. Réessayez.",
    noMessages: 'Aucun message pour le moment. Lancez la discussion !',
    typePlaceholder: 'Écrivez un message…', send: 'Envoyer',
    report: 'Signaler', block: 'Bloquer', reportReason: 'Décrivez le problème…', submitReport: 'Envoyer le signalement',
    reported: 'Signalement envoyé.', cancel: 'Annuler',
  },
  en: {
    back: 'Back to Explore', loading: 'Loading…', loadError: "Couldn't load this activity.",
    going: (n) => `${n} going`, private: 'Private',
    ageBadge: (min, max) => min && max ? `${min}-${max}` : min ? `${min}+` : `up to ${max}`,
    hostedBy: 'Hosted by', you: 'you',
    reviewRequests: 'Review requests', hide: 'Hide', noRequests: 'No pending requests.',
    approve: 'Approve', decline: 'Decline',
    pendingTitle: 'Request sent', pendingBody: "The host needs to approve your request before you can chat here.",
    joinTitle: 'Join to chat', joinBodyOpen: "Join this activity to see and send messages in its chat room.",
    joinBodyPrivate: "This activity is private. Send a request - once the host approves it, you'll be able to chat here.",
    join: 'Join', requestJoin: 'Request to join', joinError: "Couldn't join. Please try again.",
    noMessages: 'No messages yet. Start the conversation!',
    typePlaceholder: 'Write a message…', send: 'Send',
    report: 'Report', block: 'Block', reportReason: 'Describe the issue…', submitReport: 'Send report',
    reported: 'Report sent.', cancel: 'Cancel',
  },
  ar: {
    back: 'العودة إلى الاستكشاف', loading: 'جارٍ التحميل…', loadError: 'تعذّر تحميل هذا النشاط.',
    going: (n) => `${n} مشارك`, private: 'خاص',
    ageBadge: (min, max) => min && max ? `${min}-${max}` : min ? `+${min}` : `حتى ${max}`,
    hostedBy: 'ينظمه', you: 'أنت',
    reviewRequests: 'مراجعة الطلبات', hide: 'إخفاء', noRequests: 'لا توجد طلبات معلّقة.',
    approve: 'قبول', decline: 'رفض',
    pendingTitle: 'تم إرسال الطلب', pendingBody: 'يجب أن يوافق المنظّم على طلبك قبل أن تتمكن من الدردشة هنا.',
    joinTitle: 'انضم للدردشة', joinBodyOpen: 'انضم إلى هذا النشاط لمشاهدة وإرسال الرسائل في غرفة الدردشة الخاصة به.',
    joinBodyPrivate: 'هذا النشاط خاص. أرسل طلبًا - بعد موافقة المنظّم عليه، ستتمكن من الدردشة هنا.',
    join: 'مشاركة', requestJoin: 'طلب المشاركة', joinError: 'تعذّر الانضمام. حاول مرة أخرى.',
    noMessages: 'لا توجد رسائل بعد. ابدأ النقاش!',
    typePlaceholder: 'اكتب رسالة…', send: 'إرسال',
    report: 'إبلاغ', block: 'حظر', reportReason: 'صف المشكلة…', submitReport: 'إرسال البلاغ',
    reported: 'تم إرسال البلاغ.', cancel: 'إلغاء',
  },
};

export default function ActivityChat() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [myId, setMyId] = useState(null);
  const [blockedIds, setBlockedIds] = useState([]);

  const [messagesList, setMessagesList] = useState([]);
  const [draft, setDraft] = useState('');
  const lastIdRef = useRef(null);
  const chatEndRef = useRef(null);

  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [rsvpError, setRsvpError] = useState('');

  const [joinRequestsList, setJoinRequestsList] = useState(null);
  const [showRequests, setShowRequests] = useState(false);

  const [reportTarget, setReportTarget] = useState(null); // { userId, messageId }
  const [reportReason, setReportReason] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { navigate('/login'); return; }
    auth.me().then((res) => setMyId(res.data.id)).catch(() => {});
    community.blockedIds().then((res) => setBlockedIds(res.data)).catch(() => setBlockedIds([]));
  }, [navigate]);

  const loadActivity = () => {
    setLoading(true);
    setLoadError('');
    activitiesApi.get(activityId).then((res) => setActivity(res.data))
      .catch(() => setLoadError(t.loadError))
      .finally(() => setLoading(false));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadActivity, [activityId]);

  const canChat = !!activity && (activity.host || activity.joinStatus === 'going');

  // Poll chat only once access is actually unlocked - same 4s cadence as
  // CohortRoom's cohort-wide chat.
  useEffect(() => {
    if (!canChat) return;
    let cancelled = false;
    const fetchNew = () => {
      activitiesApi.chatMessages(activityId, lastIdRef.current).then((res) => {
        if (cancelled || res.data.length === 0) return;
        setMessagesList((prev) => [...prev, ...res.data]);
        lastIdRef.current = res.data[res.data.length - 1].id;
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      });
    };
    fetchNew();
    const id = setInterval(fetchNew, 4000);
    return () => { cancelled = true; clearInterval(id); };
  }, [canChat, activityId]);

  // The host of a private activity can approve/decline right from their own
  // chat room, instead of having to go back to the Explore list for it.
  useEffect(() => {
    if (activity?.host && activity?.joinPolicy === 'private') {
      activitiesApi.joinRequests(activityId).then((res) => setJoinRequestsList(res.data)).catch(() => setJoinRequestsList([]));
    }
  }, [activity?.host, activity?.joinPolicy, activityId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setDraft('');
    const res = await activitiesApi.sendChatMessage(activityId, content);
    setMessagesList((prev) => [...prev, res.data]);
    lastIdRef.current = res.data.id;
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const doJoin = async () => {
    setRsvpBusy(true);
    setRsvpError('');
    try {
      await activitiesApi.rsvp(activityId, true);
      loadActivity();
    } catch (err) {
      setRsvpError(err.response?.data || t.joinError);
    } finally {
      setRsvpBusy(false);
    }
  };

  const decideRequest = async (requestId, approve) => {
    try {
      if (approve) await activitiesApi.approveJoinRequest(requestId);
      else await activitiesApi.declineJoinRequest(requestId);
      const res = await activitiesApi.joinRequests(activityId);
      setJoinRequestsList(res.data);
      loadActivity();
    } catch {
      // leave the panel as-is - the host can retry
    }
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
  };

  if (loading) return <div className="m-page"><p className="m-page-loading">{t.loading}</p></div>;

  if (loadError || !activity) {
    return (
      <div className="m-page">
        <Link to="/map" className="m-chatroom-back">← {t.back}</Link>
        <p className="m-page-error">{loadError || t.loadError}</p>
      </div>
    );
  }

  const cat = categoryFor(activity.category);

  return (
    <div className="m-page" style={{ paddingBottom: 8 }}>
      <Link to="/map" className="m-chatroom-back">← {t.back}</Link>

      <div className="m-chatroom-header">
        <span className="m-chatroom-cat" style={{ background: cat.color, color: '#fff' }}>
          {cat.emoji} {cat.label[lang] || cat.label.en}
        </span>
        <h1 className="m-chatroom-title">{activity.title}</h1>
        {activity.description && <p className="m-chatroom-desc">{activity.description}</p>}
        <div className="m-chatroom-meta">
          {new Date(activity.scheduledAt).toLocaleString(lang === 'ar' ? 'ar' : lang)}
          {activity.location && ` · ${activity.location}`}
        </div>
        <div className="m-chatroom-meta-row">
          <span className="m-chatroom-going"><IconUsers size={13} /> {t.going(activity.goingCount)}</span>
          {activity.joinPolicy === 'private' && (
            <span className="m-badge-pill m-badge-private"><IconLock size={10} /> {t.private}</span>
          )}
          {(activity.minAge || activity.maxAge) && (
            <span className="m-badge-pill m-badge-age">{t.ageBadge(activity.minAge, activity.maxAge)}</span>
          )}
        </div>
        <div className="m-chatroom-host">
          <Avatar userId={activity.hostId} name={activity.hostName} size={18} />
          {t.hostedBy} <strong>{activity.hostName}</strong>
          {activity.host && <span className="m-chatroom-you">({t.you})</span>}
        </div>
      </div>

      {activity.host && activity.joinPolicy === 'private' && (
        <div className="m-chatroom-requests">
          <button type="button" className="m-link-btn" onClick={() => setShowRequests((v) => !v)}>
            {showRequests ? t.hide : t.reviewRequests}
            {joinRequestsList && joinRequestsList.length > 0 ? ` (${joinRequestsList.length})` : ''}
          </button>
          {showRequests && (
            <div className="m-request-panel">
              {(joinRequestsList || []).length === 0 && <p className="m-request-empty">{t.noRequests}</p>}
              {(joinRequestsList || []).map((r) => (
                <div key={r.id} className="m-request-row">
                  <span className="m-request-name">
                    <Avatar userId={r.userId} name={r.userName} size={22} />
                    {r.userName}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" className="btn btn-dark btn-sm" onClick={() => decideRequest(r.id, true)}>{t.approve}</button>
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => decideRequest(r.id, false)}>{t.decline}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!canChat && activity.joinStatus === 'pending' && (
        <div className="m-chatroom-gate">
          <p className="m-chatroom-gate-title">{t.pendingTitle}</p>
          <p className="m-chatroom-gate-body">{t.pendingBody}</p>
        </div>
      )}

      {!canChat && activity.joinStatus !== 'pending' && (
        <div className="m-chatroom-gate">
          <p className="m-chatroom-gate-title">{t.joinTitle}</p>
          <p className="m-chatroom-gate-body">{activity.joinPolicy === 'private' ? t.joinBodyPrivate : t.joinBodyOpen}</p>
          {rsvpError && <p className="m-page-error">{rsvpError}</p>}
          <button type="button" className="btn btn-dark" disabled={rsvpBusy} onClick={doJoin}>
            {activity.joinPolicy === 'private' ? t.requestJoin : t.join}
          </button>
        </div>
      )}

      {canChat && (
        <div className="m-chatroom-chat">
          <div className="m-chat-log">
            {messagesList.length === 0 && <p className="m-chatroom-empty">{t.noMessages}</p>}
            {messagesList.filter((m) => !blockedIds.includes(m.userId)).map((m) => {
              const own = m.userId === myId;
              return (
                <div key={m.id} className={'m-chat-message' + (own ? ' own' : '')}>
                  {!own && (
                    <div className="who">
                      <Avatar userId={m.userId} name={m.displayName} size={16} />
                      {m.displayName}
                      <ReportBlock t={t} small onReport={() => setReportTarget({ userId: m.userId, messageId: m.id })} onBlock={() => doBlock(m.userId)} />
                    </div>
                  )}
                  <div className="body">{m.content}</div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="m-chat-composer">
            <input className="m-chat-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t.typePlaceholder} maxLength={1000} aria-label={t.typePlaceholder} />
            <button type="submit" className="m-chat-send" disabled={!draft.trim()}>{t.send}</button>
          </form>
        </div>
      )}

      {reportTarget && (
        // No backdrop-dismiss - same reasoning as Explore.jsx's wizard and
        // CohortRoom's own report modal, kept consistent across the app.
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
