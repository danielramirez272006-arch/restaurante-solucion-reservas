import { useState, useEffect } from 'react';
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

  // Calcular la disponibilidad de cada franja para la cantidad de comensales seleccionada
  const slotsAvailability = calculateAvailability(guestsCount);

  // Si la fecha cambia o el horario elegido ya no está disponible con la nueva cantidad de comensales, resetearlo
  useEffect(() => {
    if (selectedTime) {
      const currentSlot = slotsAvailability.find((s) => s.time === selectedTime);
      if (!currentSlot || !currentSlot.isAvailable) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, guestsCount, slotsAvailability, selectedTime]);

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
            onDateChange={setSelectedDate}
            selectedTime={selectedTime}
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
            selectedTime={selectedTime}
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
    padding: '32px 20px 60px',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  },
  pageHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  restaurantTag: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '3px',
    color: '#ffd89b',
    textTransform: 'uppercase',
    background: 'rgba(212, 163, 89, 0.12)',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(212, 163, 89, 0.25)'
  },
  heading: {
    margin: 0,
    fontSize: '38px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px'
  },
  leadText: {
    margin: 0,
    fontSize: '15px',
    color: '#9ca3af',
    maxWidth: '650px',
    lineHeight: '1.5'
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
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '5px 12px',
    fontSize: '12px',
    color: '#d1d5db'
  },
  successBanner: {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.25))',
    border: '1px solid rgba(16, 185, 129, 0.5)',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)'
  },
  successIcon: {
    fontSize: '28px'
  },
  successTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#34d399'
  },
  successMessage: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#e5e7eb'
  },
  viewVoucherBtn: {
    background: '#34d399',
    color: '#064e3b',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
    alignItems: 'start'
  }
};
