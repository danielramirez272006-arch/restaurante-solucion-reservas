import { Link } from 'react-router-dom'
import LoginForm from '../../features/auth/components/login-form'

export default function LoginPage() {
  return (
    <main className="auth-page auth-page--limon">
      <div className="auth-story">
        <span className="eyebrow">Caribe · Costa Rica</span>
        <h1>
          Tu mesa


          <em>comienza aquí.</em>
        </h1>
        <p>
          Entrá a tu espacio para reservar, consultar tus visitas y volver a
          encontrarte con los sabores de Donde Ray.
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

        <p className="eyebrow">Área de reservas</p>
        <h2>Bienvenido de vuelta.</h2>
        <p className="auth-copy">
          Iniciá sesión para gestionar tus reservas y preparar tu próxima visita.
        </p>

        <LoginForm />

        <p className="auth-switch">
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/register">Crear una cuenta</Link>
        </p>
      </div>
    </main>
  )
}