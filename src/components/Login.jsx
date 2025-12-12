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
      const res = await login({ email, password });
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
      const res = await signup({ email, password });
      console.log('signup result ', res);

      const session = res?.session ?? null;

      if (session) {
        // Create profile immediately (session expected when confirmation disabled)
        await createProfileForCurrentUser(name);
        setMessage('Registrazione completata e profilo creato.');
        navigate('/board');
      } else {
        setMessage('Registration started. Redirecting to complete sign-in...')
      }
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

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading} title="Sign-up">Sign-up</button>
            {/*{loading ? 'Attendi...' : 'Registrati'}*/}

            <button className="btn btn-primary" type="submit" onClick={handleSignIn} disabled={loading} title="Accedi">Login</button>
            {/*{loading ? '...' : 'Log-in'}*/}
          </div>
        </form>

        {message && (
            <div style={{ marginTop: 12, color: '#0a6', fontWeight: 500 }}>
              {message}
            </div>
        )}

        {error && (
            <div style={{ marginTop: 12, color: 'crimson' }}>
              <strong>Error: </strong> {error}
            </div>
        )}
      </div>
  );
}
