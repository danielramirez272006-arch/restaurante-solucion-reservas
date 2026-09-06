import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './shared/context/auth-context.jsx';
import AppRouter from './shared/routing/app-router';

// Scroll intersection observer to trigger entrance animation (fade up with slight 2deg rotation)
function ScrollRevealObserver() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollRevealObserver />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
