import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checklist as checklistApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { pickGroupName, pickItemText } from '../i18n/pick.js';
import { useDestination } from '../i18n/DestinationContext.jsx';
import { IconCheck, IconChevronRight } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    title: 'Votre progression', sub: "Voici où vous en êtes dans votre préparation.",
    completed: 'complété', nextStep: 'Prochaine étape', allDone: "Tout est fait — beau travail !",
    quote: "Chaque grand voyage commence par une seule étape. Continuez comme ça.",
    viewChecklist: 'Voir toute la checklist', notLoggedIn: 'Connectez-vous pour suivre votre progression.',
  },
  en: {
    title: 'Your progress', sub: "Here's where you stand in your preparation.",
    completed: 'completed', nextStep: 'Next step', allDone: 'All done — great work!',
    quote: 'Every great journey starts with a single step. Keep going.',
    viewChecklist: 'View full checklist', notLoggedIn: 'Log in to track your progress.',
  },
  ar: {
    title: 'تقدّمك', sub: 'إليك أين وصلت في تحضيراتك.',
    completed: 'مكتمل', nextStep: 'الخطوة التالية', allDone: 'كل شيء جاهز — عمل رائع!',
    quote: 'كل رحلة عظيمة تبدأ بخطوة واحدة. واصل التقدم.',
    viewChecklist: 'عرض القائمة كاملة', notLoggedIn: 'سجّل الدخول لتتبع تقدمك.',
  },
};

export default function Progress() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const { country } = useDestination();
  const t = TEXT[lang] || TEXT.en;
  const loggedIn = !!localStorage.getItem('masar_access_token');

  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    setLoading(true);
    checklistApi.mine(country).then((res) => setItems(res.data)).catch(() => setItems([])).finally(() => setLoading(false));
  }, [country, loggedIn]);

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const nextItem = items.find((i) => !i.done);

  const r = 66;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  if (!loggedIn) {
    return (
      <div className="m-page">
        <div className="m-section-title" style={{ marginTop: 20 }}>{t.title}</div>
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>{t.notLoggedIn}</p>
        <Link to="/login" className="btn btn-dark w-100" style={{ textAlign: 'center', display: 'block' }}>{TEXT[lang] === TEXT.ar ? 'تسجيل الدخول' : 'Log in'}</Link>
      </div>
    );
  }

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <div className="m-section-sub">{t.sub}</div>

      {loading ? (
        <p style={{ opacity: 0.6, fontSize: 14 }}>Loading…</p>
      ) : (
        <>
          <div className="m-progress-ring-wrap">
            <svg width={160} height={160} viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none" stroke="var(--m-line)" strokeWidth="12" />
              <circle
                cx="80" cy="80" r={r} fill="none" stroke="var(--m-teal)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`} transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="m-progress-ring-label">
              <div className="pct">{pct}%</div>
              <div className="sub">{done}/{total} {t.completed}</div>
            </div>
          </div>

          <div className="m-progress-quote">{t.quote}</div>

          {nextItem ? (
            <div className="m-progress-next">
              <div className="m-progress-next-icon"><IconCheck size={16} /></div>
              <div style={{ flex: 1 }}>
                <div className="m-progress-next-label">{t.nextStep}</div>
                <div className="m-progress-next-text">{pickItemText(nextItem, lang)}</div>
                <div className="m-progress-next-group">{pickGroupName(nextItem, lang)}</div>
              </div>
            </div>
          ) : total > 0 ? (
            <div className="m-progress-next" style={{ justifyContent: 'center', textAlign: 'center' }}>
              <span className="m-progress-next-text">{t.allDone}</span>
            </div>
          ) : null}

          <Link to="/checklist" className="m-progress-view-link">
            {t.viewChecklist} <IconChevronRight size={15} />
          </Link>
        </>
      )}
    </div>
  );
}
