import { formatDateToSpanish, formatTime12h } from '../../../shared/utils/date-helpers'

export default function ReservationDetailModal({ reservation, onClose }) {
	if (!reservation) return null

	const guest = reservation.guestName || reservation.cliente || reservation.name || 'Sin nombre'
	const date = reservation.date || reservation.fecha
	const time = reservation.time || reservation.hora
	const guests = reservation.guests || reservation.personas || 1
	const type = reservation.type || reservation.tipo || 'Cena'
	const status = reservation.status || reservation.estado || 'Pendiente'
	const email = reservation.email || '—'
	const phone = reservation.phone || reservation.telefono || '—'
	const notes = reservation.notes || reservation.notas || 'Sin peticiones especiales'

	return (
		<div className="modal-backdrop" role="presentation" onClick={onClose}>
			<section
				className="modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="reservation-detail"
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
				<p className="eyebrow">Comprobante de Reserva</p>
				<h2 id="reservation-detail">Reserva #{reservation.id}</h2>

				<div className="reservation-modal-badge">
					<span className={`status ${String(status).toLowerCase()}`}>
						{status}
					</span>
				</div>

				<dl className="detail-list">
					<div>
						<dt>Comensal</dt>
						<dd><strong>{guest}</strong></dd>
					</div>
					<div>
						<dt>Fecha</dt>
						<dd>{formatDateToSpanish(date)}</dd>
					</div>
					<div>
						<dt>Horario</dt>
						<dd>{formatTime12h(time)}</dd>
					</div>
					<div>
						<dt>Comensales</dt>
						<dd>{guests} {Number(guests) === 1 ? 'persona' : 'personas'}</dd>
					</div>
					<div>
						<dt>Ocasión</dt>
						<dd>{type}</dd>
					</div>
					<div>
						<dt>Teléfono</dt>
						<dd>{phone}</dd>
					</div>
					<div>
						<dt>Correo electrónico</dt>
						<dd>{email}</dd>
					</div>
					<div className="detail-list__full">
						<dt>Peticiones / Notas</dt>
						<dd><em>"{notes}"</em></dd>
					</div>
				</dl>
			</section>
		</div>
	)
}
