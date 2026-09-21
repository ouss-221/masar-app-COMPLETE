import { useMemo, useState } from 'react';

// Splits a section's already-written, already-verified HTML content into an
// "Overview" tab (the full content, unchanged) plus one tab per top-level
// <h3> heading already present in that content - so Visa, Housing, Useful
// Info (and every other section) get the mockup's pill-tab / card-list feel
// without rewriting or duplicating any real content, and without a backend
// schema change. If the content has no <h3> headings, only Overview shows.
function splitByH3(html) {
  if (typeof window === 'undefined' || !html) return [];
  const container = document.createElement('div');
  container.innerHTML = html;
  const segments = [];
  let current = null;
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeType === 1 && node.tagName === 'H3') {
      if (current) segments.push(current);
      current = { title: node.textContent.trim(), nodes: [node] };
    } else if (current) {
      current.nodes.push(node);
    }
    // content before the first h3 (intro paragraphs) is intentionally
    // dropped from the per-tab segments - it's still shown in Overview.
  });
  if (current) segments.push(current);
  return segments.map((seg) => {
    const wrap = document.createElement('div');
    seg.nodes.forEach((n) => wrap.appendChild(n.cloneNode(true)));
    return { title: seg.title, html: wrap.innerHTML };
  });
}

export default function TabbedHtmlContent({ html, overviewLabel = 'Overview' }) {
  const segments = useMemo(() => splitByH3(html), [html]);
  const [tab, setTab] = useState('overview');

  if (segments.length < 2) {
    // Not enough structure to make tabs meaningful - just show the content.
    return <div className="masar-content" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const active = tab === 'overview' ? null : segments.find((s) => s.title === tab);

  return (
    <div>
      <div className="m-uni-tabs">
        <button type="button" className={'m-uni-tab' + (tab === 'overview' ? ' active' : '')} onClick={() => setTab('overview')}>
          {overviewLabel}
        </button>
        {segments.map((s) => (
          <button key={s.title} type="button" className={'m-uni-tab' + (tab === s.title ? ' active' : '')} onClick={() => setTab(s.title)}>
            {s.title.length > 28 ? `${s.title.slice(0, 26)}…` : s.title}
          </button>
        ))}
      </div>
      <div className="masar-content" dangerouslySetInnerHTML={{ __html: active ? active.html : html }} />
    </div>
  );
}
