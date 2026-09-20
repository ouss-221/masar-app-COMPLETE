import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, checklist as checklistApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { LANGUAGES } from '../i18n/translations.js';

export default function Profile() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [checklistItems, setChecklistItems] = useState([]);
  const userEmail = localStorage.getItem('masar_user_email');
  const userName = localStorage.getItem('masar_user_name');
  const userCity = localStorage.getItem('masar_user_city');
  const loggedIn = !!localStorage.getItem('masar_access_token');

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
        <div className="m-section-title" style={{ marginTop: 20 }}>Profile</div>
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>
          Log in to save your checklist progress and personalize your guide.
        </p>
        <button className="btn btn-dark w-100" onClick={() => navigate('/login')}>Log in / Sign up</button>
      </div>
    );
  }

  return (
    <div className="m-page">
      <div className="m-section-title" style={{ marginTop: 10 }}>Profile</div>

      <div className="m-profile-avatar">{initial}</div>
      <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16 }}>{userName || 'Masar user'}</div>
      <div style={{ textAlign: 'center', fontSize: 13, opacity: 0.6 }}>{userEmail}</div>

      <div className="m-profile-stats">
        <div className="m-profile-stat">
          <div className="n">{done}</div>
          <div className="l">Checklist done</div>
        </div>
        <div className="m-profile-stat">
          <div className="n">{userCity || '—'}</div>
          <div className="l">Target city</div>
        </div>
        <div className="m-profile-stat">
          <div className="n">3</div>
          <div className="l">Countries explored</div>
        </div>
      </div>

      <div className="m-profile-menu">
        <div className="m-profile-row">
          <span className="ic">🌐</span>
          <span className="lbl">Language</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ border: 'none', background: 'none', fontSize: 13, color: 'var(--m-navy-soft)' }}
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>
        </div>
        <div className="m-profile-row" onClick={() => navigate('/forgot-password')}>
          <span className="ic">🔒</span>
          <span className="lbl">Change password</span>
          <span className="chev">›</span>
        </div>
        <div className="m-profile-row">
          <span className="ic">❓</span>
          <span className="lbl">Help & Support</span>
          <span className="chev">›</span>
        </div>
        <div className="m-profile-row">
          <span className="ic">ℹ️</span>
          <span className="lbl">About Masar</span>
          <span className="chev">›</span>
        </div>
      </div>

      <button className="m-logout-btn" onClick={logout}>Log out</button>
    </div>
  );
}
