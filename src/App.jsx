
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './shared/components/layout/main-layout.jsx'
import HomePage from './pages/public/home-page.jsx'
import MenuPage from './pages/public/menu-page.jsx'
import NotFoundPage from './pages/public/not-found-page.jsx'

function PendingPage({ title, description }) {
  return (
    <main className="page-shell page-shell--centered">
      <span className="eyebrow">Donde Ray</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <Link className="button button--primary" to="/">Volver al inicio</Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<PendingPage title="Tu mesa, a un paso" description="El acceso de clientes se conectará aquí con la autenticación del proyecto." />} />
          <Route path="/reservas" element={<PendingPage title="Reserva en preparación" description="La experiencia de reserva estará disponible cuando se integre el flujo de disponibilidad." />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
