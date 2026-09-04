import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './shared/context/auth-context.jsx'
import AppRouter from './shared/routing/app-router'

function App() {
  return <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>
}

export default App