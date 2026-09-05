import { formatDateToSpanish, formatTime12h } from '../../../shared/utils/date-helpers'

export default function ClientHistoryModal({ client, reservations = [], onClose }) {
	if (!client) return null
	const name = client.nombre || client.name || client.email
	const history = reservations.filter(
		(item) =>
			item.userId === client.id ||
			item.clienteId === client.id ||
			item.email === client.email
	)

	return (
		<div className="modal-backdrop" role="presentation" onClick={onClose}>
			<section
				className="modal"
				role="dialog"
				aria-modal="true"
				onClick={(event) => event.stopPropagation()}
			>
				<button
					className="modal-close"
					type="button"
					aria-label="Cerrar"
					onClick={onClose}
				>
					×
				</button>
				<p className="eyebrow">Comensal Registrado</p>
				<h2>Historial de {name}</h2>
				<div className="client-modal-meta">
					<span>📧 {client.email || 'Sin correo'}</span>
					<span>📞 {client.telefono || client.phone || 'Sin teléfono'}</span>
				</div>

				<div className="history-section-title">
					<strong>Reservas ({history.length})</strong>
				</div>

				<div className="history">
					{history.length ? (
						history.map((item) => (
							<div className="history-row" key={item.id}>
								<div className="history-row__main">
									<strong>
										{formatDateToSpanish(item.fecha || item.date)}
									</strong>
									<small>
										{formatTime12h(item.hora || item.time)} ·{' '}
										{item.guests || item.personas || 1}{' '}
										{Number(item.guests || item.personas) === 1
											? 'persona'
											: 'personas'}{' '}
										· {item.type || item.tipo || 'Cena'}
									</small>
								</div>
								<span
									className={`status ${String(
										item.estado || item.status || 'Pendiente'
									).toLowerCase()}`}
								>
									{item.estado || item.status || 'Pendiente'}
								</span>
							</div>
						))
					) : (
						<div className="state">No hay reservas asociadas a este cliente.</div>
					)}
				</div>
			</section>
		</div>
	)
}
