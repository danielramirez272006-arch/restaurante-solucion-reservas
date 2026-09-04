import { useState, useMemo } from 'react';
import { useReservations } from '../../features/client-reservations/use-reservations.js';
import { AvailabilityCalendar } from '../../features/client-reservations/components/availability-calendar.jsx';
import { BookingForm } from '../../features/client-reservations/components/booking-form.jsx';
import { VoucherTicket } from '../../features/client-reservations/components/voucher-ticket.jsx';
import { MAX_CAPACITY_PER_SLOT } from '../../shared/utils/reservation-rules.js';

export const BookReservationPage = () => {
  const {
    currentUser,
    selectedDate,
    setSelectedDate,
    calculateAvailability,
    availabilityLoading,
    actionLoading,
    error,
    userDateLimitStatus,
    bookReservation,
    activeVoucher,
    setActiveVoucher,
    clearVoucher
  } = useReservations();

  const [selectedTime, setSelectedTime] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [successBanner, setSuccessBanner] = useState(null);

  // Memoizar el cálculo de disponibilidad para no recrear el array en cada render
  const slotsAvailability = useMemo(
    () => calculateAvailability(guestsCount),
    [calculateAvailability, guestsCount]
  );

  // Derivar si la franja horaria sigue disponible; si no, queda deseleccionada sin efectos secundarios
  const isCurrentSlotAvailable = selectedTime
    ? Boolean(slotsAvailability.find((s) => s.time === selectedTime)?.isAvailable)
    : false;
  const effectiveSelectedTime = isCurrentSlotAvailable ? selectedTime : '';

  const handleBookingSubmit = async (formData) => {
    setSuccessBanner(null);
    const result = await bookReservation(formData);
    if (result.success) {
      setSuccessBanner({
        message: '¡Tu reserva ha sido registrada con éxito! El estado inicial es Pendiente.',
        reservation: result.reservation
      });
      // Limpiar selección de franja para evitar dobles envíos inmediatos
      setSelectedTime('');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Banner / Header Principal */}
      <header style={styles.pageHeader}>
        <span style={styles.restaurantTag}>DONDE RAY RESTAURANTE</span>
        <h1 style={styles.heading}>Reserva Tu Mesa</h1>
        <p style={styles.leadText}>
          Vive una experiencia gastronómica inigualable. Selecciona tu fecha, consulta la
          disponibilidad de cupos en tiempo real y asegura tu lugar.
        </p>

        {/* Políticas destacadas */}
        <div style={styles.policiesRow}>
          <div style={styles.policyPill}>
            <span>👥</span>
            <span>Máx. {MAX_CAPACITY_PER_SLOT} personas por turno</span>
          </div>
          <div style={styles.policyPill}>
            <span>🛡️</span>
            <span>Estado inicial: Pendiente</span>
          </div>
          <div style={styles.policyPill}>
            <span>📅</span>
            <span>Límite de 5 reservas por cliente al día</span>
          </div>
        </div>
      </header>

      {/* Banner de Éxito */}
      {successBanner && (
        <div style={styles.successBanner} role="alert">
          <div style={styles.successIcon}>🎉</div>
          <div style={{ flex: 1 }}>
            <h4 style={styles.successTitle}>¡Reserva Creada Satisfactoriamente!</h4>
            <p style={styles.successMessage}>{successBanner.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveVoucher(successBanner.reservation)}
            style={styles.viewVoucherBtn}
          >
            🎟️ Ver Comprobante
          </button>
        </div>
      )}

      {/* Grid Principal de 2 Columnas */}
      <main style={styles.mainGrid}>
        {/* Columna Izquierda: Calendario y Horarios */}
        <section aria-label="Selección de Fecha y Disponibilidad">
          <AvailabilityCalendar
            selectedDate={selectedDate}
            onDateChange={(newDate) => {
              setSelectedDate(newDate);
              setSelectedTime('');
            }}
            selectedTime={effectiveSelectedTime}
            onTimeSelect={setSelectedTime}
            slotsAvailability={slotsAvailability}
            guestsCount={guestsCount}
            limitReached={!userDateLimitStatus.allowed}
            limitCount={userDateLimitStatus.currentCount}
            isLoading={availabilityLoading}
          />
        </section>

        {/* Columna Derecha: Formulario de Reserva */}
        <section aria-label="Formulario de Reserva">
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={effectiveSelectedTime}
            currentUser={currentUser}
            guestsCount={guestsCount}
            onGuestsChange={setGuestsCount}
            onSubmit={handleBookingSubmit}
            isSubmitting={actionLoading}
            limitReached={!userDateLimitStatus.allowed}
            apiError={error}
          />
        </section>
      </main>

      {/* Modal de Voucher Ticket */}
      {activeVoucher && (
        <VoucherTicket reservation={activeVoucher} onClose={clearVoucher} />
      )}
    </div>
  );
};

const styles = {
  pageWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px 80px',
    color: '#202820',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  pageHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px'
  },
  restaurantTag: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#b17a3c',
    textTransform: 'uppercase',
    background: 'rgba(177, 122, 60, 0.1)',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(177, 122, 60, 0.25)'
  },
  heading: {
    margin: 0,
    fontSize: 'clamp(38px, 4.5vw, 56px)',
    fontFamily: 'Newsreader, Georgia, serif',
    fontWeight: '400',
    color: '#202820',
    letterSpacing: '-0.03em',
    lineHeight: 1.05
  },
  leadText: {
    margin: 0,
    fontSize: '16px',
    color: '#73786f',
    maxWidth: '650px',
    lineHeight: '1.6'
  },
  policiesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '6px'
  },
  policyPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    color: '#202820',
    fontWeight: '500',
    boxShadow: '0 2px 6px rgba(32, 40, 32, 0.04)'
  },
  successBanner: {
    background: '#eef6f1',
    border: '1px solid #a3cfb5',
    borderRadius: '16px',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    boxShadow: '0 8px 24px rgba(48, 75, 61, 0.08)'
  },
  successIcon: {
    fontSize: '28px'
  },
  successTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '700',
    color: '#20372c'
  },
  successMessage: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#304b3d'
  },
  viewVoucherBtn: {
    background: '#304b3d',
    color: '#f8f5ed',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(48, 75, 61, 0.25)',
    transition: 'background 0.2s'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '28px',
    alignItems: 'start'
  }
};
