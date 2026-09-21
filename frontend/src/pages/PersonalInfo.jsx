import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { COUNTRIES } from '../i18n/DestinationContext.jsx';
import { CITIES_BY_COUNTRY, PROGRAMS, ORIGIN_COUNTRIES } from '../data/profileOptions.js';
import { IconCheck, IconLock } from '../components/Icons.jsx';

const TEXT = {
  fr: {
    title: 'Informations personnelles', back: 'Retour au profil',
    name: 'Nom', email: 'E-mail', verified: 'Vérifié', unverified: 'Non vérifié', resend: 'Renvoyer le lien de vérification',
    originCountry: "Vous venez d'où ?",
    country: 'Pays cible', city: 'Ville cible', notSure: 'Pas encore sûr(e)', university: 'Université', programType: 'Type de programme',
    save: 'Enregistrer', saved: 'Modifications enregistrées.', saving: 'Enregistrement…',
    changePassword: 'Changer le mot de passe', currentPassword: 'Mot de passe actuel', newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le nouveau mot de passe', updatePassword: 'Mettre à jour le mot de passe',
    passwordUpdated: 'Mot de passe mis à jour.', mismatch: 'Les mots de passe ne correspondent pas.',
    resent: 'E-mail de vérification envoyé.',
    discoverable: 'Permettre aux autres étudiants de me trouver',
    discoverableHint: "Désactivé par défaut. Une fois activé, les autres étudiants pourront vous trouver dans la recherche par université (onglet « Étudiants »). Votre position n'est jamais partagée ici — cela concerne un onglet séparé avec son propre interrupteur.",
    birthDate: 'Date de naissance', birthDateHint: "Utilisée uniquement pour vérifier votre âge lorsqu'une activité sur la carte a une tranche d'âge - jamais affichée aux autres étudiants.",
    birthDateNudge: "Ajoutez votre date de naissance pour pouvoir rejoindre les activités avec une tranche d'âge sur la carte Explorer.",
  },
  en: {
    title: 'Personal Information', back: 'Back to profile',
    name: 'Name', email: 'Email', verified: 'Verified', unverified: 'Not verified', resend: 'Resend verification email',
    originCountry: 'Where are you moving from?',
    country: 'Target country', city: 'Target city', notSure: 'Not sure yet', university: 'University', programType: 'Program type',
    save: 'Save changes', saved: 'Changes saved.', saving: 'Saving…',
    changePassword: 'Change password', currentPassword: 'Current password', newPassword: 'New password',
    confirmPassword: 'Confirm new password', updatePassword: 'Update password',
    passwordUpdated: 'Password updated.', mismatch: "Passwords don't match.",
    resent: 'Verification email sent.',
    discoverable: 'Let other students find me',
    discoverableHint: "Off by default. Once on, other students can find you in the university search (the \"Students\" tab). This never shares your location - that's a separate tab with its own switch.",
    birthDate: 'Date of birth', birthDateHint: "Only used to check your age against age-restricted activities on the Explore map - never shown to other students.",
    birthDateNudge: 'Add your date of birth so you can join age-restricted activities on the Explore map.',
  },
  ar: {
    title: 'المعلومات الشخصية', back: 'العودة إلى الملف الشخصي',
    name: 'الاسم', email: 'البريد الإلكتروني', verified: 'موثّق', unverified: 'غير موثّق', resend: 'إعادة إرسال رابط التوثيق',
    originCountry: 'من أين أنت قادم؟',
    country: 'البلد المستهدف', city: 'المدينة المستهدفة', notSure: 'غير متأكد بعد', university: 'الجامعة', programType: 'نوع البرنامج',
    save: 'حفظ التغييرات', saved: 'تم حفظ التغييرات.', saving: 'جارٍ الحفظ…',
    changePassword: 'تغيير كلمة المرور', currentPassword: 'كلمة المرور الحالية', newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة', updatePassword: 'تحديث كلمة المرور',
    passwordUpdated: 'تم تحديث كلمة المرور.', mismatch: 'كلمتا المرور غير متطابقتين.',
    resent: 'تم إرسال بريد التوثيق.',
    discoverable: 'السماح للطلبة الآخرين بإيجادي',
    discoverableHint: 'معطّل افتراضيًا. عند التفعيل، يمكن للطلبة الآخرين إيجادك عبر البحث بالجامعة (قسم "الطلبة"). لا يتم مشاركة موقعك هنا أبدًا — ذلك في قسم منفصل له مفتاحه الخاص.',
    birthDate: 'تاريخ الميلاد', birthDateHint: 'يُستخدم فقط للتحقق من عمرك عند الأنشطة ذات الفئة العمرية على الخريطة - لا يُعرض أبدًا للطلبة الآخرين.',
    birthDateNudge: 'أضف تاريخ ميلادك حتى تتمكن من الانضمام إلى الأنشطة ذات الفئة العمرية على خريطة استكشف.',
  },
};

