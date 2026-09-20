import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/client.js';

const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Granada', 'Alicante', 'Zaragoza', 'Sevilla', 'Other'];
const PROGRAMS = ['Bachelor', 'Master', 'PhD', 'Language course', 'Other'];

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [university, setUniversity] = useState('');
  const [programType, setProgramType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await auth.login(email, password);
      } else {
        await auth.register(email, password, displayName, targetCity, university, programType);
      }
      navigate('/checklist');
      window.location.reload(); // simplest way to refresh the sidebar's logged-in state
    } catch (err) {
      setError(err.response?.data || 'Something went wrong. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h1 className="masar-page-title mb-1">
        {mode === 'login' ? 'Log in' : 'Create your account'}
      </h1>
      <p className="text-muted mb-4" style={{ fontSize: 14.5 }}>
        {mode === 'login'
          ? 'Needed to save your checklist progress across visits.'
          : 'A couple of quick details so the guide can be more specific to your move.'}
      </p>

      <form onSubmit={submit}>
        {mode === 'register' && (
          <>
            <div className="mb-3">
              <label className="form-label small">Name</label>
              <input className="form-control" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label small">Target city in Spain</label>
              <select className="form-select" value={targetCity} onChange={(e) => setTargetCity(e.target.value)}>
                <option value="">Not sure yet</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small">University</label>
              <input className="form-control" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. Universidad de Jaén" />
            </div>
            <div className="mb-3">
              <label className="form-label small">Program type</label>
              <select className="form-select" value={programType} onChange={(e) => setProgramType(e.target.value)}>
                <option value="">Not sure yet</option>
                {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </>
        )}

        <div className="mb-3">
          <label className="form-label small">Email</label>
          <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label small">Password</label>
          <input type="password" required minLength={6} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {mode === 'login' && (
          <div className="mb-3" style={{ fontSize: 13, textAlign: 'right' }}>
            <a href="/forgot-password">Forgot your password?</a>
          </div>
        )}

        {error && <div className="alert alert-danger py-2" style={{ fontSize: 13.5 }}>{String(error)}</div>}

        <button type="submit" className="btn btn-dark w-100" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      <div className="mt-3" style={{ fontSize: 13.5 }}>
        {mode === 'login' ? (
          <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>Create one</a></>
        ) : (
          <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Log in</a></>
        )}
      </div>
    </div>
  );
}
