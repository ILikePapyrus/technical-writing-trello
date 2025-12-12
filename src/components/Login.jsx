import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../auth';
import { createProfileForCurrentUser } from '../profileApi';

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Sign in handler
  async function handleSignIn(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await login({ email, password });
      setMessage('Login effettuato.');
      navigate('/board');
    } catch (err) {
      console.error('handleSignIn error', err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  // Sign up handler (assumes email confirmation disabled)
  async function handleSignUp(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { user, session } = await signup({ email, password });

      // Create profile immediately (session expected when confirmation disabled)
      await createProfileForCurrentUser(name);

      setMessage('Registrazione completata e profilo creato.');
      navigate('/board');
    } catch (err) {
      console.error('handleSignUp error', err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="login-container" style={{maxWidth: 420, margin: '2rem auto'}}>
        <h2>Login</h2>
        <form onSubmit={handleSignUp} style={{ display: 'grid', gap: 10 }}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mario Rossi"/>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@example.com" required/>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required/>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" onClick={handleSignIn} disabled={loading} title="Accedi">Login</button>
          </div>
        </form>
      </div>
  );
}
