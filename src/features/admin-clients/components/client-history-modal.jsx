export default function ClientHistoryModal({ client, reservations = [], onClose }) {
	if (!client) return null
	const name = client.nombre || client.name || client.email
	const history = reservations.filter((item) => item.userId === client.id || item.clienteId === client.id || item.email === client.email)
	return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
		<button className="modal-close" type="button" aria-label="Cerrar" onClick={onClose}>×</button><p className="eyebrow">Cliente</p><h2>Historial de {name}</h2>
		<p>{client.email || 'Sin correo registrado'}</p><div className="history">{history.length ? history.map((item) => <div className="history-row" key={item.id}><span>{item.fecha || item.date || 'Sin fecha'}</span><span>{item.estado || item.status || 'Sin estado'}</span></div>) : <div className="state">No hay reservas asociadas.</div>}</div>
	</section></div>
}
