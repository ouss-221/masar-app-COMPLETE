import { useEffect, useState } from 'react';
import { checklist as checklistApi, exportApi } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { pickGroupName, pickItemText } from '../i18n/pick.js';

export default function Checklist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    checklistApi.mine()
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (item) => {
    const nextDone = !item.done;
    setItems((prev) => prev.map((i) => (i.itemId === item.itemId ? { ...i, done: nextDone } : i)));
    try {
      await checklistApi.toggle(item.itemId, nextDone);
    } catch {
      setItems((prev) => prev.map((i) => (i.itemId === item.itemId ? { ...i, done: item.done } : i)));
    }
  };

  const resetAll = async () => {
    const previous = items;
    setItems((prev) => prev.map((i) => ({ ...i, done: false })));
    try {
      await Promise.all(previous.filter((i) => i.done).map((i) => checklistApi.toggle(i.itemId, false)));
    } catch {
      setItems(previous);
    }
  };

  const groups = [...new Set(items.map((i) => i.groupName))];
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  if (loading) return <p className="text-muted">Loading…</p>;

  if (items.length === 0) {
    const loggedIn = !!localStorage.getItem('masar_access_token');
    return (
      <div>
        <h1 className="masar-page-title">My checklist</h1>
        {loggedIn ? (
          <p className="text-muted">No checklist items found.</p>
        ) : (
          <p className="text-muted">
            You need to be logged in to see and save your checklist. <a href="/login">Log in or create an account</a>.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="masar-page-title mb-1">My checklist</h1>
      <p className="text-muted mb-3" style={{ fontSize: 14.5 }}>
        Saved to your account — pick up where you left off on any device.
      </p>

      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="masar-progress-bar flex-grow-1">
          <div className="masar-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ fontSize: 13, opacity: 0.75, whiteSpace: 'nowrap' }}>{done} / {items.length} done</div>
        <button className="masar-reset-btn" onClick={resetAll}>Reset</button>
        <button className="btn btn-sm btn-outline-dark" onClick={() => exportApi.downloadChecklistPdf()}>
          Export PDF
        </button>
      </div>

      {groups.map((group) => (
        <div key={group} className="masar-check-group mb-4">
          <h3>{pickGroupName(items.find((i) => i.groupName === group), lang)}</h3>
          {items.filter((i) => i.groupName === group).map((item) => (
            <div
              key={item.itemId}
              className={'masar-check-item' + (item.done ? ' done' : '')}
              onClick={() => toggle(item)}
            >
              <input type="checkbox" checked={item.done} readOnly />
              <label>{pickItemText(item, lang)}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
