export default function ReservationDetailModal({ reservation, onClose }) {
	if (!reservation) return null
	return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="reservation-detail" onClick={(event) => event.stopPropagation()}>
		<button className="modal-close" type="button" aria-label="Cerrar" onClick={onClose}>×</button>
		<p className="eyebrow">Reserva #{reservation.id}</p><h2 id="reservation-detail">Detalle de la reserva</h2>
		<dl className="detail-list">{Object.entries(reservation).filter(([key]) => key !== 'id').map(([key, item]) => <div key={key}><dt>{key}</dt><dd>{String(item)}</dd></div>)}</dl>
	</section></div>
}
