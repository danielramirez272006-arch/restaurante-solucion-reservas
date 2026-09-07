const cards = [
  ['pending', 'Pendientes', 'pending', '01', 'Requieren confirmación del equipo'],
  ['confirmed', 'Confirmadas', 'confirmed', '02', 'Mesas listas para el servicio'],
  ['rejected', 'Rechazadas', 'rejected', '03', 'Canceladas o sin aforo'],
  ['today', 'Reservas de hoy', 'today', '04', 'Turnos de almuerzo y cena'],
  ['clients', 'Clientes registrados', 'clients', '05', 'Base histórica de clientes']
];

export default function StatsSummary({ stats, loading }) {
  return (
    <section className="stats-grid" aria-label="Resumen de actividad operativa">
      {cards.map(([key, label, tone, number, hint]) => (
        <article className={`stat-card ${tone}`} key={key}>
          <div className="stat-card-top">
            <span className="card-number">{number}</span>
            <span className="stat-label">{label}</span>
          </div>
          <strong className="stat-value">{loading ? '...' : (stats?.[key] ?? 0)}</strong>
          <small className="stat-caption">{hint}</small>
        </article>
      ))}
    </section>
  );
}
