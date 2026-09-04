const cards = [
	['pending', 'Pendientes', 'pending'],
	['confirmed', 'Confirmadas', 'confirmed'],
	['rejected', 'Rechazadas', 'rejected'],
	['today', 'Reservas de hoy', 'today'],
	['clients', 'Clientes registrados', 'clients'],
]

export default function StatsSummary({ stats, loading }) {
	return <section className="stats-grid" aria-label="Resumen de actividad">
		{cards.map(([key, label, tone]) => <article className={`stat-card ${tone}`} key={key}>
			<span>{label}</span>
			<strong>{loading ? '...' : stats[key]}</strong>
		</article>)}
	</section>
}