export default function PersonalInfo() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = TEXT[lang] || TEXT.en;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [university, setUniversity] = useState('');
  const [programType, setProgramType] = useState('');
  const [discoverable, setDiscoverable] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // '' | 'saving' | 'saved' | error text
  const [resendStatus, setResendStatus] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigate('/login');
      return;
    }
    auth.me().then((res) => {
      const p = res.data;
      setProfile(p);
      setDisplayName(p.displayName || '');
      setOriginCountry(p.originCountry || '');
      setTargetCountry(p.targetCountry || '');
      setTargetCity(p.targetCity || '');
      setUniversity(p.university || '');
      setProgramType(p.programType || '');
      setDiscoverable(!!p.discoverable);
      setBirthDate(p.birthDate || '');
    }).finally(() => setLoading(false));
  }, [navigate]);

  const cityOptions = targetCountry ? (CITIES_BY_COUNTRY[targetCountry] || []) : [];

  const onCountryChange = (code) => {
    setTargetCountry(code);
    setTargetCity('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      const res = await auth.updateProfile(displayName, originCountry, targetCountry, targetCity, university, programType, discoverable, birthDate);
      setProfile(res.data);
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus(err.response?.data || 'Something went wrong.');
    }
  };

  const resendVerification = async () => {
    if (!profile) return;
    setResendStatus('sending');
    try {
      await auth.resendVerification(profile.email);
      setResendStatus(t.resent);
    } catch {
      setResendStatus('');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwStatus(t.mismatch);
      return;
    }
    setPwLoading(true);
    setPwStatus('');
    try {
      await auth.changePassword(currentPassword, newPassword);
      setPwStatus(t.passwordUpdated);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwStatus(err.response?.data || 'Something went wrong.');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div className="m-page"><p style={{ opacity: 0.6 }}>Loading…</p></div>;

  return (
    <div className="m-page">
      <Link to="/profile" style={{ fontSize: 13, color: 'var(--m-navy-soft)', textDecoration: 'none' }}>← {t.back}</Link>
      <div className="m-section-title" style={{ marginTop: 10 }}>{t.title}</div>

      {!profile?.birthDate && (
        <div className="alert alert-warning py-2" style={{ fontSize: 13, marginTop: 12 }}>{t.birthDateNudge}</div>
      )}

      <form onSubmit={save} style={{ marginTop: 12 }}>
        <div className="mb-3">
          <label className="form-label small">{t.name}</label>
          <input className="form-control" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label small">{t.email}</label>
          <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--m-bg)' }}>
            <span>{profile?.email}</span>
            {profile?.emailVerified ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--m-teal)', fontSize: 12, fontWeight: 600 }}>
                <IconCheck size={13} /> {t.verified}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--m-pink)', fontWeight: 600 }}>{t.unverified}</span>
            )}
          </div>
          {!profile?.emailVerified && (
            <button type="button" onClick={resendVerification} className="btn btn-link p-0 mt-1" style={{ fontSize: 12.5 }}>
              {resendStatus || t.resend}
            </button>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label small">{t.originCountry}</label>
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
          <input className="form-control" value={university} onChange={(e) => setUniversity(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label small">{t.programType}</label>
          <select className="form-select" value={programType} onChange={(e) => setProgramType(e.target.value)}>
            <option value="">{t.notSure}</option>
            {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small">{t.birthDate}</label>
          <input type="date" className="form-control" value={birthDate} max={new Date().toISOString().slice(0, 10)}
                 onChange={(e) => setBirthDate(e.target.value)} />
          <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 4, lineHeight: 1.5 }}>{t.birthDateHint}</p>
        </div>

        <div className="mb-3">
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={discoverable} onChange={(e) => setDiscoverable(e.target.checked)} style={{ marginTop: 3 }} />
            <span>{t.discoverable}</span>
          </label>
          <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 4, lineHeight: 1.5 }}>{t.discoverableHint}</p>
        </div>

        {saveStatus && saveStatus !== 'saving' && saveStatus !== 'saved' && (
          <div className="alert alert-danger py-2" style={{ fontSize: 13.5 }}>{String(saveStatus)}</div>
        )}
        {saveStatus === 'saved' && (
          <div className="alert alert-success py-2" style={{ fontSize: 13.5 }}>{t.saved}</div>
        )}

        <button type="submit" className="btn btn-dark w-100" disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? t.saving : t.save}
        </button>
      </form>

      <div className="m-profile-menu" style={{ marginTop: 28, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14.5, marginBottom: 14 }}>
          <IconLock size={16} /> {t.changePassword}
        </div>
        <form onSubmit={changePassword}>
          <div className="mb-3">
            <label className="form-label small">{t.currentPassword}</label>
            <input type="password" required className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label small">{t.newPassword}</label>
            <input type="password" required minLength={6} className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label small">{t.confirmPassword}</label>
            <input type="password" required minLength={6} className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          {pwStatus && (
            <div className={'alert py-2 ' + (pwStatus === t.passwordUpdated ? 'alert-success' : 'alert-danger')} style={{ fontSize: 13.5 }}>
              {String(pwStatus)}
            </div>
          )}
          <button type="submit" className="btn btn-outline-dark w-100" disabled={pwLoading}>
            {t.updatePassword}
          </button>
        </form>
      </div>
    </div>
  );
}
