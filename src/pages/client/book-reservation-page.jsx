import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReservations } from '../../features/client-reservations/use-reservations.js';
import { AvailabilityCalendar } from '../../features/client-reservations/components/availability-calendar.jsx';
import { BookingForm } from '../../features/client-reservations/components/booking-form.jsx';
import { VoucherTicket } from '../../features/client-reservations/components/voucher-ticket.jsx';
import { MAX_CAPACITY_PER_SLOT } from '../../shared/utils/reservation-rules.js';

export const BookReservationPage = () => {
  const [searchParams] = useSearchParams();
  const paramDate = searchParams.get('date');
  const paramTime = searchParams.get('time');
  const paramGuests = searchParams.get('guests');

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

  const [selectedTime, setSelectedTime] = useState(paramTime || '');
  const [guestsCount, setGuestsCount] = useState(paramGuests ? Math.max(1, Number(paramGuests)) : 2);
  const [successBanner, setSuccessBanner] = useState(null);

  const [prevParams, setPrevParams] = useState({ date: paramDate, time: paramTime, guests: paramGuests });
  if (paramDate !== prevParams.date || paramTime !== prevParams.time || paramGuests !== prevParams.guests) {
    setPrevParams({ date: paramDate, time: paramTime, guests: paramGuests });
    if (paramTime) setSelectedTime(paramTime);
    if (paramGuests) setGuestsCount(Math.max(1, Number(paramGuests)));
    if (paramDate) setSelectedDate(paramDate);
  }

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
    <div className="reservation-shell">
      {/* Banner / Header Principal */}
      <header className="page-intro reservation-intro">
        <span className="eyebrow">Reservas · Donde Ray</span>
        <h1>La mesa está lista,<br /><em>solo faltas tú.</em></h1>
        <p className="lead">
          Alta cocina caribeña frente al mar de Puerto Viejo de Talamanca. Selecciona tu fecha, consulta el
          aforo en tiempo real y asegura tu experiencia gastronómica sin esperas.
        </p>
      </header>

      {/* Políticas destacadas editoriales */}
      <div className="reservation-policies-strip">
        <div className="reservation-policy-item">
          <span className="reservation-policy-label">Aforo Garantizado</span>
          <span className="reservation-policy-value">Máximo {MAX_CAPACITY_PER_SLOT} comensales por turno</span>
        </div>
        <div className="reservation-policy-item">
          <span className="reservation-policy-label">Estado Inicial</span>
          <span className="reservation-policy-value">Ingreso inmediato como Pendiente</span>
        </div>
        <div className="reservation-policy-item">
          <span className="reservation-policy-label">Límite Diario</span>
          <span className="reservation-policy-value">Hasta 5 reservas por cliente al día</span>
        </div>
      </div>

      {/* Banner de Éxito */}
      {successBanner && (
        <div className="reservation-alert-success" role="alert">
          <div>
            <h4>¡Reserva Registrada Satisfactoriamente!</h4>
            <p>{successBanner.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveVoucher(successBanner.reservation)}
            className="button button--primary button--small"
          >
            Ver Comprobante Digital →
          </button>
        </div>
      )}

      {/* Grid Principal de 2 Columnas */}
      <main className="reservation-grid">
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

export default BookReservationPage;
