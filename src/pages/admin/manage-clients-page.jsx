import { useState } from 'react'
import ClientsTable from '../../features/admin-clients/components/clients-table'
import ClientHistoryModal from '../../features/admin-clients/components/client-history-modal'
import { useAdminClients } from '../../features/admin-clients/use-admin-clients'
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations'

export default function ManageClientsPage() {
	const { clients, loading, error, reload } = useAdminClients()
	const { reservations } = useAdminReservations()
	const [selected, setSelected] = useState(null)
	return <main className="page"><header className="page-heading"><div><p className="eyebrow">Donde Ray / Administración</p><h1>Clientes registrados</h1><p className="lede">Consulta la base de clientes y su actividad.</p></div><button className="button secondary" type="button" onClick={reload}>Actualizar</button></header>
		<section className="panel"><div className="panel-heading"><div><p className="eyebrow">Directorio</p><h2>{clients.length} clientes</h2></div></div><ClientsTable clients={clients} loading={loading} error={error} /></section>
		{selected && <ClientHistoryModal client={selected} reservations={reservations} onClose={() => setSelected(null)} />}
	</main>
}
