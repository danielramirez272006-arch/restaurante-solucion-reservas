import { Link } from 'react-router-dom'
import RegisterForm from '../../features/auth/components/register-form'

export default function RegisterPage() {
  return (
    <main className="auth-page auth-page--limon">
      <div className="auth-story">
        <span className="eyebrow">Una mesa para compartir</span>
        <h1>
          Vení a formar


          <em>parte de la mesa.</em>
        </h1>
        <p>
          Creá tu cuenta para reservar fácilmente y mantener tus visitas de Donde
          Ray siempre a mano.
        </p>
      </div>

      <div className="auth-card">
        <Link className="brand" to="/" style={{ marginBottom: '24px' }}>
          <span className="brand-mark">DR</span>
          <span>
            <strong>Donde Ray</strong>
            <small>sabor del Caribe limonense</small>
          </span>
        </Link>

        <p className="eyebrow">Nueva cuenta</p>
        <h2>Reservá tu próxima mesa.</h2>
        <p className="auth-copy">
          Registrate para solicitar reservas y consultar tus visitas al Caribe.
        </p>

        <RegisterForm />

        <p className="auth-switch">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </main>
  )
}