const statusLabels = { pending: 'Pendiente', confirmed: 'Confirmada', rejected: 'Rechazada', cancelled: 'Cancelada', completed: 'Completada' }

function Badge({ status, children }) {
	const label = children || statusLabels[status] || status
	return <span className={`status-badge status-badge--${status}`}>{label}</span>
}

export default Badge

