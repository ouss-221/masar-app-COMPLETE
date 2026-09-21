import { NavLink } from 'react-router-dom';
import { IconNavHome, IconMap, IconClipboard, IconFolder, IconUser } from '../components/Icons.jsx';

// "Community" moved out of the bottom nav and into the header's people icon
// (see Header.jsx) - Map takes its slot instead, matching the redesigned
// Explore-first navigation.
const TABS = [
  { to: '/', Icon: IconNavHome, label: 'Home', end: true },
  { to: '/map', Icon: IconMap, label: 'Map' },
  { to: '/checklist', Icon: IconClipboard, label: 'Checklist' },
  { to: '/resources', Icon: IconFolder, label: 'Resources' },
  { to: '/profile', Icon: IconUser, label: 'Profile' },
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
          <span className="ic"><t.Icon size={21} /></span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
