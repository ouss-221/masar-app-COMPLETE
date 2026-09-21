import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useDestination, COUNTRIES } from '../i18n/DestinationContext.jsx';
import { CITIES_BY_COUNTRY, PROGRAMS, ORIGIN_COUNTRIES } from '../data/profileOptions.js';

// Same free, real Unsplash photo used on the splash screen, for a consistent
// "photo hero" feel between Welcome and Login rather than a plain form page.
const LOGIN_PHOTO = 'https://images.unsplash.com/photo-1766704094335-b7f8e6e7930f';

const TEXT = {
  fr: {
    login: 'Connexion', register: 'Créer votre compte',
    loginSub: 'Nécessaire pour sauvegarder votre progression entre vos visites.',
    registerSub: "Quelques détails rapides pour personnaliser votre guide.",
    name: 'Nom', originCountry: "Vous venez d'où ?", origOptional: '(optionnel, pour vous connecter à votre communauté)',
    country: 'Pays cible', city: 'Ville cible', notSure: 'Pas encore sûr(e)', university: 'Université', programType: 'Type de programme',
    email: 'E-mail', password: 'Mot de passe', forgot: 'Mot de passe oublié ?', submitLogin: 'Se connecter',
    submitRegister: 'Créer le compte', wait: 'Un instant…', noAccount: "Pas de compte ?", createOne: 'Créer un compte',
    haveAccount: 'Vous avez déjà un compte ?',
  },
  en: {
    login: 'Log in', register: 'Create your account',
    loginSub: 'Needed to save your checklist progress across visits.',
    registerSub: 'A couple of quick details so the guide can be more specific to your move.',
    name: 'Name', originCountry: "Where are you moving from?", origOptional: '(optional, connects you to your community)',
    country: 'Target country', city: 'Target city', notSure: 'Not sure yet', university: 'University', programType: 'Program type',
    email: 'Email', password: 'Password', forgot: 'Forgot your password?', submitLogin: 'Log in',
    submitRegister: 'Create account', wait: 'Please wait…', noAccount: "Don't have an account?", createOne: 'Create one',
    haveAccount: 'Already have an account?',
  },
  ar: {
    login: 'تسجيل الدخول', register: 'إنشاء حسابك',
    loginSub: 'ضروري لحفظ تقدمك بين الزيارات.',
    registerSub: 'بعض التفاصيل السريعة لتخصيص دليلك.',
    name: 'الاسم', originCountry: 'من أين أنت قادم؟', origOptional: '(اختياري، يربطك بمجتمعك)',
    country: 'البلد المستهدف', city: 'المدينة المستهدفة', notSure: 'غير متأكد بعد', university: 'الجامعة', programType: 'نوع البرنامج',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', forgot: 'نسيت كلمة المرور؟', submitLogin: 'تسجيل الدخول',
    submitRegister: 'إنشاء الحساب', wait: 'لحظة من فضلك…', noAccount: 'ليس لديك حساب؟', createOne: 'أنشئ حسابًا',
    haveAccount: 'هل لديك حساب بالفعل؟',
  },
};

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const { country: browsingCountry, setCountry: setBrowsingCountry } = useDestination();
  // Pre-filled with whatever destination they're already browsing (set via the
  // flag picker on Home/splash), since that's almost always what they mean -
  // but they can still change it, or leave it unset via "Not sure yet".
  const [targetCountry, setTargetCountry] = useState(browsingCountry || '');
  const [targetCity, setTargetCity] = useState('');
  const [university, setUniversity] = useState('');
  const [programType, setProgramType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const cityOptions = targetCountry ? (CITIES_BY_COUNTRY[targetCountry] || []) : [];

  const onCountryChange = (code) => {
    setTargetCountry(code);
    setTargetCity(''); // a city picked for the old country wouldn't make sense for the new one
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await auth.login(email, password);
      } else {
        await auth.register(email, password, displayName, originCountry, targetCountry, targetCity, university, programType);
        // Keep the app's active destination (guide content, checklist, etc.)
        // in sync with what they just told us they're aiming for.
        if (targetCountry) setBrowsingCountry(targetCountry);
      }
      navigate('/checklist');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data || 'Something went wrong. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="m-login-hero"
        style={{
          backgroundImage:
            `linear-gradient(180deg, rgba(10,32,46,0.15) 0%, rgba(8,22,34,0.55) 75%, var(--m-bg) 100%), ` +
            `url(${LOGIN_PHOTO}?auto=format&fit=crop&w=1200&q=80)`,
        }}
      >
        <div className="m-login-hero-title">{mode === 'login' ? t.login : t.register}</div>
      </div>

      <div className="m-page" style={{ marginTop: -34, position: 'relative', zIndex: 1 }}>
        <div className="m-login-card">
          <p style={{ fontSize: 13.5, color: 'var(--m-navy-soft)', marginBottom: 18 }}>
            {mode === 'login' ? t.loginSub : t.registerSub}
          </p>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <>
                <div className="mb-3">
                  <label className="form-label small">{t.name}</label>
                  <input className="form-control" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small">{t.originCountry} <span style={{ opacity: 0.55, fontWeight: 400 }}>{t.origOptional}</span></label>
                  <select className="form-select" value={originCountry} onChange={(e) => setOriginCountry(e.target.value)}>
                    <option value="">{t.notSure}</option>
                    {ORIGIN_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.label[lang] || c.label.en}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small">{t.country}</label>
                  <select className="form-select" value={targetCountry} onChange={(e) => onCountryChange(e.target.value)}>
                    <option value="">{t.notSure}</option>
                    {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.label}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small">{t.city}</label>
                  <select className="form-select" value={targetCity} onChange={(e) => setTargetCity(e.target.value)} disabled={!targetCountry}>
                    <option value="">{t.notSure}</option>
                    {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small">{t.university}</label>
                  <input className="form-control" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. Universidad de Granada" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">{t.programType}</label>
                  <select className="form-select" value={programType} onChange={(e) => setProgramType(e.target.value)}>
                    <option value="">{t.notSure}</option>
                    {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label small">{t.email}</label>
              <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label small">{t.password}</label>
              <input type="password" required minLength={6} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {mode === 'login' && (
              <div className="mb-3" style={{ fontSize: 13, textAlign: 'right' }}>
                <a href="/forgot-password">{t.forgot}</a>
              </div>
            )}

            {error && <div className="alert alert-danger py-2" style={{ fontSize: 13.5 }}>{String(error)}</div>}

            <button type="submit" className="btn btn-dark w-100" disabled={loading}>
              {loading ? t.wait : mode === 'login' ? t.submitLogin : t.submitRegister}
            </button>
          </form>

          <div className="mt-3" style={{ fontSize: 13.5 }}>
            {mode === 'login' ? (
              <>{t.noAccount} <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>{t.createOne}</a></>
            ) : (
              <>{t.haveAccount} <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>{TEXT[lang]?.login || 'Log in'}</a></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
