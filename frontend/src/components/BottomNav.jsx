import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', icon: '🏠', label: 'Home', end: true },
  { to: '/checklist', icon: '✅', label: 'Checklist' },
  { to: '/resources', icon: '📚', label: 'Resources' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="m-bottomnav">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => 'm-nav-item' + (isActive ? ' active' : '')}
        >
          <span className="ic">{t.icon}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
