import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const TEXT = {
  fr: {
    title: 'Politique de confidentialité', back: 'Retour',
    updated: 'Dernière mise à jour : septembre 2026',
    sections: [
      ['Ce que nous stockons sur nos serveurs', null],
      ['Ce que nous ne stockons pas', null],
      ['Comment ces données sont utilisées', "Ces informations servent uniquement à faire fonctionner l'application : afficher votre progression, personnaliser le guide selon votre destination, et vous permettre de vous reconnecter. Nous ne vendons ni ne partageons vos données avec des annonceurs."],
      ['Services tiers', "L'envoi des e-mails de vérification et de réinitialisation de mot de passe passe par Resend, un service d'envoi d'e-mails transactionnels — votre adresse e-mail lui est transmise uniquement dans ce but précis. Aucun service d'analyse ou de publicité tiers n'est intégré à l'application."],
      ['Sécurité', "Votre mot de passe est stocké sous forme hachée (bcrypt) — jamais en clair. Les sessions utilisent des jetons (JWT) à durée de vie limitée."],
      ['Conservation et suppression', "Vos données sont conservées tant que votre compte existe. Vous pouvez demander la suppression complète de votre compte et de vos données à tout moment via la page Aide & Support."],
      ['Vos droits', "Vous pouvez consulter et modifier vos informations personnelles à tout moment depuis la page Informations personnelles, ou nous contacter pour toute question relative à vos données."],
      ['Contact', "Pour toute question sur la confidentialité, contactez-nous depuis la page Aide & Support."],
    ],
    storedList: [
      'Adresse e-mail, nom affiché, mot de passe (haché, jamais en clair)',
      'Pays et ville cibles, université et type de programme (facultatifs)',
      'Votre progression dans la checklist',
      'Jetons de session nécessaires pour rester connecté',
    ],
    notStoredList: [
      'Vos universités favorites — stockées uniquement sur votre appareil (localStorage), jamais envoyées à nos serveurs',
      'Votre langue et destination sélectionnées — stockées uniquement sur votre appareil',
      'Aucune donnée de paiement (l’application est gratuite)',
      'Aucun traceur publicitaire ni outil d’analyse tiers',
    ],
    notLegalAdvice: "Ce document décrit en langage simple nos pratiques concernant vos données. Il ne constitue pas un conseil juridique formel.",
  },
  en: {
    title: 'Privacy Policy', back: 'Back',
    updated: 'Last updated: September 2026',
    sections: [
      ['What we store on our servers', null],
      ["What we don't store", null],
      ['How this data is used', "This information is used only to run the app: showing your progress, personalizing the guide to your destination, and keeping you logged in. We don't sell or share your data with advertisers."],
      ['Third-party services', 'Verification and password-reset emails are sent through Resend, a transactional email provider — your email address is shared with them only for that specific purpose. No third-party analytics or advertising tools are built into the app.'],
      ['Security', 'Your password is stored hashed (bcrypt) — never in plain text. Sessions use short-lived tokens (JWT).'],
      ['Retention and deletion', 'Your data is kept for as long as your account exists. You can request full deletion of your account and data at any time via the Help & Support page.'],
      ['Your rights', 'You can view and edit your personal information at any time from the Personal Information page, or contact us with any question about your data.'],
      ['Contact', 'For any privacy question, reach out via the Help & Support page.'],
    ],
    storedList: [
      'Email address, display name, password (hashed, never in plain text)',
      'Target country and city, university, and program type (optional)',
      'Your checklist progress',
      'Session tokens needed to keep you logged in',
    ],
    notStoredList: [
      "Your favorited universities — kept only on your device (localStorage), never sent to our servers",
      'Your selected language and destination — kept only on your device',
      'No payment data (the app is free)',
      'No advertising trackers or third-party analytics tools',
    ],
    notLegalAdvice: 'This page describes our data practices in plain language. It is not formal legal advice.',
  },
  ar: {
    title: 'سياسة الخصوصية', back: 'رجوع',
    updated: 'آخر تحديث: سبتمبر 2026',
    sections: [
      ['ما نخزّنه على خوادمنا', null],
      ['ما لا نخزّنه', null],
      ['كيف تُستخدم هذه البيانات', 'تُستخدم هذه المعلومات فقط لتشغيل التطبيق: عرض تقدمك، تخصيص الدليل حسب وجهتك، وإبقائك مسجّل الدخول. نحن لا نبيع بياناتك ولا نشاركها مع المعلنين.'],
      ['خدمات خارجية', 'تُرسَل رسائل التوثيق وإعادة تعيين كلمة المرور عبر Resend، وهي خدمة لإرسال الرسائل الإلكترونية التعاملية — تُشارَك عنوان بريدك الإلكتروني معها فقط لهذا الغرض. لا يوجد أي أداة تحليلات أو إعلانات من طرف ثالث مدمجة في التطبيق.'],
      ['الأمان', 'تُخزَّن كلمة مرورك بصيغة مشفّرة (bcrypt) — أبدًا كنص واضح. تستخدم الجلسات رموزًا (JWT) محدودة الصلاحية.'],
      ['الاحتفاظ والحذف', 'تُحفظ بياناتك طالما حسابك موجود. يمكنك طلب حذف حسابك وبياناتك بالكامل في أي وقت عبر صفحة المساعدة والدعم.'],
      ['حقوقك', 'يمكنك الاطلاع على معلوماتك الشخصية وتعديلها في أي وقت من صفحة المعلومات الشخصية، أو التواصل معنا لأي سؤال يخص بياناتك.'],
      ['التواصل', 'لأي سؤال حول الخصوصية، تواصل معنا عبر صفحة المساعدة والدعم.'],
    ],
    storedList: [
      'البريد الإلكتروني، الاسم المعروض، كلمة المرور (مشفّرة، أبدًا كنص واضح)',
      'البلد والمدينة المستهدفان، الجامعة، ونوع البرنامج (اختياري)',
      'تقدمك في قائمة المهام',
      'رموز الجلسة اللازمة لإبقائك مسجّل الدخول',
    ],
    notStoredList: [
      'الجامعات المفضلة لديك — تُحفظ فقط على جهازك (localStorage)، ولا تُرسل أبدًا إلى خوادمنا',
      'لغتك ووجهتك المختارتان — تُحفظان فقط على جهازك',
      'لا توجد بيانات دفع (التطبيق مجاني)',
      'لا توجد أدوات تتبع إعلاني أو تحليلات من طرف ثالث',
    ],
    notLegalAdvice: 'تصف هذه الصفحة ممارساتنا المتعلقة بالبيانات بلغة مبسطة. وهي ليست استشارة قانونية رسمية.',
  },
};

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  return (
    <div className="m-page">
      <Link to="/profile/about" style={{ fontSize: 13, color: 'var(--m-navy-soft)', textDecoration: 'none' }}>← {t.back}</Link>
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>{t.updated}</p>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{t.sections[0][0]}</div>
        <ul style={{ fontSize: 13.5, lineHeight: 1.65, opacity: 0.85, paddingInlineStart: 20, margin: 0 }}>
          {t.storedList.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{t.sections[1][0]}</div>
        <ul style={{ fontSize: 13.5, lineHeight: 1.65, opacity: 0.85, paddingInlineStart: 20, margin: 0 }}>
          {t.notStoredList.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>

      {t.sections.slice(2).map(([heading, body]) => (
        <div key={heading} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{heading}</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, opacity: 0.85 }}>{body}</p>
        </div>
      ))}

      <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 20, lineHeight: 1.5 }}>{t.notLegalAdvice}</p>
    </div>
  );
}
