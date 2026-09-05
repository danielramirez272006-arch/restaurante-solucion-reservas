import { useMemo, useState } from 'react';
import {
  MAX_CAPACITY_PER_SLOT,
  validateReservationForm
} from '../../../shared/utils/reservation-rules.js';
import { formatDateToSpanish, formatTime12h } from '../../../shared/utils/date-helpers.js';

const OCCASION_CARDS = [
  { id: 'Cena', label: 'Cena Gourmet', icon: '🍷' },
  { id: 'Romántica', label: 'Cena Romántica', icon: '🕯️' },
  { id: 'Cumpleaños', label: 'Cumpleaños', icon: '🎂' },
  { id: 'Aniversario', label: 'Aniversario', icon: '🥂' },
  { id: 'Negocios', label: 'Negocios', icon: '💼' },
  { id: 'Familiar', label: 'Reunión Familiar', icon: '👨‍👩‍👧‍👦' },
  { id: 'Otro', label: 'Casual / Otro', icon: '✨' }
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
    guestName: currentUser?.name || currentUser?.guestName || '',
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
      guestName: prev.guestName || currentUser?.name || currentUser?.guestName || '',
      email: prev.email || currentUser?.email || '',
      phone: prev.phone || currentUser?.phone || ''
    }));
  }

  const [touched, setTouched] = useState({});
  const validationResult = useMemo(() => {
    const dataToValidate = {
      ...formData,
      guestName: formData.guestName || currentUser?.name || currentUser?.guestName || '',
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
      guestName: (formData.guestName || currentUser?.name || currentUser?.guestName || '').trim(),
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
    <form onSubmit={handleSubmit} style={styles.formCard} noValidate>
      <div style={styles.header}>
        <div style={styles.iconCircle}>🍽️</div>
        <div>
          <h3 style={styles.title}>Detalles de la Reserva</h3>
          <p style={styles.subtitle}>Completa la información del comensal principal</p>
        </div>
      </div>

      {/* Resumen dinámico de selección */}
      <div style={styles.summaryBox}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Fecha seleccionada:</span>
          <span style={styles.summaryValue}>
            {formatDateToSpanish(selectedDate) || 'No seleccionada'}
          </span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Hora seleccionada:</span>
          <span
            style={{
              ...styles.summaryValue,
              color: selectedTime ? '#ffd89b' : '#f87171'
            }}
          >
            {selectedTime ? formatTime12h(selectedTime) : '⚠️ Elige una franja en el horario'}
          </span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Estado inicial:</span>
          <span style={styles.statusBadge}>Pendiente</span>
        </div>
      </div>

      {/* Error de API o Regla de Negocio */}
      {apiError && (
        <div style={styles.apiErrorBanner} role="alert">
          <span style={{ fontSize: '18px' }}>🚫</span>
          <span>{apiError}</span>
        </div>
      )}

      {/* Campo: Número de Comensales */}
      <div style={styles.fieldGroup}>
        <div style={styles.labelRow}>
          <label htmlFor="guests-count-input" style={styles.label}>
            Número de Personas (Máx. {MAX_CAPACITY_PER_SLOT}):
          </label>
          <span style={styles.guestsValueDisplay}>
            👥 {guestsCount} {guestsCount === 1 ? 'Persona' : 'Personas'}
          </span>
        </div>
        <div style={styles.guestsCounterWrapper}>
          <button
            type="button"
            style={styles.counterBtn}
            onClick={() => onGuestsChange(Math.max(1, guestsCount - 1))}
            disabled={guestsCount <= 1}
            aria-label="Disminuir comensales"
          >
            -
          </button>
          <input
            id="guests-count-input"
            type="number"
            min={1}
            max={MAX_CAPACITY_PER_SLOT}
            value={guestsCount}
            onChange={(e) => {
              const val = Math.min(MAX_CAPACITY_PER_SLOT, Math.max(1, Number(e.target.value) || 1));
              onGuestsChange(val);
            }}
            style={styles.counterInput}
          />
          <button
            type="button"
            style={styles.counterBtn}
            onClick={() => onGuestsChange(Math.min(MAX_CAPACITY_PER_SLOT, guestsCount + 1))}
            disabled={guestsCount >= MAX_CAPACITY_PER_SLOT}
            aria-label="Aumentar comensales"
          >
            +
          </button>
        </div>
      </div>

      {/* Selector Visual de Tipo de Ocasión */}
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Tipo de Ocasión:</label>
        <div style={styles.occasionsGrid}>
          {OCCASION_CARDS.map((occ) => {
            const isSelected = formData.type === occ.id;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => handleChange('type', occ.id)}
                style={{
                  ...styles.occasionCard,
                  ...(isSelected ? styles.occasionCardSelected : {})
                }}
              >
                <span style={styles.occasionIcon}>{occ.icon}</span>
                <span style={styles.occasionLabel}>{occ.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de 2 columnas para Datos de Contacto */}
      <div style={styles.rowGrid}>
        {/* Nombre completo */}
        <div style={styles.fieldGroup}>
          <label htmlFor="guest-name-input" style={styles.label}>
            Nombre del Titular *
          </label>
          <input
            id="guest-name-input"
            type="text"
            placeholder="Ej: Daniel Ramírez"
            value={formData.guestName}
            onChange={(e) => handleChange('guestName', e.target.value)}
            onBlur={() => handleBlur('guestName')}
            style={{
              ...styles.input,
              borderColor:
                touched.guestName && validationErrors.guestName ? '#f87171' : 'rgba(255, 255, 255, 0.15)'
            }}
          />
          {touched.guestName && validationErrors.guestName && (
            <span style={styles.errorText}>{validationErrors.guestName}</span>
          )}
        </div>

        {/* Teléfono */}
        <div style={styles.fieldGroup}>
          <label htmlFor="guest-phone-input" style={styles.label}>
            Teléfono de Contacto *
          </label>
          <input
            id="guest-phone-input"
            type="tel"
            placeholder="Ej: +57 300 123 4567"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            style={{
              ...styles.input,
              borderColor:
                touched.phone && validationErrors.phone ? '#f87171' : 'rgba(255, 255, 255, 0.15)'
            }}
          />
          {touched.phone && validationErrors.phone && (
            <span style={styles.errorText}>{validationErrors.phone}</span>
          )}
        </div>
      </div>

      {/* Correo Electrónico */}
      <div style={styles.fieldGroup}>
        <label htmlFor="guest-email-input" style={styles.label}>
          Correo Electrónico para confirmación *
        </label>
        <input
          id="guest-email-input"
          type="email"
          placeholder="cliente@ejemplo.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          style={{
            ...styles.input,
            borderColor:
              touched.email && validationErrors.email ? '#f87171' : 'rgba(255, 255, 255, 0.15)'
          }}
        />
        {touched.email && validationErrors.email && (
          <span style={styles.errorText}>{validationErrors.email}</span>
        )}
      </div>

      {/* Peticiones especiales */}
      <div style={styles.fieldGroup}>
        <label htmlFor="reservation-notes-input" style={styles.label}>
          Peticiones Especiales / Alergias (Opcional):
        </label>
        <textarea
          id="reservation-notes-input"
          rows={3}
          placeholder="Ej: Mesa cerca a la ventana, silla para niño, opción vegetariana, decoración de aniversario..."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          style={styles.textarea}
        />
      </div>

      {/* Botón de Envío con feedback */}
      <button
        type="submit"
        disabled={isSubmitting || limitReached || !selectedTime}
        style={{
          ...styles.submitButton,
          ...(isSubmitting || limitReached || !selectedTime ? styles.submitButtonDisabled : {})
        }}
      >
        {isSubmitting ? (
          <span style={styles.btnContent}>
            <div style={styles.btnSpinner} />
            Confirmando reserva...
          </span>
        ) : !selectedTime ? (
          '👉 Selecciona un horario arriba para continuar'
        ) : limitReached ? (
          '🚫 Límite de 5 reservas alcanzado para esta fecha'
        ) : (
          `✨ Confirmar Reserva para ${guestsCount} ${guestsCount === 1 ? 'persona' : 'personas'}`
        )}
      </button>
    </form>
  );
};

const styles = {
  formCard: {
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 10px 30px rgba(32, 40, 32, 0.05)',
    color: '#202820',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderBottom: '1px solid #e8e4db',
    paddingBottom: '16px'
  },
  iconCircle: {
    fontSize: '22px',
    background: 'rgba(48, 75, 61, 0.08)',
    color: '#304b3d',
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: '1px solid rgba(48, 75, 61, 0.18)'
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '500',
    fontFamily: 'Newsreader, Georgia, serif',
    color: '#202820'
  },
  subtitle: {
    margin: '3px 0 0',
    fontSize: '13px',
    color: '#73786f'
  },
  summaryBox: {
    background: '#f4f1e9',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #d6d1c5',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  summaryLabel: {
    fontSize: '11px',
    color: '#73786f',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: '600'
  },
  summaryValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#202820'
  },
  statusBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#b17a3c',
    background: '#fffbeb',
    padding: '3px 10px',
    borderRadius: '6px',
    border: '1px solid #fcd34d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  apiErrorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
    padding: '14px 18px',
    borderRadius: '10px',
    fontSize: '13px'
  },
  occasionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '10px'
  },
  occasionCard: {
    background: '#faf9f6',
    border: '1px solid #d6d1c5',
    borderRadius: '10px',
    padding: '12px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#202820',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.15s ease',
    outline: 'none',
    textAlign: 'left'
  },
  occasionCardSelected: {
    background: '#304b3d',
    borderColor: '#304b3d',
    color: '#ffffff',
    fontWeight: '600',
    boxShadow: '0 4px 14px rgba(48, 75, 61, 0.22)'
  },
  occasionIcon: {
    fontSize: '18px'
  },
  occasionLabel: {
    flex: 1,
    lineHeight: '1.2'
  },
  rowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#202820',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  guestsValueDisplay: {
    fontSize: '13px',
    color: '#b17a3c',
    fontWeight: '600'
  },
  guestsCounterWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#f4f1e9',
    border: '1px solid #d6d1c5',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '44px'
  },
  counterBtn: {
    background: 'transparent',
    border: 'none',
    color: '#202820',
    fontSize: '20px',
    fontWeight: 'bold',
    width: '46px',
    height: '100%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    outline: 'none'
  },
  counterInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#202820',
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    outline: 'none'
  },
  input: {
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    borderRadius: '8px',
    color: '#202820',
    padding: '12px 14px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  textarea: {
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    borderRadius: '8px',
    color: '#202820',
    padding: '12px 14px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  errorText: {
    fontSize: '11px',
    color: '#dc2626',
    fontWeight: '500'
  },
  submitButton: {
    background: '#304b3d',
    color: '#f8f5ed',
    border: 'none',
    borderRadius: '10px',
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.15s, background 0.2s, box-shadow 0.15s',
    boxShadow: '0 4px 16px rgba(48, 75, 61, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    letterSpacing: '0.04em'
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: '#8c9187',
    color: '#f4f1e9',
    boxShadow: 'none'
  },
  btnContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  btnSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};
