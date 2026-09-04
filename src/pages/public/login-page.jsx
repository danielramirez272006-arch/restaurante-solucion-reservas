import { Link } from 'react-router-dom'
import LoginForm from '../../features/auth/components/login-form'

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link className="brand" to="/" style={{ marginBottom: '20px' }}>
          <span className="brand-mark">DR</span>
          <span><strong>Donde Ray</strong><small>Cocina con carácter</small></span>
        </Link>
        <p className="eyebrow" style={{ marginBottom: '8px' }}>Área de reservas</p>
        <h1>Bienvenido a Donde Ray</h1>
        <p className="auth-copy">Inicia sesión para gestionar tus reservas o acceder al panel.</p>
        <LoginForm />
        <p className="auth-switch">¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link></p>
      </div>
    </main>
  )
}