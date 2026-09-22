import { useEffect, useRef, useState } from 'react';
import { profilePhoto } from '../api/client.js';
import { invalidateAvatar } from '../utils/avatarCache.js';
import { IconCamera, IconTrash, IconX } from './Icons.jsx';

// The profile photo picker/cropper/uploader, opened from the camera badge on
// the Profile page's avatar (see Profile.jsx). Self-contained: pick a photo
// from the device, preview + crop it to a circle (drag to reposition, slider
// to zoom), save it, or remove the existing one. No cropping library - just
// a CSS-clipped circular viewport and a canvas export, kept dependency-free
// like the rest of this app's frontend.

const CONTAINER_SIZE = 240; // on-screen crop viewport, CSS px
const EXPORT_SIZE = 480;    // uploaded square image, px
const MAX_PICKED_FILE_BYTES = 15 * 1024 * 1024; // generous pre-check before we even try to decode it
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const TEXT = {
  fr: {
    title: 'Photo de profil', changePhoto: 'Changer la photo', removePhoto: 'Supprimer la photo', cancel: 'Annuler',
    cropTitle: 'Ajustez votre photo', save: 'Enregistrer', saving: 'Enregistrement…', removing: 'Suppression…',
    badType: 'Veuillez choisir une image JPG, PNG ou WEBP.', tooBig: 'Cette photo est trop volumineuse (max 5 Mo).',
    loadFailed: "Impossible de charger cette image. Essayez-en une autre.", genericError: "Une erreur s'est produite. Réessayez.",
  },
  en: {
    title: 'Profile photo', changePhoto: 'Change photo', removePhoto: 'Remove photo', cancel: 'Cancel',
    cropTitle: 'Adjust your photo', save: 'Save', saving: 'Saving…', removing: 'Removing…',
    badType: 'Please choose a JPG, PNG, or WEBP image.', tooBig: 'That photo is too large (max 5MB).',
    loadFailed: "Couldn't load that image - try a different one.", genericError: 'Something went wrong. Please try again.',
  },
  ar: {
    title: 'الصورة الشخصية', changePhoto: 'تغيير الصورة', removePhoto: 'حذف الصورة', cancel: 'إلغاء',
    cropTitle: 'اضبط صورتك', save: 'حفظ', saving: 'جارٍ الحفظ…', removing: 'جارٍ الحذف…',
    badType: 'يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP.', tooBig: 'هذه الصورة كبيرة جدًا (الحد الأقصى 5 ميغابايت).',
    loadFailed: 'تعذّر تحميل هذه الصورة - جرّب صورة أخرى.', genericError: 'حدث خطأ ما. حاول مرة أخرى.',
  },
};

