import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { IconMasarMark, IconChevronRight, IconDocument, IconShield } from '../components/Icons.jsx';

const APP_VERSION = '0.1.0';

const TEXT = {
  fr: {
    title: 'À propos de Masar', back: 'Retour au profil',
    tagline: 'Votre guide pour étudier en Espagne, en France ou en Italie.',
    mission: "Masar (« chemin » en arabe) rassemble en un seul endroit ce qui est habituellement éparpillé sur des dizaines de forums et de groupes Facebook : les démarches de visa, le logement, les universités, les papiers administratifs et les délais réels — pour les étudiants algériens qui préparent leur départ vers l'Espagne, la France ou l'Italie.",
    whatTitle: "Ce que propose l'application",
    what: [
      'Un guide détaillé par pays : visa, logement, banque, transport, vie quotidienne.',
      'Un catalogue de 38 universités réelles en Espagne, en France et en Italie, avec filtres.',
      'Une checklist personnalisée pour suivre chaque étape, avec export PDF.',
      'Des favoris pour garder les universités qui vous intéressent.',
    ],
    legalTitle: 'Informations légales',
    terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité',
    disclaimer: "Masar est un projet indépendant et n'est affilié à aucune université, ambassade, consulat ou administration publique. Les informations sont fournies à titre indicatif — vérifiez toujours les démarches officielles auprès des sources compétentes (sites d'ambassade, universités, portails gouvernementaux).",
    version: 'Version', builtFor: 'Conçu pour les étudiants algériens.',
  },
  en: {
    title: 'About Masar', back: 'Back to profile',
    tagline: 'Your guide to studying in Spain, France, or Italy.',
    mission: '"Masar" means "path" in Arabic. The app brings together, in one place, what’s usually scattered across dozens of forums and Facebook groups: visa steps, housing, universities, paperwork, and real deadlines — for Algerian students preparing to move to Spain, France, or Italy.',
    whatTitle: 'What the app offers',
    what: [
      'A detailed guide per country: visa, housing, banking, transport, daily life.',
      'A catalog of 38 real universities across Spain, France, and Italy, with filters.',
      'A personal checklist to track every step, with PDF export.',
      'Favorites to keep track of universities you’re interested in.',
    ],
    legalTitle: 'Legal',
    terms: 'Terms of Service', privacy: 'Privacy Policy',
    disclaimer: 'Masar is an independent project and is not affiliated with any university, embassy, consulate, or government body. Information is provided for guidance only — always confirm official procedures with the relevant authority (embassy websites, universities, government portals).',
    version: 'Version', builtFor: 'Built for Algerian students.',
  },
  ar: {
    title: 'عن مسار', back: 'العودة إلى الملف الشخصي',
    tagline: 'دليلك للدراسة في إسبانيا أو فرنسا أو إيطاليا.',
    mission: '"مسار" يجمع في مكان واحد ما هو عادة مبعثر بين عشرات المنتديات ومجموعات فيسبوك: خطوات التأشيرة، السكن، الجامعات، الأوراق الإدارية، والمواعيد الحقيقية — لفائدة الطلبة الجزائريين المقبلين على السفر نحو إسبانيا أو فرنسا أو إيطاليا.',
    whatTitle: 'ما يقدمه التطبيق',
    what: [
      'دليل مفصّل لكل بلد: التأشيرة، السكن، البنك، النقل، الحياة اليومية.',
      'كتالوج يضم 38 جامعة حقيقية في إسبانيا وفرنسا وإيطاليا مع فلاتر بحث.',
      'قائمة مهام شخصية لتتبع كل خطوة، مع تصدير PDF.',
      'المفضلة للاحتفاظ بالجامعات التي تهمك.',
    ],
    legalTitle: 'معلومات قانونية',
    terms: 'شروط الاستخدام', privacy: 'سياسة الخصوصية',
    disclaimer: 'مسار مشروع مستقل وغير تابع لأي جامعة أو سفارة أو قنصلية أو جهة حكومية. المعلومات المقدمة استرشادية فقط — تحقق دائمًا من الإجراءات الرسمية لدى الجهات المختصة (مواقع السفارات، الجامعات، البوابات الحكومية).',
    version: 'الإصدار', builtFor: 'صُمم للطلبة الجزائريين.',
  },
};

export default function AboutMasar() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  return (
    <div className="m-page">
      <Link to="/profile" style={{ fontSize: 13, color: 'var(--m-navy-soft)', textDecoration: 'none' }}>← {t.back}</Link>

      <div style={{ textAlign: 'center', margin: '18px 0 6px' }}>
        <div style={{ display: 'inline-flex', color: 'var(--m-teal)' }}><IconMasarMark size={48} /></div>
      </div>
      <div className="m-section-title" style={{ textAlign: 'center', marginTop: 4 }}>{t.title}</div>
      <p style={{ textAlign: 'center', fontSize: 13.5, opacity: 0.7, marginBottom: 22 }}>{t.tagline}</p>

      <p style={{ fontSize: 14, lineHeight: 1.65 }}>{t.mission}</p>

      <div className="m-section-title" style={{ fontSize: 15, marginTop: 22 }}>{t.whatTitle}</div>
      <ul style={{ fontSize: 13.5, lineHeight: 1.7, paddingInlineStart: 20, marginTop: 8 }}>
        {t.what.map((w) => <li key={w}>{w}</li>)}
      </ul>

      <div className="m-section-title" style={{ fontSize: 15, marginTop: 22 }}>{t.legalTitle}</div>
      <div className="m-profile-menu" style={{ padding: '4px 0', marginTop: 8 }}>
        <Link to="/terms" className="m-profile-row">
          <span className="ic"><IconDocument size={17} /></span>
          <span className="lbl">{t.terms}</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
        <Link to="/privacy" className="m-profile-row">
          <span className="ic"><IconShield size={17} /></span>
          <span className="lbl">{t.privacy}</span>
          <span className="chev"><IconChevronRight size={14} /></span>
        </Link>
      </div>

      <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 20, lineHeight: 1.5 }}>{t.disclaimer}</p>
      <p style={{ fontSize: 11.5, opacity: 0.5, marginTop: 14, textAlign: 'center' }}>
        {t.version} {APP_VERSION} · {t.builtFor}
      </p>
    </div>
  );
}
