import { useState } from 'react';
import { auth } from '../api/client.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.forgotPassword(email);
    } finally {
      // Always show the same confirmation, whether or not the account exists -
      // this avoids revealing which emails are registered.
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ maxWidth: 400 }}>
        <h1 className="masar-page-title mb-2">Check your email</h1>
        <p className="text-muted">
          If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          It's valid for 1 hour.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h1 className="masar-page-title mb-1">Forgot your password?</h1>
      <p className="text-muted mb-4" style={{ fontSize: 14.5 }}>
        Enter your email and we'll send you a link to reset it.
      </p>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label small">Email</label>
          <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-dark w-100" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
}
