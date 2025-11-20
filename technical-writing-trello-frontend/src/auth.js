const KEY = 'ttf_auth_user'

export function login({ email }) {
  // en una app real usarías backend; aquí guardamos usuario mínimo
  const user = { email, token: 'local-token-' + Date.now() }
  localStorage.setItem(KEY, JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem(KEY)
}

export function getUser() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function isAuthenticated() {
  return !!getUser()
}

export default { login, logout, getUser, isAuthenticated }
