import { Link } from 'react-router-dom'
import LoginForm from '../../features/auth/components/login-form'

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="rasta-pill" style={{ marginBottom: '14px', alignSelf: 'flex-start' }}>
          <span className="rasta-dot rasta-dot--green" />
          <span className="rasta-dot rasta-dot--yellow" />
          <span className="rasta-dot rasta-dot--red" />
          <span>Puerto Viejo · Limón</span>
        </div>
        <Link className="brand" to="/" style={{ marginBottom: '20px' }}>
          <span className="brand-mark">DR</span>
          <span><strong>Donde Ray</strong><small>Bar & Sabor Caribeño · Limón</small></span>
        </Link>
        <p className="eyebrow" style={{ marginBottom: '8px' }}>Área de Comensales & Gestión</p>
        <h1>¡Wapin! Bienvenido</h1>
        <p className="auth-copy">Inicia sesión para gestionar tus mesas en Donde Ray o acceder al panel.</p>
        <LoginForm />
        <p className="auth-switch">¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link></p>
      </div>
    </main>
  )
}