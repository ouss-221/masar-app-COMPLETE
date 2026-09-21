import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { places as placesApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { IconHeart, IconExternalLink, IconNavigation, IconPin } from '../components/Icons.jsx';
import { isFavoritePlace, toggleFavoritePlace } from '../utils/favoritePlaces.js';

const TEXT = {
  fr: {
    back: '← Retour', loading: 'Chargement…', notFound: 'Lieu introuvable.',
    restaurant: 'Restaurant', cafe: 'Café', bar: 'Bar', landmark: 'Site',
    hours: 'Horaires', address: 'Adresse', noAddress: 'Adresse non renseignée sur OpenStreetMap.',
    noHours: 'Horaires non renseignés sur OpenStreetMap.',
    directions: 'Itinéraire', viewOsm: 'Voir sur OpenStreetMap',
    save: 'Ajouter aux favoris', saved: 'Dans vos favoris',
    note: "Ce lieu vient d'OpenStreetMap (données publiques et gratuites) — Masar n'affiche pas de notes ou d'avis inventés.",
  },
  en: {
    back: '← Back', loading: 'Loading…', notFound: 'Place not found.',
    restaurant: 'Restaurant', cafe: 'Café', bar: 'Bar', landmark: 'Landmark',
    hours: 'Opening hours', address: 'Address', noAddress: "No address on file in OpenStreetMap.",
    noHours: "No opening hours on file in OpenStreetMap.",
    directions: 'Get directions', viewOsm: 'View on OpenStreetMap',
    save: 'Add to favorites', saved: 'Saved to favorites',
    note: "This place comes from OpenStreetMap (free, public data) — Masar doesn't show invented ratings or reviews.",
  },
  ar: {
    back: '← رجوع', loading: 'جارٍ التحميل…', notFound: 'المكان غير موجود.',
    restaurant: 'مطعم', cafe: 'مقهى', bar: 'حانة', landmark: 'معلم',
    hours: 'ساعات العمل', address: 'العنوان', noAddress: 'لا يوجد عنوان مسجل في OpenStreetMap.',
    noHours: 'لا توجد ساعات عمل مسجلة في OpenStreetMap.',
    directions: 'الاتجاهات', viewOsm: 'عرض على OpenStreetMap',
    save: 'إضافة إلى المفضلة', saved: 'في المفضلة',
    note: 'هذا المكان من OpenStreetMap (بيانات عامة ومجانية) — لا تعرض Masar تقييمات أو مراجعات ملفّقة.',
  },
};

export default function PlaceDetail() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setLoading(true);
    placesApi.byId(placeId)
      .then((res) => {
        setPlace(res.data);
        setFav(isFavoritePlace(res.data.id));
      })
      .catch(() => setPlace(null))
      .finally(() => setLoading(false));
  }, [placeId]);

  const doFav = () => {
    if (!place) return;
    toggleFavoritePlace(place.id);
    setFav(isFavoritePlace(place.id));
  };

  if (loading) return <div className="m-page"><p style={{ opacity: 0.6, fontSize: 14 }}>{t.loading}</p></div>;
  if (!place) return <div className="m-page"><p>{t.notFound}</p></div>;

  const directionsUrl = `https://www.openstreetmap.org/directions?to=${place.lat}%2C${place.lng}`;
  const osmUrl = `https://www.openstreetmap.org/node/${place.osmId}`;

  return (
    <div className="m-page">
      <button type="button" className="m-uni-back" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, marginBottom: 12, cursor: 'pointer', fontSize: 14 }}>
        {t.back}
      </button>

      <div className="m-explore-card-cat">{t[place.category] || place.category}</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 10px' }}>{place.name}</h1>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, opacity: 0.8, marginBottom: 6 }}>
        <IconPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
        <span>{place.address || t.noAddress}</span>
      </div>

      <div style={{ fontSize: 13.5, opacity: 0.8, marginBottom: 18 }}>
        <strong>{t.hours}:</strong> {place.openingHours || t.noHours}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <IconNavigation size={15} /> {t.directions}
        </a>
        <button type="button" className="btn btn-sm" onClick={doFav} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <IconHeart size={15} filled={fav} /> {fav ? t.saved : t.save}
        </button>
      </div>

      <a href={osmUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, opacity: 0.75, textDecoration: 'none' }}>
        <IconExternalLink size={14} /> {t.viewOsm}
      </a>

      <p style={{ fontSize: 11.5, opacity: 0.5, marginTop: 22, lineHeight: 1.5 }}>{t.note}</p>
    </div>
  );
}
