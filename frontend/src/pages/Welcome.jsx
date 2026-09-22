import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../i18n/translations.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useNationality, NATIONALITIES } from '../i18n/NationalityContext.jsx';
import { useDestination, COUNTRIES } from '../i18n/DestinationContext.jsx';
import { IconArrowRight, IconGlobe, IconChevronDown, IconMasarMark, IconCheck } from '../components/Icons.jsx';
import { FLAG_MAP } from '../components/Flags.jsx';

// The two dark onboarding steps use the exact gradients from the approved
// design concept - a radial orange glow over an indigo-to-black wash - not
// a photo. The glow sits in a different corner for each step (matches
// Onboard1Splash.dc.html / Onboard2Welcome.dc.html exactly).
const SPLASH_BG = 'radial-gradient(circle at 78% 14%, rgba(255,75,43,0.55) 0%, transparent 42%), linear-gradient(165deg, #2B2250 0%, #17112E 45%, #0B0818 100%)';
const WELCOME_BG = 'radial-gradient(circle at 20% 86%, rgba(255,75,43,0.5) 0%, transparent 46%), linear-gradient(180deg, #2B2250 0%, #17112E 55%, #0B0818 100%)';

// Chrome-only strings for this onboarding flow - kept local instead of in
// the shared translations.js since nothing else reuses them.
const TEXT = {
  fr: {
    splashTag: 'De l’Afrique du Nord vers l’Europe — et ouvert à tous les étudiants en chemin.',
    begin: 'Commencer votre parcours',
    tagline1: 'De l’Afrique du Nord vers l’Europe',
    tagline2: 'Votre voyage. Notre accompagnement.',
    welcomeNote: 'Pour les étudiants de partout, vers partout — le guide est adapté, la communauté est ouverte à tous.',
    start: 'Commencer',
    already: 'Vous avez déjà un compte ?',
    login: 'Connexion',
    purposeTitle: 'Qu’est-ce qui vous amène sur MASAR ?',
    purposeSub: 'Choisissez ce qui vous correspond le mieux — vous pourrez tout explorer plus tard.',
    purposeStudy: 'Partir étudier',
    purposeStudyDesc: 'Votre guide pour la France, l’Espagne et l’Italie — visas, logement, universités et plus.',
    purposeSocial: 'Rencontrer d’autres étudiants',
    purposeSocialDesc: 'Rejoignez la communauté — d’où que vous veniez ou où que vous alliez.',
    purposeExplore: 'Juste regarder',
    purposeExploreDesc: 'Explorez et décidez plus tard.',
    originTitle: 'D’où venez-vous ?',
    originSub: 'On adaptera le guide à vos démarches. Pas l’un de ces trois pays ? Pas de souci.',
    originOther: 'Ailleurs',
    destTitle: 'Où allez-vous ?',
    destSub: 'On personnalisera votre accueil et vous mettra en lien avec des étudiants qui font le même chemin.',
    destUnsure: 'Pas encore sûr',
    destUnsureDesc: 'Je regarde pour l’instant',
    continueBtn: 'Continuer',
    skip: 'Passer pour l’instant',
    enter: 'Entrer sur MASAR',
  },
  en: {
    splashTag: 'From North Africa to Europe — and open to every student along the way.',
    begin: 'Begin your path',
    tagline1: 'From North Africa to Europe',
    tagline2: 'Your journey. Our support.',
    welcomeNote: 'For students from anywhere, heading anywhere — the guide is tailored, the community is open to all.',
    start: 'Get Started',
    already: 'Already have an account?',
    login: 'Log in',
    purposeTitle: 'What brings you to MASAR?',
    purposeSub: 'Pick what fits best — you can always explore everything later.',
    purposeStudy: 'Studying abroad',
    purposeStudyDesc: 'Your guide to France, Spain & Italy — visas, housing, unis and more.',
    purposeSocial: 'Meeting other students',
    purposeSocialDesc: 'Join the community — wherever you’re from or headed.',
    purposeExplore: 'Just exploring',
    purposeExploreDesc: 'Look around and decide later.',
    originTitle: 'Where are you from?',
    originSub: 'We’ll tailor the guide to your paperwork. Not from these three? No problem.',
    originOther: 'Somewhere else',
    destTitle: 'Where are you headed?',
    destSub: 'We’ll set your home feed and connect you with students going the same way.',
    destUnsure: 'Not sure yet',
    destUnsureDesc: 'Just browsing for now',
    continueBtn: 'Continue',
    skip: 'Skip for now',
    enter: 'Enter MASAR',
  },
  ar: {
    splashTag: 'من شمال أفريقيا إلى أوروبا — ومفتوحة لكل طالب في الطريق.',
    begin: 'ابدأ مسارك',
    tagline1: 'من شمال أفريقيا إلى أوروبا',
    tagline2: 'رحلتك. دعمنا لك.',
    welcomeNote: 'للطلبة من أي مكان، إلى أي وجهة — الدليل مخصص، والمجتمع مفتوح للجميع.',
    start: 'ابدأ الآن',
    already: 'هل لديك حساب بالᡌفعل؟',
    login: 'تسجيل الدخول',
    purposeTitle: 'ما الذي يجلبك إلى MASAR؟',
    purposeSub: 'اختر ما يناسبك أكثر — يمكنك دائمًا استكشاف كل شيء لاحقًا.',
    purposeStudy: 'الدراسة في الخارج',
    purposeStudyDesc: 'دليلك إلى فرنسا وإسبانيا وإيطاليا — تأشيرات، سكن، جامعات وأكثر.',
    purposeSocial: 'التعرف على طلبة آخرين',
    purposeSocialDesc: 'انضم إلى المجتمع — أيا كان أصلك أو وجهتك.',
    purposeExplore: 'مجرد استكشاف',
    purposeExploreDesc: 'تصفح وقرر لاحقًا.',
    originTitle: 'من أين أنت؟',
    originSub: 'سنكيف الدليل حسب إجراءاتك. لست من هذه الدول الثلاث؟ لا مشكلة.',
    originOther: 'مكان آخر',
    destTitle: 'إلى أين أنت ذاهب؟',
    destSub: 'سنقوم بتخصيص صفحتك الرئيسية وربطك بطلبة يسلكون نفس الطريق.',
    destUnsure: 'لست متأكدًا بعد',
    destUnsureDesc: 'أتصفح فقط حاليًا',
    continueBtn: 'متابعة',
    skip: 'تخطي حاليًا',
    enter: 'ادخل إلى MASAR',
  },
};

