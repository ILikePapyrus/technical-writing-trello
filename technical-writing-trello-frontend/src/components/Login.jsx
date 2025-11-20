import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthenticated } from '../auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (isAuthenticated()) {
    navigate('/board')
  }

  function submit(e) {
  e.preventDefault()
  setError('')
  const emailTrim = email.trim()
  const passwordTrim = password.trim()
  if (!emailTrim || !passwordTrim) {
    setError('Please enter email and password')
    return
  }

  // controllo demo: solo queste credenziali sono accettate
  if (emailTrim === 'admin@example.com' && passwordTrim === 'password123') {
    login({ email: emailTrim })
    navigate('/board')
  } else {
    setError('Credenziali non valide (usa admin@example.com / password123)')
  }
}

  return (
    <div className="login-container" style={{maxWidth: 420, margin: '2rem auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">Login</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setEmail('demo@example.com'); setPassword('demo') }}>Fill demo</button>
        </div>
      </form>
    </div>
  )
}

export default Login
