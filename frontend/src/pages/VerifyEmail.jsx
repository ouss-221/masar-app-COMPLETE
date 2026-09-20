import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { auth } from '../api/client.js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('checking'); // checking | ok | error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    auth.verifyEmail(token)
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div style={{ maxWidth: 400 }}>
      <h1 className="masar-page-title mb-2">Email verification</h1>
      {status === 'checking' && <p className="text-muted">Checking your link…</p>}
      {status === 'ok' && <p className="text-muted">Your email is verified. You're all set.</p>}
      {status === 'error' && (
        <p className="text-muted">
          This verification link is invalid or has expired.{' '}
          <Link to="/login">Go back to login</Link> and request a new one from there.
        </p>
      )}
    </div>
  );
}
