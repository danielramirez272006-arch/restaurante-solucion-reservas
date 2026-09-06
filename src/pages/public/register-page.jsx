import { Link } from 'react-router-dom'
import RegisterForm from '../../features/auth/components/register-form'

export default function RegisterPage() {
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
        <p className="eyebrow" style={{ marginBottom: '8px' }}>Nueva Cuenta</p>
        <h1>Asegura tu mesa frente al mar</h1>
        <p className="auth-copy">Crea tu cuenta para reservar mesas con anticipación y consultar tus visitas a Donde Ray.</p>
        <RegisterForm />
        <p className="auth-switch">¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
      </div>
    </main>
  )
}