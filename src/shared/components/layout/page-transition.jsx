import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

function ToucanPageMascot() {
    return (
        <div className="toucan-page-mascot" aria-hidden="true">
            <span className="toucan-page-mascot__spark toucan-page-mascot__spark--one" />
            <span className="toucan-page-mascot__spark toucan-page-mascot__spark--two" />
            <img src="/brand-logo.png" alt="" />
        </div>
    )
}

export default function PageTransition({ children }) {
    const location = useLocation()

    return (
        <motion.div
            key={location.pathname}
            className="page-transition-shell"
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="navigation-celebration" aria-hidden="true">
                <ToucanPageMascot />
            </div>
            {children}
        </motion.div>
    )
}