import { useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../i18n/translations.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const WELCOME_LINES = {
  fr: 'Bienvenue sur Masar',
  en: 'Welcome to Masar',
  ar: 'مرحبًا بك في مسار',
};

export default function Welcome() {
  const { setLang } = useLanguage();
  const navigate = useNavigate();

  const choose = (code) => {
    setLang(code);
    navigate('/', { replace: true });
  };

  return (
    <div className="masar-welcome">
      <div className="masar-welcome-card">
        <div className="masar-welcome-mark">مسار</div>

        {Object.values(WELCOME_LINES).map((line, i) => (
          <div key={i} className="masar-welcome-title-line">{line}</div>
        ))}

        <div className="masar-welcome-sub">
          Choose your language · Choisissez votre langue · اختر لغتك
        </div>

        <div className="masar-lang-grid">
          {LANGUAGES.map((l) => (
            <button key={l.code} className="masar-lang-btn" onClick={() => choose(l.code)}>
              <span className="masar-lang-flag">{l.flag}</span>
              <span className="masar-lang-label">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
