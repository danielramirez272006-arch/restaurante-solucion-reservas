import { useCallback, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../../features/auth/auth-service'
import { AuthContext } from './auth-context'

const SESSION_KEY = 'donde-ray-session'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const session = await loginUser(email, password)
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      setUser(session)
      return session
    } catch (loginError) {
      setError(loginError.message)
      throw loginError
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setLoading(true)
    setError('')
    try {
      const session = await registerUser(data)
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      setUser(session)
      return session
    } catch (registerError) {
      setError(registerError.message)
      throw registerError
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setError('')
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    clearError: () => setError(''),
  }), [user, loading, error, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}