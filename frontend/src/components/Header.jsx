import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="m-header">
      <Link to="/" className="m-brand" style={{ textDecoration: 'none' }}>
        <div className="m-brand-mark">M</div>
        <div className="m-brand-name">Masar <span className="ar">مسار</span></div>
      </Link>
      <div className="m-header-icons">
        <Link to="/profile" className="m-icon-btn" aria-label="Notifications">🔔</Link>
      </div>
    </div>
  );
}
