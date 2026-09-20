import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../api/client.js';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.response?.data || 'This link may be invalid or expired. Request a new one.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400 }}>
        <h1 className="masar-page-title mb-2">Invalid link</h1>
        <p className="text-muted">This reset link is missing its token. Please request a new one from the login page.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ maxWidth: 400 }}>
        <h1 className="masar-page-title mb-2">Password updated</h1>
        <p className="text-muted mb-3">You've been logged out on all devices for safety - please log in again.</p>
        <button className="btn btn-dark" onClick={() => navigate('/login')}>Go to login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h1 className="masar-page-title mb-1">Choose a new password</h1>
      <form onSubmit={submit} className="mt-3">
        <div className="mb-3">
          <label className="form-label small">New password</label>
          <input type="password" required minLength={6} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="alert alert-danger py-2" style={{ fontSize: 13.5 }}>{String(error)}</div>}
        <button type="submit" className="btn btn-dark w-100" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
