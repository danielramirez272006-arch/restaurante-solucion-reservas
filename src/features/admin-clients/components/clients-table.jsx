export default function ClientsTable({ clients, loading, error, onView }) {
	if (loading) return <div className="state">Cargando clientes...</div>
	if (error) return <div className="state error">{error}</div>
	if (!clients.length) return <div className="state">No hay clientes registrados.</div>
	return <div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Reservas</th><th></th></tr></thead><tbody>
		{clients.map((client) => <tr key={client.id}><td>{client.nombre || client.name || '—'}</td><td>{client.email || '—'}</td><td>{client.telefono || client.phone || '—'}</td><td>{client.reservas?.length ?? client.reservationCount ?? '—'}</td><td>{onView && <button className="button ghost" type="button" onClick={() => onView(client)}>Ver historial</button>}</td></tr>)}
	</tbody></table></div>
}
