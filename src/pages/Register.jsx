import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="page narrow">
      <h1>Create account</h1>
      <form onSubmit={submit} className="form">
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label>Password (6+ characters)<input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}