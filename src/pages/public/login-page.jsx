import { Link } from 'react-router-dom';
import LoginForm from '../../features/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132c21] border border-[#c8860a]/35 text-[#c8860a] text-[11px] font-label uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8860a]" />
          <span>Puerto Viejo · Costa Rica</span>
        </div>
        <Link className="brand" to="/" style={{ marginBottom: '20px', textDecoration: 'none' }}>
          <img 
            src="/brand-logo.png" 
            alt="Donde Ray Logo" 
            className="w-12 h-12 rounded-full border-2 border-[#c8860a] object-cover shadow-md"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span>
            <strong style={{ color: '#f0e6cc' }}>Donde Ray</strong>
            <small style={{ color: '#c8860a' }}>Alta Cocina &amp; Fogón de Autor</small>
          </span>
        </Link>
        <p className="eyebrow" style={{ marginBottom: '8px' }}>Portal de Clientes · Puerto Viejo</p>
        <h1>¡Wapin! Bienvenido</h1>
        <p className="auth-copy">
          Inicia sesión para supervisar tus reservaciones, acceder a tus comprobantes con código QR y gestionar tu experiencia en Donde Ray.
        </p>
        <LoginForm />
        <p className="auth-switch">¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link></p>
      </div>
    </main>
  );
}