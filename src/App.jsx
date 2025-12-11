import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Board from './components/Board'
import Login from './components/Login'
import { isAuthenticated, logout } from './auth'

function AppShell() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-root">
        <header className="app-header">
        <h1>Mini Trello — Tablero</h1>
        {isAuthenticated() && (
          <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Logout</button>
        )}
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/board" element={isAuthenticated() ? <Board /> : <Navigate to="/login" replace />} />
          <Route path="/" element={isAuthenticated() ? <Navigate to="/board" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
