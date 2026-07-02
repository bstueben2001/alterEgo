import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function signup(payload) {
    const newUser = await api.post('/auth/signup', payload)
    setUser(newUser)
    return newUser
  }

  async function login(email, password) {
    const loggedIn = await api.post('/auth/login', { email, password })
    setUser(loggedIn)
    return loggedIn
  }

  async function logout() {
    await api.post('/auth/logout', {}).catch(() => {})
    setUser(null)
  }

  function updateUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
