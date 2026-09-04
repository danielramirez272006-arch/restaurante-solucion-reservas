import { Link } from 'react-router-dom'
import RegisterForm from '../../features/auth/components/register-form'

export default function RegisterPage() {
  return <main className="auth-page">
    <div className="auth-card">
      <Link className="brand" to="/">
        <span className="brand-mark">DR</span>
        <span><strong>Donde Ray</strong><small>Cocina con carácter</small></span>
      </Link>
      <p className="eyebrow">Nueva cuenta</p>
      <h1>Reserva tu próxima mesa.</h1>
      <p className="auth-copy">Crea tu cuenta para solicitar reservas y consultar tus visitas.</p>
      <RegisterForm />
      <p className="auth-switch">¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
    </div>
  </main>
}