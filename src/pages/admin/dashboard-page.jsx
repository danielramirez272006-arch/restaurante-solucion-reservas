import { useState } from 'react'
import StatsSummary from '../../features/admin-dashboard/components/stats-summary'
import { useAdminStats } from '../../features/admin-dashboard/use-admin-stats'
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations'
import DateFilters from '../../features/admin-reservations/components/date-filters'
import ReservationsTable from '../../features/admin-reservations/components/reservations-table'
import ReservationDetailModal from '../../features/admin-reservations/components/reservation-detail-modal'

export default function DashboardPage() {
	const statsState = useAdminStats()
	const reservationState = useAdminReservations()
	const [selected, setSelected] = useState(null)
	const [date, setDate] = useState('')
	const [status, setStatus] = useState('')
	const filtered = reservationState.reservations.filter((item) => (!date || (item.fecha || item.date || '').slice(0, 10) === date) && (!status || (item.estado || item.status) === status))
	const refresh = async (reservation, nextStatus) => {
		await reservationState.changeStatus(reservation.id, nextStatus)
		await statsState.reload()
	}
	return <main className="page"><header className="page-heading"><div><p className="eyebrow">Donde Ray / Administración</p><h1>Resumen operativo</h1><p className="lede">Supervisa el ritmo del restaurante y responde a las reservas.</p></div><button className="button secondary" type="button" onClick={() => { reservationState.reload(); statsState.reload() }}>Actualizar</button></header>
		{(statsState.error || reservationState.error) && <div className="notice error">{statsState.error || reservationState.error}</div>}
		<StatsSummary stats={statsState.stats} loading={statsState.loading} />
		<section className="panel"><div className="panel-heading"><div><p className="eyebrow">Agenda</p><h2>Reservas recientes</h2></div><DateFilters date={date} status={status} onDateChange={setDate} onStatusChange={setStatus} onClear={() => { setDate(''); setStatus('') }} /></div>
			<ReservationsTable reservations={filtered} loading={reservationState.loading} error={reservationState.error} updatingId={reservationState.updatingId} onStatusChange={refresh} onView={setSelected} />
		</section><ReservationDetailModal reservation={selected} onClose={() => setSelected(null)} />
	</main>
}
