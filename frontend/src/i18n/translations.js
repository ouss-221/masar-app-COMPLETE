// UI chrome strings only (sidebar, buttons, hero, welcome screen). The guide
// content itself (visa, housing, etc.) comes from the backend and is French
// only for now - translating that accurately is separate, larger work
// planned for after the French content is finalized.

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
];

export const RTL_LANGUAGES = ['ar'];

export const translations = {
  fr: {
    welcomeTitle: 'Bienvenue sur Masar',
    welcomeSubtitle: 'Choisissez votre langue',
    startHere: 'Commencer',
    myChecklist: 'Ma checklist',
    loginSignup: 'Connexion / Inscription',
    signedInAs: 'Connecté en tant que',
    logout: 'Déconnexion',
    heroTitle: "D'Alger à votre campus espagnol",
    heroSubtitle: "Tout ce que j'aurais aimé savoir avant de partir — les papiers, l'argent, le logement, et les détails que les guides officiels oublient.",
    jumpToSection: 'Aller à une section',
    tagline: "Guide étudiant, de l'Algérie vers l'Espagne",
  },
  en: {
    welcomeTitle: 'Welcome to Masar',
    welcomeSubtitle: 'Choose your language',
    startHere: 'Start here',
    myChecklist: 'My checklist',
    loginSignup: 'Log in / Sign up',
    signedInAs: 'Signed in as',
    logout: 'Log out',
    heroTitle: 'From Algiers to your Spanish campus',
    heroSubtitle: "Everything I wish someone had told me before I left — the paperwork, the money, the housing hunt, and the small things nobody puts in an official guide.",
    jumpToSection: 'Jump to a section',
    tagline: 'Algeria to Spain, one path at a time',
  },
  ar: {
    welcomeTitle: 'مرحبًا بك في مسار',
    welcomeSubtitle: 'اختر لغتك',
    startHere: 'ابدأ هنا',
    myChecklist: 'قائمتي',
    loginSignup: 'تسجيل الدخول / إنشاء حساب',
    signedInAs: 'مسجّل الدخول باسم',
    logout: 'تسجيل الخروج',
    heroTitle: 'من الجزائر إلى حرمك الجامعي في إسبانيا',
    heroSubtitle: 'كل ما كنت أتمنى لو أخبرني به أحد قبل رحيلي — الأوراق، المال، البحث عن سكن، والتفاصيل الصغيرة التي لا يذكرها أي دليل رسمي.',
    jumpToSection: 'انتقل إلى قسم',
    tagline: 'من الجزائر إلى إسبانيا، خطوة بخطوة',
  },
  es: {
    welcomeTitle: 'Bienvenido a Masar',
    welcomeSubtitle: 'Elige tu idioma',
    startHere: 'Empezar aquí',
    myChecklist: 'Mi lista',
    loginSignup: 'Iniciar sesión / Registrarse',
    signedInAs: 'Sesión iniciada como',
    logout: 'Cerrar sesión',
    heroTitle: 'De Argel a tu campus en España',
    heroSubtitle: 'Todo lo que me hubiera gustado saber antes de partir: los trámites, el dinero, la búsqueda de vivienda y los pequeños detalles que ninguna guía oficial menciona.',
    jumpToSection: 'Ir a una sección',
    tagline: 'De Argelia a España, paso a paso',
  },
};
