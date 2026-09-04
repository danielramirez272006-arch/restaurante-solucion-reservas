export default function ActionButtons({ reservation, onStatusChange, onView, busy }) {
	const canAct = reservation.estado === 'Pendiente'
	return <div className="actions">
		<button className="button ghost" type="button" onClick={() => onView(reservation)}>Ver detalle</button>
		{canAct && <>
			<button className="button confirm" type="button" disabled={busy} onClick={() => onStatusChange(reservation, 'Confirmada')}>Confirmar</button>
			<button className="button danger" type="button" disabled={busy} onClick={() => onStatusChange(reservation, 'Rechazada')}>Rechazar</button>
		</>}
	</div>
}
