import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { IconMail, IconChevronRight } from '../components/Icons.jsx';

// The one real, working contact address right now - the app's own dedicated
// support inbox hasn't been set up yet, so this is deliberately the actual
// person behind Masar rather than a made-up address that would just bounce.
const SUPPORT_EMAIL = 'mekahlioussama53@gmail.com';

const TEXT = {
  fr: {
    title: 'Aide & Support', back: 'Retour au profil',
    faqTitle: 'Questions fréquentes sur l’application',
    contactTitle: 'Nous contacter', contactBody: "Une question, un bug, une suggestion ? Écrivez-nous, on vous répond directement.",
    emailBtn: 'Envoyer un e-mail', guideLink: 'Questions sur le visa ou les études ? Consultez la FAQ du guide',
    disclaimer: "Masar est une ressource indépendante conçue pour aider les étudiants algériens à préparer leur départ. L'application n'est affiliée à aucune université, ambassade ou administration.",
    faqs: [
      { q: 'Comment suivre ma progression ?', a: "Ouvrez l'onglet Checklist et cochez chaque étape complétée. Votre progression est sauvegardée sur votre compte et visible sur l'écran Progression." },
      { q: 'Comment sauvegarder une université ?', a: "Appuyez sur l'icône cœur sur la fiche d'une université. Retrouvez ensuite toutes vos universités sauvegardées depuis votre Profil." },
      { q: 'Puis-je changer la langue de l’application ?', a: 'Oui — Français, Anglais et Arabe sont disponibles depuis votre Profil, section Paramètres.' },
      { q: 'Je n’ai pas reçu mon e-mail de vérification', a: "Vérifiez vos spams, puis utilisez le bouton «Renvoyer le lien de vérification» dans Informations personnelles." },
      { q: 'J’ai oublié mon mot de passe', a: "Sur l'écran de connexion, appuyez sur «Mot de passe oublié ?» et suivez le lien reçu par e-mail." },
      { q: 'Comment supprimer mon compte ?', a: "Écrivez-nous depuis cette page — nous traitons chaque demande de suppression manuellement pour l'instant." },
    ],
  },
  en: {
    title: 'Help & Support', back: 'Back to profile',
    faqTitle: 'Frequently asked questions about the app',
    contactTitle: 'Contact us', contactBody: "Got a question, found a bug, or have a suggestion? Write to us and we'll get back to you directly.",
    emailBtn: 'Send an email', guideLink: 'Questions about your visa or studies? Check the guide’s FAQ',
    disclaimer: 'Masar is an independent resource built to help Algerian students prepare their move abroad. The app is not affiliated with any university, embassy, or government body.',
    faqs: [
      { q: 'How do I track my progress?', a: 'Open the Checklist tab and tick off each step as you complete it. Progress is saved to your account and shown on the Progress screen.' },
      { q: 'How do I save a university?', a: "Tap the heart icon on any university's card. Find all your saved universities later from your Profile." },
      { q: 'Can I change the app language?', a: 'Yes — French, English, and Arabic are all available from your Profile, under Settings.' },
      { q: "I didn't get my verification email", a: 'Check your spam folder, then use the "Resend verification email" button on the Personal Information page.' },
      { q: 'I forgot my password', a: 'On the login screen, tap "Forgot your password?" and follow the link sent to your email.' },
      { q: 'How do I delete my account?', a: "Write to us from this page — account deletion requests are currently handled manually." },
    ],
  },
  ar: {
    title: 'المساعدة والدعم', back: 'العودة إلى الملف الشخصي',
    faqTitle: 'أسئلة شائعة حول التطبيق',
    contactTitle: 'تواصل معنا', contactBody: 'لديك سؤال، وجدت خللاً، أو عندك اقتراح؟ راسلنا وسنرد عليك مباشرة.',
    emailBtn: 'إرسال بريد إلكتروني', guideLink: 'أسئلة حول التأشيرة أو الدراسة؟ راجع الأسئلة الشائعة في الدليل',
    disclaimer: 'مسار هو مصدر مستقل صُمم لمساعدة الطلبة الجزائريين على تحضير رحلتهم للدراسة بالخارج. التطبيق غير تابع لأي جامعة أو سفارة أو جهة حكومية.',
    faqs: [
      { q: 'كيف أتابع تقدمي؟', a: 'افتح تبويب Checklist وأشّر على كل خطوة أنجزتها. يُحفظ تقدمك في حسابك ويظهر في شاشة التقدم.' },
      { q: 'كيف أحفظ جامعة؟', a: 'اضغط على أيقونة القلب في بطاقة أي جامعة. ستجد كل جامعاتك المحفوظة لاحقًا من ملفك الشخصي.' },
      { q: 'هل يمكنني تغيير لغة التطبيق؟', a: 'نعم — الفرنسية والإنجليزية والعربية متوفرة من ملفك الشخصي، ضمن الإعدادات.' },
      { q: 'لم أستلم بريد التوثيق', a: 'تحقق من مجلد الرسائل غير المرغوب فيها، ثم استخدم زر "إعادة إرسال رابط التوثيق" في المعلومات الشخصية.' },
      { q: 'نسيت كلمة المرور', a: 'في شاشة تسجيل الدخول، اضغط "نسيت كلمة المرور؟" واتبع الرابط المرسل إلى بريدك.' },
      { q: 'كيف أحذف حسابي؟', a: 'راسلنا من هذه الصفحة — طلبات حذف الحساب تُعالج يدويًا حاليًا.' },
    ],
  },
};

export default function HelpSupport() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  return (
    <div className="m-page">
      <Link to="/profile" style={{ fontSize: 13, color: 'var(--m-navy-soft)', textDecoration: 'none' }}>← {t.back}</Link>
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>

      <div className="m-profile-menu" style={{ padding: '4px 0', marginTop: 14 }}>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="m-profile-row">
          <span className="ic"><IconMail size={17} /></span>
          <span className="lbl">
            <div style={{ fontWeight: 600 }}>{t.contactTitle}</div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 1 }}>{SUPPORT_EMAIL}</div>
          </span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </a>
      </div>
      <p style={{ fontSize: 12.5, opacity: 0.65, marginTop: -6, marginBottom: 22 }}>{t.contactBody}</p>

      <div className="m-section-title" style={{ fontSize: 15, marginTop: 8 }}>{t.faqTitle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, marginBottom: 20 }}>
        {t.faqs.map((f) => (
          <details key={f.q} className="m-help-faq">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <Link to="/section/faq" className="m-uni-portal-link">
        {t.guideLink}
      </Link>

      <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 24, lineHeight: 1.5 }}>{t.disclaimer}</p>
    </div>
  );
}
