import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, checklist as checklistApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { LANGUAGES } from '../i18n/translations.js';
import { getFavorites } from '../utils/favorites.js';
import { IconGlobe, IconUser, IconClipboard, IconCap, IconInfo, IconChevronRight } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    title: 'Profil', loginPrompt: 'Connectez-vous pour sauvegarder votre progression et personnaliser votre guide.',
    loginBtn: 'Se connecter / Créer un compte', checklistDone: 'Checklist terminée', savedUnis: 'Universités sauvegardées',
    personalInfo: 'Informations personnelles', myChecklist: 'Ma checklist', settings: 'Paramètres', language: 'Langue',
    help: 'Aide & Support', about: 'À propos de Masar', logout: 'Se déconnecter', guestUser: 'Utilisateur Masar',
  },
  en: {
    title: 'Profile', loginPrompt: 'Log in to save your checklist progress and personalize your guide.',
    loginBtn: 'Log in / Sign up', checklistDone: 'Checklist done', savedUnis: 'Saved Universities',
    personalInfo: 'Personal Information', myChecklist: 'My Checklist', settings: 'Settings', language: 'Language',
    help: 'Help & Support', about: 'About Masar', logout: 'Log out', guestUser: 'Masar user',
  },
  ar: {
    title: 'الملف الشخصي', loginPrompt: 'سجّل الدخول لحفظ تقدمك وتخصيص دليلك.',
    loginBtn: 'تسجيل الدخول / إنشاء حساب', checklistDone: 'المهام المنجزة', savedUnis: 'الجامعات المحفوظة',
    personalInfo: 'المعلومات الشخصية', myChecklist: 'قائمتي', settings: 'الإعدادات', language: 'اللغة',
    help: 'المساعدة والدعم', about: 'عن مسار', logout: 'تسجيل الخروج', guestUser: 'مستخدم مسار',
  },
};

export default function Profile() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [checklistItems, setChecklistItems] = useState([]);
  const userEmail = localStorage.getItem('masar_user_email');
  const userName = localStorage.getItem('masar_user_name');
  const loggedIn = !!localStorage.getItem('masar_access_token');
  const t = TEXT[lang] || TEXT.en;
  const savedCount = getFavorites().length;

  useEffect(() => {
    if (!loggedIn) return;
    checklistApi.mine().then((res) => setChecklistItems(res.data)).catch(() => setChecklistItems([]));
  }, [loggedIn]);

  const done = checklistItems.filter((i) => i.done).length;

  const logout = async () => {
    await auth.logout();
    navigate('/');
    window.location.reload();
  };

  const initial = (userName || userEmail || '?').charAt(0).toUpperCase();

  if (!loggedIn) {
    return (
      <div className="m-page">
        <div className="m-section-title" style={{ marginTop: 20 }}>{t.title}</div>
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>{t.loginPrompt}</p>
        <button className="btn btn-dark w-100" onClick={() => navigate('/login')}>{t.loginBtn}</button>
      </div>
    );
  }

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>

      <div className="m-profile-avatar">{initial}</div>
      <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16 }}>{userName || t.guestUser}</div>
      <div style={{ textAlign: 'center', fontSize: 13, opacity: 0.6 }}>{userEmail}</div>

      <div className="m-profile-stats">
        <div className="m-profile-stat">
          <div className="n">{done}</div>
          <div className="l">{t.checklistDone}</div>
        </div>
        <div className="m-profile-stat">
          <div className="n">{savedCount}</div>
          <div className="l">{t.savedUnis}</div>
        </div>
      </div>

      <div className="m-profile-menu">
        <Link to="/profile/personal-info" className="m-profile-row">
          <span className="ic"><IconUser size={17} /></span>
          <span className="lbl">{t.personalInfo}</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
        <Link to="/checklist" className="m-profile-row">
          <span className="ic"><IconClipboard size={17} /></span>
          <span className="lbl">{t.myChecklist}</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
        <Link to="/universities" className="m-profile-row">
          <span className="ic"><IconCap size={17} /></span>
          <span className="lbl">{t.savedUnis} ({savedCount})</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
      </div>

      <div className="m-profile-menu">
        <div className="m-profile-row">
          <span className="ic"><IconGlobe size={16} /></span>
          <span className="lbl">{t.language}</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ border: 'none', background: 'none', fontSize: 13, color: 'var(--m-navy-soft)' }}
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
        <Link to="/profile/personal-info" className="m-profile-row">
          <span className="ic"><IconUser size={16} /></span>
          <span className="lbl">{TEXT[lang]?.settings || 'Settings'}</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
        <Link to="/profile/help" className="m-profile-row">
          <span className="ic"><IconInfo size={16} /></span>
          <span className="lbl">{t.help}</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
        <Link to="/profile/about" className="m-profile-row">
          <span className="ic"><IconInfo size={16} /></span>
          <span className="lbl">{t.about}</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
      </div>

      <button className="m-logout-btn" onClick={logout}>{t.logout}</button>
    </div>
  );
}