export default function AvatarEditor({ lang, hasPhoto, onClose, onSaved, onRemoved }) {
  const t = TEXT[lang] || TEXT.en;
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  // step: 'sheet' (change/remove menu) | 'crop' | 'busy' (uploading/removing)
  const [step, setStep] = useState(hasPhoto ? 'sheet' : 'crop-waiting');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState(null); // the picked file's local object URL
  const [naturalSize, setNaturalSize] = useState(null); // { w, h }
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busyAction, setBusyAction] = useState(null); // 'saving' | 'removing', while step === 'busy'
  const dragState = useRef(null);

  useEffect(() => {
    // No photo yet - skip the change/remove menu and go straight to picking one.
    if (step === 'crop-waiting') fileInputRef.current?.click();
  }, [step]);

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const pickFile = () => fileInputRef.current?.click();

  const onFileChosen = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow picking the same file again later
    if (!file) { if (step === 'crop-waiting') onClose(); return; }

    setError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t.badType);
      setStep('sheet');
      return;
    }
    if (file.size > MAX_PICKED_FILE_BYTES) {
      setError(t.tooBig);
      setStep('sheet');
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setStep('crop');
  };

  const onImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const baseScale = naturalSize ? Math.max(CONTAINER_SIZE / naturalSize.w, CONTAINER_SIZE / naturalSize.h) : 1;
  const scale = baseScale * zoom;
  const displayW = naturalSize ? naturalSize.w * scale : 0;
  const displayH = naturalSize ? naturalSize.h * scale : 0;
  const maxOffsetX = Math.max(0, (displayW - CONTAINER_SIZE) / 2);
  const maxOffsetY = Math.max(0, (displayH - CONTAINER_SIZE) / 2);

  const clamp = (v, max) => Math.max(-max, Math.min(max, v));

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, origin: offset };
  };
  const onPointerMove = (e) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({
      x: clamp(dragState.current.origin.x + dx, maxOffsetX),
      y: clamp(dragState.current.origin.y + dy, maxOffsetY),
    });
  };
  const onPointerUp = () => { dragState.current = null; };

  // Re-clamp whenever zoom changes so a lower zoom can't leave the image
  // dragged past its (now smaller) edges.
  useEffect(() => {
    setOffset((o) => ({ x: clamp(o.x, maxOffsetX), y: clamp(o.y, maxOffsetY) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, naturalSize]);

  const save = async () => {
    const img = imgRef.current;
    if (!img || !naturalSize) return;
    setError('');
    setBusyAction('saving');
    setStep('busy');

    try {
      const ratio = EXPORT_SIZE / CONTAINER_SIZE;
      const canvasScale = scale * ratio;
      const canvasW = naturalSize.w * canvasScale;
      const canvasH = naturalSize.h * canvasScale;
      const canvasCenterX = EXPORT_SIZE / 2 + offset.x * ratio;
      const canvasCenterY = EXPORT_SIZE / 2 + offset.y * ratio;

      const canvas = document.createElement('canvas');
      canvas.width = EXPORT_SIZE;
      canvas.height = EXPORT_SIZE;
      const ctx = canvas.getContext('2d');
      // Square export (not circular) - every place this photo is displayed
      // already clips it to a circle with CSS (.m-avatar), same as the
      // initials fallback it replaces.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
      ctx.drawImage(img, canvasCenterX - canvasW / 2, canvasCenterY - canvasH / 2, canvasW, canvasH);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
      if (!blob) throw new Error('canvas export failed');

      await profilePhoto.upload(blob);
      invalidateAvatar(null); // null key = the logged-in user's own cached avatar
      onSaved();
    } catch (err) {
      setError(err?.response?.data || t.genericError);
      setStep('crop');
    }
  };

  const remove = async () => {
    setError('');
    setBusyAction('removing');
    setStep('busy');
    try {
      await profilePhoto.remove();
      invalidateAvatar(null);
      onRemoved();
    } catch (err) {
      setError(err?.response?.data || t.genericError);
      setStep('sheet');
    }
  };

  return (
    <div className="m-report-overlay" onClick={onClose}>
      <div className="m-avatar-modal" onClick={(e) => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="m-avatar-modal-head">
          <span>{step === 'crop' ? t.cropTitle : t.title}</span>
          <button type="button" className="m-modal-close" onClick={onClose} aria-label={t.cancel}><IconX size={14} /></button>
        </div>

        {error && <div className="alert alert-danger py-2" style={{ fontSize: 12.5, marginTop: 4 }}>{error}</div>}

        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChosen} style={{ display: 'none' }} />

        {step === 'sheet' && (
          <div className="m-avatar-sheet">
            <button type="button" className="m-avatar-sheet-btn" onClick={pickFile}>
              <IconCamera size={17} /> {t.changePhoto}
            </button>
            {hasPhoto && (
              <button type="button" className="m-avatar-sheet-btn danger" onClick={remove}>
                <IconTrash size={17} /> {t.removePhoto}
              </button>
            )}
          </div>
        )}

        {step === 'crop-waiting' && (
          <div className="m-avatar-sheet" style={{ minHeight: 80 }} />
        )}

        {step === 'crop' && imageUrl && (
          <>
            <div
              className="m-avatar-crop-viewport"
              style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt=""
                draggable={false}
                onLoad={onImageLoad}
                style={{
                  width: displayW || 'auto',
                  height: displayH || 'auto',
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                }}
              />
            </div>
            <input
              type="range" min="1" max="3" step="0.01" value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="m-avatar-zoom"
            />
            <div className="m-avatar-modal-actions">
              <button type="button" className="btn btn-outline-dark btn-sm" onClick={onClose}>{t.cancel}</button>
              <button type="button" className="btn btn-dark btn-sm" onClick={save} disabled={!naturalSize}>{t.save}</button>
            </div>
          </>
        )}

        {step === 'busy' && (
          <div className="m-avatar-busy">
            <span className="m-avatar-spinner" />
            <span>{busyAction === 'removing' ? t.removing : t.saving}</span>
          </div>
        )}
      </div>
    </div>
  );
}
