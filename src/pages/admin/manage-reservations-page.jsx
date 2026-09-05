import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminReservations } from '../../features/admin-reservations/use-admin-reservations';
import ReservationsTable from '../../features/admin-reservations/components/reservations-table';
import ReservationDetailModal from '../../features/admin-reservations/components/reservation-detail-modal';
import { getTodayDateString, getNextDays } from '../../shared/utils/date-helpers';

export default function ManageReservationsPage() {
  const [searchParams] = useSearchParams();
  const initialStatusParam = searchParams.get('status') || '';
  const initialDateParam = searchParams.get('date') || '';

  const {
    reservations,
    loading,
    error,
    updatingId,
    changeStatus,
    createNewReservation,
    reload
  } = useAdminReservations();

  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState(initialStatusParam || 'ALL');
  const [dateFilter, setDateFilter] = useState(initialDateParam || '');
  const [mealTypeFilter, setMealTypeFilter] = useState('');

  // Estado para el modal de Crear Reserva Manual
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newResForm, setNewResForm] = useState({
    guestName: '',
    phone: '',
    email: '',
    date: getTodayDateString(),
    time: '19:00',
    guests: 2,
    type: 'Cena',
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [savingNew, setSavingNew] = useState(false);

  // Filtrado compuesto
  const filtered = reservations.filter((item) => {
    const itemStatus = item.estado || item.status || 'Pendiente';
    const itemDate = (item.fecha || item.date || '').slice(0, 10);
    const itemTime = item.hora || item.time || '';
    const itemHour = parseInt(itemTime.split(':')[0] || '12', 10);
    const isLunch = itemHour < 17;

    // Filtro por tab de estado
    if (statusTab !== 'ALL' && itemStatus !== statusTab) {
      return false;
    }

    // Filtro por fecha
    if (dateFilter && itemDate !== dateFilter) {
      return false;
    }

    // Filtro por turno (Almuerzo vs Cena)
    if (mealTypeFilter === 'Almuerzo' && !isLunch) return false;
    if (mealTypeFilter === 'Cena' && isLunch) return false;

    // Filtro textual
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = String(item.id).toLowerCase().includes(q);
      const matchName = String(item.guestName || item.cliente || item.name || '').toLowerCase().includes(q);
      const matchEmail = String(item.email || '').toLowerCase().includes(q);
      const matchPhone = String(item.phone || item.telefono || '').toLowerCase().includes(q);
      const matchNotes = String(item.notes || item.notas || '').toLowerCase().includes(q);
      return matchId || matchName || matchEmail || matchPhone || matchNotes;
    }

    return true;
  });

  // Conteo por estado
  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => (r.status || r.estado) === 'Pendiente').length,
    confirmed: reservations.filter((r) => (r.status || r.estado) === 'Confirmada').length,
    rejected: reservations.filter((r) => (r.status || r.estado) === 'Rechazada').length,
    cancelled: reservations.filter((r) => (r.status || r.estado) === 'Cancelada').length
  };

  const totalFilteredGuests = filtered.reduce((acc, curr) => acc + Number(curr.personas || curr.guests || 1), 0);

  // Exportar listado filtrado a CSV
  const handleExportCSV = () => {
    if (!filtered || filtered.length === 0) {
      alert('No hay reservas en la vista actual para exportar.');
      return;
    }

    const headers = ['ID', 'Comensal', 'Fecha', 'Hora', 'Personas', 'Turno/Ocasión', 'Estado', 'Teléfono', 'Email', 'Peticiones'];
    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${r.guestName || r.cliente || r.name || ''}"`,
      `"${r.fecha || r.date || ''}"`,
      `"${r.hora || r.time || ''}"`,
      r.personas || r.guests || 1,
      `"${r.tipo || r.type || 'Cena'}"`,
      `"${r.estado || r.status || 'Pendiente'}"`,
      `"${r.phone || r.telefono || ''}"`,
      `"${r.email || ''}"`,
      `"${(r.notes || r.notas || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `libro-reservas-donde-ray-${getTodayDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Guardar nueva reserva manual
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newResForm.guestName.trim()) {
      setFormError('El nombre del comensal es obligatorio.');
      return;
    }
    if (!newResForm.date || !newResForm.time) {
      setFormError('Fecha y hora son obligatorias.');
      return;
    }

    setSavingNew(true);
    const res = await createNewReservation({
      ...newResForm,
      personas: Number(newResForm.guests),
      guests: Number(newResForm.guests),
      fecha: newResForm.date,
      hora: newResForm.time,
      estado: 'Confirmada',
      status: 'Confirmada'
    });
    setSavingNew(false);

    if (res.success) {
      setIsCreateModalOpen(false);
      setNewResForm({
        guestName: '',
        phone: '',
        email: '',
        date: getTodayDateString(),
        time: '19:00',
        guests: 2,
        type: 'Cena',
        notes: ''
      });
    } else {
      setFormError(res.error || 'Error al guardar la reserva.');
    }
  };

  return (
    <main className="page">
      {/* Encabezado del Libro de Reservas */}
      <header className="page-heading">
        <div>
          <span className="eyebrow">Libro Maestro de Mesas · Donde Ray</span>
          <h1>Control de <em>reservas.</em></h1>
          <p className="lede">
            Buscador global multi-campo, filtros avanzados por estado y fecha, creación de reservas telefónicas/walk-in y descarga de reportes.
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Registrar reserva manual
          </button>
          <button
            type="button"
            className="button button--outline"
            onClick={handleExportCSV}
            title="Descargar listado en archivo Excel / CSV"
          >
            📥 Exportar reporte (CSV)
          </button>
        </div>
      </header>

      {error && <div className="notice error">{error}</div>}

      {/* Pestañas de Estado con Contadores en Vivo */}
      <div className="reservations-status-tabs" role="tablist" aria-label="Filtrar por estado">
        <button
          type="button"
          className={`status-tab-btn ${statusTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusTab('ALL')}
        >
          Todas <span>{counts.all}</span>
        </button>
        <button
          type="button"
          className={`status-tab-btn tab--pending ${statusTab === 'Pendiente' ? 'active' : ''}`}
          onClick={() => setStatusTab('Pendiente')}
        >
          Pendientes <span>{counts.pending}</span>
        </button>
        <button
          type="button"
          className={`status-tab-btn tab--confirmed ${statusTab === 'Confirmada' ? 'active' : ''}`}
          onClick={() => setStatusTab('Confirmada')}
        >
          Confirmadas <span>{counts.confirmed}</span>
        </button>
        <button
          type="button"
          className={`status-tab-btn tab--rejected ${statusTab === 'Rechazada' ? 'active' : ''}`}
          onClick={() => setStatusTab('Rechazada')}
        >
          Rechazadas <span>{counts.rejected}</span>
        </button>
        <button
          type="button"
          className={`status-tab-btn tab--cancelled ${statusTab === 'Cancelada' ? 'active' : ''}`}
          onClick={() => setStatusTab('Cancelada')}
        >
          Canceladas <span>{counts.cancelled}</span>
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros Avanzados */}
      <section className="panel" style={{ gap: '16px', padding: '24px' }}>
        <div className="admin-search-toolbar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por comensal, código, teléfono o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filters-inline-row">
            <label className="filter-label">
              <span>Fecha:</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </label>

            <label className="filter-label">
              <span>Turno:</span>
              <select
                value={mealTypeFilter}
                onChange={(e) => setMealTypeFilter(e.target.value)}
              >
                <option value="">Todos los turnos</option>
                <option value="Almuerzo">☀️ Almuerzo (12:00 - 15:00)</option>
                <option value="Cena">🌙 Cena (18:00 - 22:00)</option>
              </select>
            </label>

            {(dateFilter || mealTypeFilter || searchTerm || statusTab !== 'ALL') && (
              <button
                type="button"
                className="button button.ghost"
                style={{ padding: '8px 14px' }}
                onClick={() => {
                  setDateFilter('');
                  setMealTypeFilter('');
                  setSearchTerm('');
                  setStatusTab('ALL');
                }}
              >
                Restablecer filtros
              </button>
            )}
          </div>
        </div>

        {/* Resumen de la Vista Filtrada */}
        <div className="filtered-summary-strip">
          <span>
            Mostrando <strong>{filtered.length}</strong> {filtered.length === 1 ? 'reserva' : 'reservas'}
            &nbsp;·&nbsp; <strong>{totalFilteredGuests}</strong> {totalFilteredGuests === 1 ? 'comensal' : 'comensales en total'}
          </span>
          <button
            type="button"
            className="button button.ghost"
            style={{ padding: '4px 10px', fontSize: '11px' }}
            onClick={reload}
          >
            ↻ Refrescar datos
          </button>
        </div>

        {/* Tabla Maestra de Reservas */}
        <ReservationsTable
          reservations={filtered}
          loading={loading}
          error={error}
          updatingId={updatingId}
          onStatusChange={async (reservation, nextStatus) => {
            await changeStatus(reservation.id, nextStatus);
          }}
          onView={setSelected}
        />
      </section>

      {/* Modal de Detalle */}
      {selected && <ReservationDetailModal reservation={selected} onClose={() => setSelected(null)} />}

      {/* Modal de Crear Reserva Manual */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsCreateModalOpen(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(560px, calc(100% - 32px))' }}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
            >
              ×
            </button>
            <p className="eyebrow">Recepción / Teléfono</p>
            <h2>Registrar Reserva <em>Manual</em></h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 18px' }}>
              Registra una mesa tomada por teléfono, WhatsApp directo o comensal presencial (Walk-in).
            </p>

            {formError && <div className="notice error" style={{ marginBottom: '14px' }}>{formError}</div>}

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label className="filter-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Nombre del Comensal *:</span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofia Valverde"
                    value={newResForm.guestName}
                    onChange={(e) => setNewResForm({ ...newResForm, guestName: e.target.value })}
                  />
                </label>
                <label className="filter-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Teléfono de Contacto:</span>
                  <input
                    type="tel"
                    placeholder="Ej. +506 8888-0000"
                    value={newResForm.phone}
                    onChange={(e) => setNewResForm({ ...newResForm, phone: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '12px' }}>
                <label className="filter-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Fecha *:</span>
                  <input
                    type="date"
                    required
                    value={newResForm.date}
                    onChange={(e) => setNewResForm({ ...newResForm, date: e.target.value })}
                  />
                </label>
                <label className="filter-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Hora *:</span>
                  <select
                    value={newResForm.time}
                    onChange={(e) => setNewResForm({ ...newResForm, time: e.target.value })}
                  >
                    <option value="12:00">12:00 (Almuerzo)</option>
                    <option value="13:00">13:00 (Almuerzo)</option>
                    <option value="14:00">14:00 (Almuerzo)</option>
                    <option value="15:00">15:00 (Almuerzo)</option>
                    <option value="18:00">18:00 (Cena)</option>
                    <option value="19:00">19:00 (Cena)</option>
                    <option value="20:00">20:00 (Cena)</option>
                    <option value="21:00">21:00 (Cena)</option>
                    <option value="22:00">22:00 (Cena)</option>
                  </select>
                </label>
                <label className="filter-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Personas:</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newResForm.guests}
                    onChange={(e) => setNewResForm({ ...newResForm, guests: e.target.value })}
                  />
                </label>
              </div>

              <label className="filter-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Ocasión / Tipo de Servicio:</span>
                <select
                  value={newResForm.type}
                  onChange={(e) => setNewResForm({ ...newResForm, type: e.target.value })}
                >
                  <option value="Cena">Cena</option>
                  <option value="Almuerzo">Almuerzo</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Aniversario">Aniversario</option>
                  <option value="Negocios">Negocios</option>
                  <option value="Especial">Especial</option>
                </select>
              </label>

              <label className="filter-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Notas, Alergias o Peticiones Especiales:</span>
                <textarea
                  rows="3"
                  placeholder="Ej. Mesa en terraza jardín, 1 comensal celíaco..."
                  value={newResForm.notes}
                  onChange={(e) => setNewResForm({ ...newResForm, notes: e.target.value })}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    background: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '13px'
                  }}
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="button button.ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={savingNew}
                >
                  {savingNew ? 'Guardando...' : 'Confirmar e ingresar reserva →'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
