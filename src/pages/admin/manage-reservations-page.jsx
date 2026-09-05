import { useState } from 'react'
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations'
import DateFilters from '../../features/admin-reservations/components/date-filters'
import ReservationsTable from '../../features/admin-reservations/components/reservations-table'
import ReservationDetailModal from '../../features/admin-reservations/components/reservation-detail-modal'

export default function ManageReservationsPage() {
	const reservationState = useAdminReservations()
	const [selected, setSelected] = useState(null)
	const [date, setDate] = useState('')
	const [status, setStatus] = useState('')

	const filtered = reservationState.reservations.filter(
		(item) =>
			(!date || (item.fecha || item.date || '').slice(0, 10) === date) &&
			(!status || (item.estado || item.status) === status)
	)

	const refresh = async (reservation, nextStatus) => {
		await reservationState.changeStatus(reservation.id, nextStatus)
	}

	return (
		<main className="page">
			<header className="page-heading">
				<div>
					<p className="eyebrow">Donde Ray / Administración</p>
					<h1>Gestión de Reservas</h1>
					<p className="lede">
						Consulta, filtra y cambia el estado de las reservas registradas.
					</p>
				</div>
				<button
					className="button secondary"
					type="button"
					onClick={() => reservationState.reload()}
				>
					Actualizar
				</button>
			</header>

			{reservationState.error && (
				<div className="notice error">{reservationState.error}</div>
			)}

			<section className="panel">
				<div className="panel-heading">
					<div>
						<p className="eyebrow">Agenda Completa</p>
						<h2>
							{filtered.length}{' '}
							{filtered.length === 1 ? 'reserva' : 'reservas'}
						</h2>
					</div>
					<DateFilters
						date={date}
						status={status}
						onDateChange={setDate}
						onStatusChange={setStatus}
						onClear={() => {
							setDate('')
							setStatus('')
						}}
					/>
				</div>
				<ReservationsTable
					reservations={filtered}
					loading={reservationState.loading}
					error={reservationState.error}
					updatingId={reservationState.updatingId}
					onStatusChange={refresh}
					onView={setSelected}
				/>
			</section>

			<ReservationDetailModal
				reservation={selected}
				onClose={() => setSelected(null)}
			/>
		</main>
	)
}
