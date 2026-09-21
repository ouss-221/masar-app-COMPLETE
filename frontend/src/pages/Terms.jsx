import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const TEXT = {
  fr: {
    title: "Conditions d'utilisation", back: 'Retour',
    updated: 'Dernière mise à jour : septembre 2026',
    sections: [
      ['Ce qu’est Masar', "Masar est un guide indépendant destiné à aider les étudiants algériens à préparer leurs démarches pour étudier en Espagne, en France ou en Italie (visa, logement, universités, administration). L'application est fournie à titre informatif et n'est affiliée à aucune université, ambassade, consulat ou administration publique."],
      ['Exactitude des informations', "Les délais, montants, procédures et exigences liés aux visas et aux admissions universitaires changent régulièrement et peuvent varier selon votre situation personnelle. Les contenus de Masar sont fournis « en l'état », sans garantie d'exactitude ou d'exhaustivité. Vérifiez toujours les démarches officielles directement auprès des sources compétentes (sites d'ambassade, portails universitaires, administrations)."],
      ['Votre compte', "Vous êtes responsable de la confidentialité de votre mot de passe et de l'exactitude des informations que vous fournissez. Vous pouvez demander la suppression de votre compte à tout moment via la page Aide & Support."],
      ['Usage autorisé', "Vous acceptez de ne pas utiliser Masar à des fins frauduleuses, de ne pas tenter d'accéder aux comptes d'autres utilisateurs, et de ne pas perturber le fonctionnement de l'application."],
      ['Disponibilité du service', "Masar est un projet indépendant, développé et maintenu sans garantie de disponibilité continue. Le service peut être modifié, interrompu ou arrêté à tout moment."],
      ['Modifications', "Ces conditions peuvent être mises à jour. La date de dernière modification est indiquée en haut de cette page."],
      ['Contact', "Pour toute question concernant ces conditions, contactez-nous depuis la page Aide & Support."],
    ],
    notLegalAdvice: "Ce document décrit en langage simple le fonctionnement de Masar. Il ne constitue pas un conseil juridique formel.",
  },
  en: {
    title: 'Terms of Service', back: 'Back',
    updated: 'Last updated: September 2026',
    sections: [
      ['What Masar is', "Masar is an independent guide built to help Algerian students prepare their move to study in Spain, France, or Italy (visas, housing, universities, paperwork). The app is provided for informational purposes and is not affiliated with any university, embassy, consulate, or government body."],
      ['Accuracy of information', "Visa deadlines, fees, procedures, and admission requirements change regularly and can vary by individual situation. Masar's content is provided “as is,” without any guarantee of accuracy or completeness. Always confirm official procedures directly with the relevant authority (embassy websites, university portals, government agencies)."],
      ['Your account', 'You’re responsible for keeping your password confidential and for the accuracy of the information you provide. You can request account deletion at any time via the Help & Support page.'],
      ['Acceptable use', "You agree not to use Masar for fraudulent purposes, not to attempt to access other users' accounts, and not to disrupt the app's operation."],
      ['Availability', 'Masar is an independent project, developed and maintained without a guarantee of continuous availability. The service may be changed, interrupted, or discontinued at any time.'],
      ['Changes', 'These terms may be updated from time to time. The date at the top of this page reflects the latest revision.'],
      ['Contact', 'For any question about these terms, reach out via the Help & Support page.'],
    ],
    notLegalAdvice: 'This page describes how Masar works in plain language. It is not formal legal advice.',
  },
  ar: {
    title: 'شروط الاستخدام', back: 'رجوع',
    updated: 'آخر تحديث: سبتمبر 2026',
    sections: [
      ['ما هو مسار', "مسار دليل مستقل صُمم لمساعدة الطلبة الجزائريين على تحضير رحلتهم للدراسة في إسبانيا أو فرنسا أو إيطاليا (التأشيرة، السكن، الجامعات، الأوراق الإدارية). يُقدَّم التطبيق لأغراض إعلامية وهو غير تابع لأي جامعة أو سفارة أو قنصلية أو جهة حكومية."],
      ['دقة المعلومات', "المواعيد والرسوم والإجراءات وشروط القبول الجامعي تتغير باستمرار وقد تختلف حسب وضعك الشخصي. محتوى مسار يُقدَّم « كما هو » دون أي ضمان للدقة أو الاكتمال. تحقق دائمًا من الإجراءات الرسمية مباشرة لدى الجهة المختصة (مواقع السفارات، بوابات الجامعات، الإدارات الحكومية)."],
      ['حسابك', 'أنت مسؤول عن الحفاظ على سرية كلمة مرورك وعن دقة المعلومات التي تقدمها. يمكنك طلب حذف حسابك في أي وقت عبر صفحة المساعدة والدعم.'],
      ['الاستخدام المسموح', 'توافق على عدم استخدام مسار لأغراض احتيالية، وعدم محاولة الوصول لحسابات مستخدمين آخرين، وعدم تعطيل عمل التطبيق.'],
      ['توفر الخدمة', 'مسار مشروع مستقل، يُطوَّر ويُصان دون ضمان توفر مستمر. قد تُعدَّل الخدمة أو تُوقف مؤقتًا أو نهائيًا في أي وقت.'],
      ['التعديلات', 'قد تُحدَّث هذه الشروط من وقت لآخر. التاريخ أعلى هذه الصفحة يعكس آخر مراجعة.'],
      ['التواصل', 'لأي سؤال حول هذه الشروط، تواصل معنا عبر صفحة المساعدة والدعم.'],
    ],
    notLegalAdvice: 'تصف هذه الصفحة عمل مسار بلغة مبسطة. وهي ليست استشارة قانونية رسمية.',
  },
};

export default function Terms() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  return (
    <div className="m-page">
      <Link to="/profile/about" style={{ fontSize: 13, color: 'var(--m-navy-soft)', textDecoration: 'none' }}>← {t.back}</Link>
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>
      <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>{t.updated}</p>

      {t.sections.map(([heading, body]) => (
        <div key={heading} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{heading}</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, opacity: 0.85 }}>{body}</p>
        </div>
      ))}

      <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 20, lineHeight: 1.5 }}>{t.notLegalAdvice}</p>
    </div>
  );
}
