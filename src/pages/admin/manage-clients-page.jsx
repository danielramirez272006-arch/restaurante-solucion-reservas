import { useMemo, useState } from 'react'
import ClientsTable from '../../features/admin-clients/components/clients-table'
import ClientHistoryModal from '../../features/admin-clients/components/client-history-modal'
import { useAdminClients } from '../../features/admin-clients/use-admin-clients'
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations'

export default function ManageClientsPage() {
	const { clients, loading, error, reload } = useAdminClients()
	const { reservations } = useAdminReservations()
	const [selected, setSelected] = useState(null)

	const clientsWithReservations = useMemo(() => {
		return clients
			.filter((c) => c.role !== 'admin')
			.map((client) => {
				const history = reservations.filter(
					(res) =>
						res.userId === client.id ||
						res.clienteId === client.id ||
						res.email === client.email
				)
				return {
					...client,
					reservationCount: history.length,
				}
			})
	}, [clients, reservations])

	return (
		<main className="page">
			<header className="page-heading">
				<div>
					<p className="eyebrow">Donde Ray / Administración</p>
					<h1>Directorio de Clientes</h1>
					<p className="lede">
						Consulta la base de comensales registrados y su historial de visitas.
					</p>
				</div>
				<button className="button secondary" type="button" onClick={reload}>
					Actualizar
				</button>
			</header>

			<section className="panel">
				<div className="panel-heading">
					<div>
						<p className="eyebrow">Directorio</p>
						<h2>
							{clientsWithReservations.length}{' '}
							{clientsWithReservations.length === 1 ? 'cliente registrado' : 'clientes registrados'}
						</h2>
					</div>
				</div>
				<ClientsTable
					clients={clientsWithReservations}
					loading={loading}
					error={error}
					onView={setSelected}
				/>
			</section>

			{selected && (
				<ClientHistoryModal
					client={selected}
					reservations={reservations}
					onClose={() => setSelected(null)}
				/>
			)}
		</main>
	)
}
