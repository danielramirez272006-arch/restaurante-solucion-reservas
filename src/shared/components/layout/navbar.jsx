import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/use-auth';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d1f17] border-b border-[#c8860a]/25 shadow-md">
      {/* Pan-African Roots Accent Header Line */}
      <div 
        className="h-[3px] w-full flex" 
        aria-hidden="true"
      >
        <div className="flex-1 bg-[#15573f]" />
        <div className="flex-1 bg-[#c8860a]" />
        <div className="flex-1 bg-[#7c2d12]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link 
          to="/" 
          onClick={closeMenu}
          className="flex items-center gap-3.5 group text-decoration-none"
        >
          {/* Artisan Brand Mark */}
          <span className="w-11 h-11 rounded-sm bg-[#152e22] border-2 border-[#c8860a] text-[#c8860a] font-display text-lg font-bold flex items-center justify-center shadow-sm group-hover:bg-[#c8860a] group-hover:text-[#0d1f17] transition-colors">
            DR
          </span>
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl font-bold text-[#f0e6cc] tracking-tight group-hover:text-[#c8860a] transition-colors">
              Donde Ray
            </span>
            <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#c8860a]/90 font-semibold">
              Bar & Fogon · Puerto Viejo
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2.5 text-[#f0e6cc] hover:text-[#c8860a] focus:outline-none"
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar navegacion" : "Abrir navegacion"}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          <NavLink to="/" end className="nav-link-cultural" onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to="/menu" className="nav-link-cultural" onClick={closeMenu}>
            Carta Caribeña
          </NavLink>
          <a href="/#nosotros" className="nav-link-cultural" onClick={closeMenu}>
            Cultura Ray
          </a>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                <NavLink to="/admin" className="nav-link-cultural" onClick={closeMenu}>
                  Panel Admin
                </NavLink>
              ) : (
                <>
                  <NavLink to="/dashboard" className="nav-link-cultural" onClick={closeMenu}>
                    Mi Panel
                  </NavLink>
                  <NavLink to="/mis-reservas" className="nav-link-cultural" onClick={closeMenu}>
                    Mis Reservas
                  </NavLink>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#c8860a]/40 text-[#c8860a] text-xs font-label uppercase tracking-widest transition-all duration-250 ease-out hover:border-[#c8860a] hover:text-[#f0b429] hover:bg-[#c8860a]/[0.08]"
                aria-label="Cerrar sesión"
              >
                <svg
                  className="w-3 h-3 transition-transform duration-250 ease-out group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>Salir</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link-cultural" onClick={closeMenu}>
              Iniciar sesión
            </NavLink>
          )}

          {/* Artisan Solid Gold Action Button (no rounded > 4px) */}
          <Link to="/reservar" className="btn-artisan-gold" onClick={closeMenu}>
            Reservar mesa
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1f17] border-b border-[#c8860a]/30 px-6 py-6 flex flex-col gap-4 animate-smoke-rise">
          <NavLink to="/" end className="nav-link-cultural text-base" onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to="/menu" className="nav-link-cultural text-base" onClick={closeMenu}>
            Carta Caribeña
          </NavLink>
          <a href="/#nosotros" className="nav-link-cultural text-base" onClick={closeMenu}>
            Cultura Ray
          </a>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                <NavLink to="/admin" className="nav-link-cultural text-base" onClick={closeMenu}>
                  Panel Admin
                </NavLink>
              ) : (
                <>
                  <NavLink to="/dashboard" className="nav-link-cultural text-base" onClick={closeMenu}>
                    Mi Panel
                  </NavLink>
                  <NavLink to="/mis-reservas" className="nav-link-cultural text-base" onClick={closeMenu}>
                    Mis Reservas
                  </NavLink>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-sm font-label uppercase tracking-widest text-[#e59c19] py-2"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link-cultural text-base" onClick={closeMenu}>
              Iniciar sesión
            </NavLink>
          )}

          <div className="pt-2">
            <Link to="/reservar" className="btn-artisan-gold w-full text-center" onClick={closeMenu}>
              Reservar mesa
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