const PURPOSES = [
  { code: 'study', emoji: '\u{1F393}' },
  { code: 'social', emoji: '\u{1F91D}' },
  { code: 'explore', emoji: '\u{1F9ED}' },
];

function LangPill({ activeLangMeta, menuOpen, setMenuOpen, chooseLang }) {
  return (
    <div className="m-splash-langpill" onClick={() => setMenuOpen((o) => !o)} role="button" tabIndex={0}>
      <IconGlobe size={14} />
      <span>{activeLangMeta.code.toUpperCase()}</span>
      <IconChevronDown size={12} />
      {menuOpen && (
        <div className="m-splash-langmenu" onClick={(e) => e.stopPropagation()}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              className={'m-splash-langopt' + (l.code === activeLangMeta.code ? ' active' : '')}
              onClick={() => chooseLang(l.code)}
            >
              <span>{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Welcome() {
  const { lang, setLang } = useLanguage();
  const { nationality, setNationality } = useNationality();
  const { country, setCountry } = useDestination();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState('splash');
  const [purpose, setPurpose] = useState(null);

  const activeLang = lang || 'en';
  const activeLangMeta = LANGUAGES.find((l) => l.code === activeLang) || LANGUAGES[1];
  const t = TEXT[activeLang] || TEXT.en;

  const chooseLang = (code) => {
    setLang(code);
    setMenuOpen(false);
  };

  const commitPurpose = (code) => {
    setPurpose(code);
    localStorage.setItem('masar_user_purpose', code);
  };

  const enterApp = (path = '/') => {
    if (!lang) setLang(activeLang);
    setMenuOpen(false);
    navigate(path, { replace: true });
  };

  // --- Dark, full-bleed steps: Splash + Welcome ---------------------------
  if (step === 'splash' || step === 'welcome') {
    const isSplash = step === 'splash';
    return (
      <div
        className="m-splash"
        dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        style={{ background: isSplash ? SPLASH_BG : WELCOME_BG }}
      >
        <div className="m-splash-top">
          <LangPill activeLangMeta={activeLangMeta} menuOpen={menuOpen} setMenuOpen={setMenuOpen} chooseLang={chooseLang} />
        </div>

        {isSplash ? (
          <>
            <div className="m-splash-body">
              <div className="m-splash-badge-lg"><IconMasarMark size={38} /></div>
              <div className="m-splash-word">MASAR</div>
              <div className="m-splash-tag1" style={{ marginTop: 22, fontWeight: 700, lineHeight: 1.35 }}>{t.splashTag}</div>
            </div>
            <button type="button" className="m-splash-begin-btn" onClick={() => setStep('welcome')}>
              {t.begin} <IconArrowRight size={15} />
            </button>
          </>
        ) : (
          <div className="m-splash-body" style={{ justifyContent: 'flex-end' }}>
            <div className="m-splash-badge-sm"><IconMasarMark size={26} /></div>
            <div className="m-splash-word" style={{ fontSize: 23 }}>MASAR</div>
            <div className="m-splash-tag1" style={{ marginTop: 18 }}>{t.tagline1}</div>
            <div className="m-splash-tag2">{t.tagline2}</div>
            <div style={{ fontSize: 11.5, opacity: 0.6, marginTop: 4, marginBottom: 8, maxWidth: 270, lineHeight: 1.55 }}>{t.welcomeNote}</div>
            <button type="button" className="m-splash-cta" onClick={() => setStep('purpose')}>
              {t.start} <IconArrowRight size={16} />
            </button>
            <div className="m-splash-login">
              {t.already}{' '}
              <button type="button" className="linklike" onClick={() => enterApp('/login')}>{t.login}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Light, card-based steps: Purpose / Origin / Destination ------------
  const stepIndex = { purpose: 2, origin: 3, destination: 4 }[step];

  return (
    <div className="m-onb-page" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="m-onb-progress">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={i <= stepIndex ? 'done' : ''} />
        ))}
      </div>

      {step === 'purpose' && (
        <>
          <h1 className="m-onb-title">{t.purposeTitle}</h1>
          <p className="m-onb-sub">{t.purposeSub}</p>
          <div className="m-onb-purpose-list">
            {PURPOSES.map((p) => {
              const label = { study: t.purposeStudy, social: t.purposeSocial, explore: t.purposeExplore }[p.code];
              const desc = { study: t.purposeStudyDesc, social: t.purposeSocialDesc, explore: t.purposeExploreDesc }[p.code];
              const selected = purpose === p.code;
              return (
                <button key={p.code} type="button" className={'m-onb-purpose-card' + (selected ? ' selected' : '')} onClick={() => commitPurpose(p.code)}>
                  <span className="m-onb-purpose-icon">{p.emoji}</span>
                  <span style={{ flex: 1 }}>
                    <span className="m-onb-purpose-title">{label}</span>
                    <span className="m-onb-purpose-desc">{desc}</span>
                  </span>
                  <span className="m-onb-purpose-check">{selected && <IconCheck size={11} />}</span>
                </button>
              );
            })}
          </div>
          <div className="m-onb-footer">
            <button type="button" className="m-onb-continue" onClick={() => setStep('origin')}>
              {t.continueBtn} <IconArrowRight size={15} />
            </button>
          </div>
        </>
      )}

      {step === 'origin' && (
        <>
          <h1 className="m-onb-title">{t.originTitle}</h1>
          <p className="m-onb-sub">{t.originSub}</p>
          <div className="m-onb-grid">
            {NATIONALITIES.map((n) => {
              const Flag = FLAG_MAP[n.code];
              const selected = nationality === n.code;
              return (
                <button key={n.code} type="button" className={'m-onb-tile' + (selected ? ' selected' : '')} onClick={() => setNationality(n.code)}>
                  <span className="circle" style={{ background: selected ? 'var(--m-teal)' : 'var(--m-bg)' }}><Flag size={22} /></span>
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: 13 }}>{n.label}</span>
                </button>
              );
            })}
            <button type="button" className={'m-onb-tile m-onb-tile-other' + (nationality === 'other' ? ' selected' : '')} onClick={() => setNationality('other')}>
              <span className="circle" style={{ background: 'var(--m-teal-pale)', color: 'var(--m-teal-deep)', fontSize: 19 }}>{'\u{1F30D}'}</span>
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 12.5 }}>{t.originOther}</span>
            </button>
          </div>
          <div className="m-onb-footer">
            <button type="button" className="m-onb-continue" onClick={() => setStep('destination')}>
              {t.continueBtn} <IconArrowRight size={15} />
            </button>
            <button type="button" className="m-onb-skip" onClick={() => setStep('destination')}>{t.skip}</button>
          </div>
        </>
      )}

      {step === 'destination' && (
        <>
          <h1 className="m-onb-title">{t.destTitle}</h1>
          <p className="m-onb-sub">{t.destSub}</p>
          <div className="m-onb-list">
            {COUNTRIES.map((c) => {
              const Flag = FLAG_MAP[c.code];
              const selected = country === c.code;
              return (
                <button key={c.code} type="button" className={'m-onb-row' + (selected ? ' selected' : '')} onClick={() => setCountry(c.code)}>
                  <span className="circle" style={{ background: selected ? 'var(--m-teal)' : 'var(--m-bg)' }}><Flag size={20} /></span>
                  <span style={{ flex: 1 }}>
                    <span className="m-onb-row-title">{c.label}</span>
                  </span>
                  <span className="m-onb-purpose-check">{selected && <IconCheck size={11} />}</span>
                </button>
              );
            })}
            <button type="button" className={'m-onb-row' + (country === 'unset' ? ' selected' : '')} onClick={() => setCountry('unset')}>
              <span className="circle" style={{ background: 'var(--m-teal-pale)', color: 'var(--m-teal-deep)', fontSize: 17 }}>{'\u{1F9ED}'}</span>
              <span style={{ flex: 1 }}>
                <span className="m-onb-row-title">{t.destUnsure}</span>
                <span className="m-onb-row-sub" style={{ color: country === 'unset' ? 'rgba(255,255,255,0.65)' : 'var(--m-navy-soft)' }}>{t.destUnsureDesc}</span>
              </span>
            </button>
          </div>
          <div className="m-onb-footer">
            <button type="button" className="m-onb-continue" onClick={() => enterApp('/')}>
              {t.enter} <IconArrowRight size={15} />
            </button>
            <button type="button" className="m-onb-skip" onClick={() => enterApp('/')}>{t.skip}</button>
          </div>
        </>
      )}
    </div>
  );
}
