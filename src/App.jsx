import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './shared/context/auth-context.jsx'
import AppRouter from './shared/routing/app-router'
import DondeRayChatbot from './shared/components/donde-ray-chatbot.jsx'

function App() {
  return <BrowserRouter>
    <AuthProvider>
      <AppRouter />
      <DondeRayChatbot />
    </AuthProvider>
  </BrowserRouter>
}

export default App