function Alert({ children, variant = 'info' }) {
	return <div className={`alert alert--${variant}`} role="status">{children}</div>
}

export default Alert
