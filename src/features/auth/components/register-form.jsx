import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../use-auth'

const initialForm = { name: '', email: '', password: '', phone: '' }

export default function RegisterForm() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuth()
  const [form, setForm] = useState(initialForm)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    clearError()
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch {
      // El contexto mantiene el mensaje visible para el usuario.
    }
  }

  return <form className="auth-form" onSubmit={handleSubmit}>
    <label htmlFor="register-name">Nombre completo</label>
    <input id="register-name" name="name" value={form.name} onChange={updateField} required />
    <label htmlFor="register-email">Correo electrónico</label>
    <input id="register-email" name="email" type="email" value={form.email} onChange={updateField} required />
    <label htmlFor="register-password">Contraseña</label>
    <input id="register-password" name="password" type="password" minLength="4" value={form.password} onChange={updateField} required />
    <label htmlFor="register-phone">Teléfono</label>
    <input id="register-phone" name="phone" type="tel" value={form.phone} onChange={updateField} />
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-accent" type="submit" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
  </form>
}