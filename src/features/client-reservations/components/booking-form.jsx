import { useMemo, useState } from 'react';
import {
  MAX_CAPACITY_PER_SLOT,
  validateReservationForm
} from '../../../shared/utils/reservation-rules.js';
import { formatDateToSpanish, formatTime12h } from '../../../shared/utils/date-helpers.js';

const OCCASION_CARDS = [
  { id: 'Cena', label: 'Cena Gourmet' },
  { id: 'Romántica', label: 'Romántica' },
  { id: 'Cumpleaños', label: 'Cumpleaños' },
  { id: 'Aniversario', label: 'Aniversario' },
  { id: 'Negocios', label: 'Negocios' },
  { id: 'Familiar', label: 'Familiar' },
  { id: 'Otro', label: 'Casual / Otro' }
];

export const BookingForm = ({
  selectedDate,
  selectedTime,
  currentUser,
  guestsCount,
  onGuestsChange,
  onSubmit,
  isSubmitting = false,
  limitReached = false,
  apiError = null
}) => {
  const [formData, setFormData] = useState({
    guestName: currentUser?.guestName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    type: 'Cena',
    notes: ''
  });

  // Ajustar estado durante renderizado si currentUser se resuelve asíncronamente
  const [prevUser, setPrevUser] = useState(currentUser);
  if (currentUser !== prevUser) {
    setPrevUser(currentUser);
    setFormData((prev) => ({
      ...prev,
      guestName: prev.guestName || currentUser?.guestName || '',
      email: prev.email || currentUser?.email || '',
      phone: prev.phone || currentUser?.phone || ''
    }));
  }

  const [touched, setTouched] = useState({});
  const validationResult = useMemo(() => {
    const dataToValidate = {
      ...formData,
      guestName: formData.guestName || currentUser?.guestName || '',
      email: formData.email || currentUser?.email || '',
      phone: formData.phone || currentUser?.phone || '',
      date: selectedDate,
      time: selectedTime,
      guests: guestsCount
    };
    return validateReservationForm(dataToValidate);
  }, [formData, currentUser, selectedDate, selectedTime, guestsCount]);
  const validationErrors = validationResult.errors;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      guestName: true,
      email: true,
      phone: true,
      type: true,
      notes: true
    });

    const fullPayload = {
      ...formData,
      guestName: (formData.guestName || currentUser?.guestName || '').trim(),
      email: (formData.email || currentUser?.email || '').trim(),
      phone: (formData.phone || currentUser?.phone || '').trim(),
      date: selectedDate,
      time: selectedTime,
      guests: Number(guestsCount)
    };

    const { isValid } = validateReservationForm(fullPayload);
    if (!isValid) {
      return;
    }

    if (limitReached) {
      return;
    }

    onSubmit(fullPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="reservation-panel" noValidate>
      {/* Encabezado del Formulario */}
      <div className="reservation-panel-header">
        <span className="eyebrow" style={{ marginBottom: '8px' }}>Paso 2</span>
        <h3>Detalles de la Reserva</h3>
        <p>Completa la información de contacto para asegurar tu mesa frente al mar.</p>
      </div>

      {/* Resumen dinámico de selección */}
      <div className="reservation-summary-strip">
        <div className="summary-meta-item">
          <span className="summary-meta-label">Fecha</span>
          <span className="summary-meta-val">
            {formatDateToSpanish(selectedDate) || 'Sin seleccionar'}
          </span>
        </div>
        <div className="summary-meta-item">
          <span className="summary-meta-label">Turno</span>
          <span
            className="summary-meta-val"
            style={{ color: selectedTime ? 'var(--green)' : 'var(--gold)' }}
          >
            {selectedTime ? formatTime12h(selectedTime) : 'Selecciona un turno'}
          </span>
        </div>
        <div className="summary-meta-item">
          <span className="summary-meta-label">Estado</span>
          <span className="status-pill-editorial">Pendiente</span>
        </div>
      </div>

      {/* Error de API o Regla de Negocio */}
      {apiError && (
        <div className="reservation-alert-warning" role="alert">
          <div>
            <strong>Aviso de reserva</strong>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Campo: Número de Personas */}
      <div className="reservation-field-group">
        <label className="reservation-field-label">
          Personas (Cupo máximo: {MAX_CAPACITY_PER_SLOT})
        </label>
        <div className="guest-selector">
          <button
            type="button"
            className="guest-step-btn"
            onClick={() => onGuestsChange(Math.max(1, guestsCount - 1))}
            disabled={guestsCount <= 1}
            aria-label="Disminuir personas"
          >
            −
          </button>
          <span className="guest-count-display">
            {guestsCount} {guestsCount === 1 ? 'persona' : 'personas'}
          </span>
          <button
            type="button"
            className="guest-step-btn"
            onClick={() => onGuestsChange(Math.min(MAX_CAPACITY_PER_SLOT, guestsCount + 1))}
            disabled={guestsCount >= MAX_CAPACITY_PER_SLOT}
            aria-label="Aumentar personas"
          >
            +
          </button>
        </div>
      </div>

      {/* Selector Visual de Tipo de Ocasión */}
      <div className="reservation-field-group">
        <label className="reservation-field-label">Tipo de Ocasión</label>
        <div className="occasion-grid">
          {OCCASION_CARDS.map((occ) => {
            const isSelected = formData.type === occ.id;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => handleChange('type', occ.id)}
                className={`occasion-btn ${isSelected ? 'occasion-btn--active' : ''}`}
              >
                {occ.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Campos de Contacto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Nombre completo */}
        <div className="reservation-field-group">
          <label htmlFor="guest-name-input" className="reservation-field-label">
            Nombre del Titular *
          </label>
          <input
            id="guest-name-input"
            type="text"
            placeholder="Ej: Daniel Ramírez"
            value={formData.guestName}
            onChange={(e) => handleChange('guestName', e.target.value)}
            onBlur={() => handleBlur('guestName')}
            className={`reservation-input ${touched.guestName && validationErrors.guestName ? 'is-invalid' : ''}`.trim()}
          />
          {touched.guestName && validationErrors.guestName && (
            <span style={{ fontSize: '11px', color: '#dc2626' }}>{validationErrors.guestName}</span>
          )}
        </div>

        {/* Teléfono */}
        <div className="reservation-field-group">
          <label htmlFor="guest-phone-input" className="reservation-field-label">
            Teléfono de Contacto *
          </label>
          <input
            id="guest-phone-input"
            type="tel"
            placeholder="Ej: +506 8888 1234"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            className={`reservation-input ${touched.phone && validationErrors.phone ? 'is-invalid' : ''}`.trim()}
          />
          {touched.phone && validationErrors.phone && (
            <span style={{ fontSize: '11px', color: '#dc2626' }}>{validationErrors.phone}</span>
          )}
        </div>
      </div>

      {/* Correo Electrónico */}
      <div className="reservation-field-group">
        <label htmlFor="guest-email-input" className="reservation-field-label">
          Correo Electrónico *
        </label>
        <input
          id="guest-email-input"
          type="email"
          placeholder="tu@correo.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`reservation-input ${touched.email && validationErrors.email ? 'is-invalid' : ''}`.trim()}
        />
        {touched.email && validationErrors.email && (
          <span style={{ fontSize: '11px', color: '#dc2626' }}>{validationErrors.email}</span>
        )}
      </div>

      {/* Peticiones Especiales */}
      <div className="reservation-field-group">
        <label htmlFor="reservation-notes-input" className="reservation-field-label">
          Peticiones Especiales (Opcional)
        </label>
        <textarea
          id="reservation-notes-input"
          rows={3}
          placeholder="Alergias o preferencias de ubicación en terraza o salón principal..."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="reservation-input reservation-textarea"
          maxLength={300}
        />
      </div>

      {/* Botón de Envío */}
      <button
        type="submit"
        disabled={isSubmitting || limitReached || !selectedTime}
        className="button button--primary"
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: '13px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginTop: '6px',
          cursor: isSubmitting || limitReached || !selectedTime ? 'not-allowed' : 'pointer',
          opacity: isSubmitting || limitReached || !selectedTime ? 0.6 : 1
        }}
      >
        {isSubmitting ? (
          'Confirmando reserva...'
        ) : !selectedTime ? (
          'Selecciona un horario para continuar'
        ) : limitReached ? (
          'Límite de 5 reservas alcanzado para esta fecha'
        ) : (
          `Confirmar Reserva · ${guestsCount} ${guestsCount === 1 ? 'persona' : 'personas'} →`
        )}
      </button>
    </form>
  );
};

export default BookingForm;
