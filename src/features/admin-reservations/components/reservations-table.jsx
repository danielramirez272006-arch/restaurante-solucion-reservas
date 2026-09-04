import ActionButtons from './action-buttons'

function value(item, ...keys) {
	return keys.map((key) => item[key]).find((entry) => entry !== undefined && entry !== null && entry !== '') || '—'
}

export default function ReservationsTable({ reservations, loading, error, onStatusChange, onView, updatingId }) {
	if (loading) return <div className="state">Cargando reservas...</div>
	if (error) return <div className="state error">{error}</div>
	if (!reservations.length) return <div className="state">No hay reservas para mostrar.</div>
	return <div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Fecha</th><th>Hora</th><th>Personas</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead>
		<tbody>{reservations.map((reservation) => <tr key={reservation.id}>
			<td>{value(reservation, 'cliente', 'nombreCliente', 'userName', 'name')}</td>
			<td>{value(reservation, 'fecha', 'date')}</td>
			<td>{value(reservation, 'hora', 'time')}</td>
			<td>{value(reservation, 'personas', 'guests', 'numberOfPeople')}</td>
			<td>{value(reservation, 'tipo', 'type', 'ocasion')}</td>
			<td><span className={`status ${String(reservation.estado || '').toLowerCase()}`}>{value(reservation, 'estado', 'status')}</span></td>
			<td><ActionButtons reservation={reservation} onStatusChange={onStatusChange} onView={onView} busy={updatingId === reservation.id} /></td>
		</tr>)}</tbody></table></div>
}
