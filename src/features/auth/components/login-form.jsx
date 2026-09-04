import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../use-auth'

export default function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, clearError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    clearError()
    try {
      const user = await login(form.email.trim(), form.password)
      const destination = location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard')
      navigate(destination, { replace: true })
    } catch {
      // El mensaje visible proviene del contexto.
    }
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return <form className="auth-form" onSubmit={handleSubmit} noValidate>
    <label htmlFor="login-email">Correo electrónico</label>
    <input id="login-email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} placeholder="tu@email.com" required />
    <label htmlFor="login-password">Contraseña</label>
    <input id="login-password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={updateField} placeholder="••••" required />
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-accent" type="submit" disabled={loading}>{loading ? 'Verificando acceso...' : 'Iniciar sesión'}</button>
  </form>
}