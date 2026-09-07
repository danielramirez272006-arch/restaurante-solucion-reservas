import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      {/* Cultural Closing Section Marquee */}
      <div className="cultural-marquee-container" aria-label="Lemas de Donde Ray">
        <div className="cultural-marquee-track">
          <span className="cultural-marquee-text">
            ALTA COCINA AFROCARIBEÑA &nbsp;•&nbsp; GASTRONOMÍA DE AUTOR &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp; TALAMANCA &nbsp;•&nbsp;
          </span>
          <span className="cultural-marquee-text" aria-hidden="true">
            ALTA COCINA AFROCARIBEÑA &nbsp;•&nbsp; GASTRONOMÍA DE AUTOR &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp; TALAMANCA &nbsp;•&nbsp;
          </span>
          <span className="cultural-marquee-text" aria-hidden="true">
            ALTA COCINA AFROCARIBEÑA &nbsp;•&nbsp; GASTRONOMÍA DE AUTOR &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp; TALAMANCA &nbsp;•&nbsp;
          </span>
          <span className="cultural-marquee-text" aria-hidden="true">
            ALTA COCINA AFROCARIBEÑA &nbsp;•&nbsp; GASTRONOMÍA DE AUTOR &nbsp;•&nbsp; PUERTO VIEJO &nbsp;•&nbsp; DONDE RAY &nbsp;•&nbsp; TALAMANCA &nbsp;•&nbsp;
          </span>
        </div>
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-[#15573f] via-[#c8860a] to-[#15573f]" aria-hidden="true" />
      <div className="footer-main">
        <div>
          <Link className="footer-brand" to="/">Donde Ray</Link>
          <p>Restaurante fino y alta cocina afrocaribeña en Puerto Viejo de Talamanca. Tradición ancestral, pesca sostenible y excelencia culinaria en cada servicio.</p>
        </div>
        <div className="footer-links">
          <strong style={{ color: '#f3d99d', fontSize: '13px', marginBottom: '4px' }}>Navegación</strong>
          <Link to="/menu">Menú de Autor</Link>
          <Link to="/#nosotros">Nuestra Casa</Link>
          <Link to="/reservar">Reservar Mesa</Link>
          <Link to="/login">Acceso Clientes</Link>
        </div>
        <div className="footer-contact">
          <strong style={{ color: '#f3d99d', fontSize: '13px', marginBottom: '4px' }}>Horario de Atención</strong>
          <span>Martes a domingo</span>
          <span>12:00 MD — 10:00 PM</span>
          <a href="mailto:wapin@donderay.com">wapin@donderay.com</a>
          <span>Playa Chiquita, Talamanca · Limón</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Donde Ray · Alta Cocina & Restaurante Fino</span>
        <span>Puerto Viejo de Talamanca, Limón · Costa Rica</span>
      </div>
    </footer>
  );
}

export default Footer;
