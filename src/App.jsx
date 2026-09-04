import { useState } from 'react';
import { BookReservationPage } from './pages/client/book-reservation-page.jsx';
import { MyReservationsPage } from './pages/client/my-reservations-page.jsx';

function App() {
  const [currentView, setCurrentView] = useState('book'); // 'book' | 'my-reservations'

  return (
    <div style={styles.appContainer}>
      {/* Barra de Navegación del Cliente */}
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.brandIcon}>🌴</span>
          <div>
            <div style={styles.brandName}>DONDE RAY</div>
            <div style={styles.brandTagline}>Experiencia Gastronómica Caribeña</div>
          </div>
        </div>

        <nav style={styles.navLinks}>
          <button
            type="button"
            onClick={() => setCurrentView('book')}
            style={{
              ...styles.navBtn,
              ...(currentView === 'book' ? styles.navBtnActive : {})
            }}
          >
            🍽️ Reservar Mesa
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('my-reservations')}
            style={{
              ...styles.navBtn,
              ...(currentView === 'my-reservations' ? styles.navBtnActive : {})
            }}
          >
            📋 Mis Reservas
          </button>
        </nav>
      </header>

      {/* Vista Activa */}
      <main style={styles.mainContent}>
        {currentView === 'book' ? (
          <BookReservationPage />
        ) : (
          <MyReservationsPage />
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ margin: 0 }}>
          © 2026 Restaurante Donde Ray • Módulo de Reservas de Clientes
        </p>
      </footer>
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#0d0e12',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  navbar: {
    backgroundColor: 'rgba(20, 22, 29, 0.95)',
    borderBottom: '1px solid rgba(212, 163, 89, 0.25)',
    backdropFilter: 'blur(10px)',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  brandIcon: {
    fontSize: '28px',
    background: 'rgba(212, 163, 89, 0.15)',
    padding: '6px',
    borderRadius: '10px'
  },
  brandName: {
    fontSize: '18px',
    fontWeight: '800',
    letterSpacing: '2px',
    color: '#ffd89b'
  },
  brandTagline: {
    fontSize: '11px',
    color: '#9ca3af'
  },
  navLinks: {
    display: 'flex',
    gap: '10px'
  },
  navBtn: {
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#d1d5db',
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  navBtnActive: {
    background: 'linear-gradient(135deg, rgba(212, 163, 89, 0.25), rgba(180, 120, 40, 0.35))',
    borderColor: '#ffd89b',
    color: '#ffd89b',
    boxShadow: '0 0 12px rgba(212, 163, 89, 0.3)'
  },
  mainContent: {
    flex: 1
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#0a0b0e'
  }
};

export default App;
