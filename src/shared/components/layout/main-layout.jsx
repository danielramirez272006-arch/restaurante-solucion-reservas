import { Outlet } from 'react-router-dom'
import Navbar from './navbar.jsx'
import Footer from './footer.jsx'
import ChatbotConcierge from '../chatbot/chatbot-concierge.jsx'

function MainLayout() {
	return (
		<div className="app-frame">
			<Navbar />
			<div className="layout-content"><Outlet /></div>
			<Footer />
			<ChatbotConcierge />
		</div>
	)
}

export default MainLayout
