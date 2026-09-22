import { useEffect, useState } from 'react';
import { loadAvatar, getCachedUrl, subscribe, hasEntry } from '../utils/avatarCache.js';
import { IconCamera } from './Icons.jsx';

function initialsFor(name) {
  const s = (name || '').trim();
  return s ? s.charAt(0).toUpperCase() : '?';
}

// Circular avatar used everywhere a user's identity is shown: their real
// profile photo when they have one, the same initials-circle this app
// already used before this feature (Profile, Nearby Students) when they
// don't. `userId` omitted means "the logged-in user's own photo" (Profile
// page); pass another user's id everywhere else this app already shows
// their name - Community members, Nearby Students, Activities, chats.
export default function Avatar({ userId, name, size = 36, editable = false, onEditClick, className = '' }) {
  const [url, setUrl] = useState(() => getCachedUrl(userId));

  useEffect(() => {
    let cancelled = false;
    // Shared by the initial mount AND every future cache-invalidation
    // notification (see avatarCache.invalidateAvatar, called right after
    // the current user changes/removes their own photo): if the cache
    // still has an entry (loaded, or a fetch already in flight), just read
    // it; if not - including right after an invalidation cleared it - kick
    // off a fresh fetch instead of quietly going stale.
    const refresh = () => {
      if (hasEntry(userId)) {
        setUrl(getCachedUrl(userId));
      } else {
        loadAvatar(userId).then((u) => { if (!cancelled) setUrl(u); });
      }
    };
    refresh();
    const unsubscribe = subscribe(userId, refresh);
    return () => { cancelled = true; unsubscribe(); };
  }, [userId]);

  return (
    <span className={'m-avatar-wrap' + (editable ? ' editable' : '')}>
      <span className={('m-avatar ' + className).trim()} style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}>
        {url ? <img src={url} alt="" /> : initialsFor(name)}
      </span>
      {editable && (
        <button type="button" className="m-avatar-edit" onClick={onEditClick} aria-label="Change profile photo">
          <IconCamera size={Math.max(12, Math.round(size * 0.3))} />
        </button>
      )}
    </span>
  );
}
