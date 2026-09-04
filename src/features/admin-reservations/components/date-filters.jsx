export default function DateFilters({ date, status, onDateChange, onStatusChange, onClear }) {
	return <div className="filters" aria-label="Filtros de reservas">
		<label>Fecha <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} /></label>
		<label>Estado <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
			<option value="">Todos</option>
			{['Pendiente', 'Confirmada', 'Rechazada', 'Cancelada', 'Completada'].map((item) => <option key={item}>{item}</option>)}
		</select></label>
		<button className="button secondary" type="button" onClick={onClear}>Limpiar</button>
	</div>
}
