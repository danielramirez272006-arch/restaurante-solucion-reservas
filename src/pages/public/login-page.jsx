import { Link } from 'react-router-dom'
import LoginForm from '../../features/auth/components/login-form'

export default function LoginPage() {
  return <main className="auth-page">
    <div className="auth-card">
      <Link className="brand" to="/">
        <span className="brand-mark">DR</span>
        <span><strong>Donde Ray</strong><small>Cocina con carácter</small></span>
      </Link>
      <p className="eyebrow">Área de reservas</p>
      <h1>Bienvenido a Donde Ray.</h1>
      <p className="auth-copy">Inicia sesión para solicitar una mesa y consultar el estado de tus reservas.</p>
      <LoginForm />
      <p className="demo-hint">Demo cliente: user@demo.com / 1234  
Demo admin: admin@demo.com / 1234</p>
      <p className="auth-switch">¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link></p>
    </div>
  </main>
}