import { useMemo, useState } from 'react'
import { useReservations } from '../../features/client-reservations/use-reservations.js'
import { AvailabilityCalendar } from '../../features/client-reservations/components/availability-calendar.jsx'
import { BookingForm } from '../../features/client-reservations/components/booking-form.jsx'
import { VoucherTicket } from '../../features/client-reservations/components/voucher-ticket.jsx'
import { MAX_CAPACITY_PER_SLOT } from '../../shared/utils/reservation-rules.js'

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
    clearVoucher,
  } = useReservations()

  const [selectedTime, setSelectedTime] = useState('')
  const [guestsCount, setGuestsCount] = useState(2)
  const [successBanner, setSuccessBanner] = useState(null)

  const slotsAvailability = useMemo(
    () => calculateAvailability(guestsCount),
    [calculateAvailability, guestsCount]
  )

  const isCurrentSlotAvailable = selectedTime
    ? Boolean(
      slotsAvailability.find((slot) => slot.time === selectedTime)?.isAvailable
    )
    : false

  const effectiveSelectedTime = isCurrentSlotAvailable ? selectedTime : ''

  const handleBookingSubmit = async (formData) => {
    setSuccessBanner(null)

    const result = await bookReservation(formData)

    if (result.success) {
      setSuccessBanner({
        message:
          'Tu reserva fue registrada correctamente. El estado inicial es Pendiente.',
        reservation: result.reservation,
      })

      setSelectedTime('')
    }
  }

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.pageHeader}>
        <div style={styles.headerDecoration} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <span style={styles.restaurantTag}>CARIBE · COSTA RICA</span>

        <h1 style={styles.heading}>
          Reservá tu mesa.


          <em style={styles.headingAccent}>Viví el Caribe.</em>
        </h1>

        <p style={styles.leadText}>
          Elegí el día, la hora y la cantidad de personas. Nosotros nos encargamos
          de preparar una mesa con sabor de Limón.
        </p>

        <div style={styles.policiesRow}>
          <div style={styles.policyPill}>
            <span style={styles.policyMark} aria-hidden="true">01</span>
            <span>Máximo {MAX_CAPACITY_PER_SLOT} personas por turno</span>
          </div>

          <div style={styles.policyPill}>
            <span style={styles.policyMark} aria-hidden="true">02</span>
            <span>Confirmación en estado Pendiente</span>
          </div>

          <div style={styles.policyPill}>
            <span style={styles.policyMark} aria-hidden="true">03</span>
            <span>Hasta 5 reservas por cliente al día</span>
          </div>
        </div>
      </header>

      {successBanner && (
        <div style={styles.successBanner} role="alert">
          <div style={styles.successIcon} aria-hidden="true">✓</div>

          <div style={styles.successContent}>
            <h2 style={styles.successTitle}>Reserva recibida</h2>
            <p style={styles.successMessage}>{successBanner.message}</p>
          </div>

          <button
            type="button"
            onClick={() => setActiveVoucher(successBanner.reservation)}
            style={styles.viewVoucherBtn}
          >
            Ver comprobante
          </button>
        </div>
      )}

      <main style={styles.mainGrid}>
        <section style={styles.bookingPanel} aria-label="Selección de fecha y disponibilidad">
          <div style={styles.panelHeader}>
            <span style={styles.panelKicker}>01 · Elegí cuándo venir</span>
            <h2 style={styles.panelTitle}>Fecha y disponibilidad</h2>
            <p style={styles.panelDescription}>
              Seleccioná una fecha y consultá los horarios disponibles en tiempo real.
            </p>
          </div>

          <AvailabilityCalendar
            selectedDate={selectedDate}
            onDateChange={(newDate) => {
              setSelectedDate(newDate)
              setSelectedTime('')
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

        <section style={styles.bookingPanel} aria-label="Formulario de reserva">
          <div style={styles.panelHeader}>
            <span style={styles.panelKicker}>02 · Prepará tu visita</span>
            <h2 style={styles.panelTitle}>Datos de la reserva</h2>
            <p style={styles.panelDescription}>
              Completá tus datos para que podamos preparar tu llegada.
            </p>
          </div>

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

      {activeVoucher && (
        <VoucherTicket reservation={activeVoucher} onClose={clearVoucher} />
      )}
    </div>
  )
}

const styles = {
  pageWrapper: {
    maxWidth: '1220px',
    margin: '0 auto',
    padding: '54px 24px 96px',
    color: '#13231d',
    display: 'flex',
    flexDirection: 'column',
    gap: '34px',
  },
  pageHeader: {
    position: 'relative',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    padding: '18px 12px 12px',
  },
  headerDecoration: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    height: '16px',
    marginBottom: '2px',
  },
  restaurantTag: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#a95038',
    textTransform: 'uppercase',
    padding: '7px 14px',
    border: '1px solid rgba(169, 80, 56, 0.28)',
    borderRadius: '5px 12px 5px 12px',
    background: 'rgba(169, 80, 56, 0.06)',
  },
  heading: {
    margin: 0,
    fontSize: 'clamp(42px, 5vw, 68px)',
    fontFamily: 'Newsreader, Georgia, serif',
    fontWeight: '400',
    color: '#13231d',
    letterSpacing: '-0.04em',
    lineHeight: 0.98,
  },
  headingAccent: {
    color: '#138f91',
    fontStyle: 'italic',
  },
  leadText: {
    maxWidth: '620px',
    margin: 0,
    color: '#61716a',
    fontSize: '16px',
    lineHeight: '1.65',
  },
  policiesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '7px',
  },
  policyPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 13px',
    border: '1px solid #c9d0c5',
    borderRadius: '4px 12px 4px 12px',
    background: '#fffdf8',
    color: '#40554b',
    fontSize: '12px',
    fontWeight: '500',
  },
  policyMark: {
    color: '#d09a2a',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.08em',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    padding: '18px 22px',
    border: '1px solid #91c8b2',
    borderRadius: '8px 22px 8px 22px',
    background: '#edf8f1',
    boxShadow: '0 12px 28px rgba(19, 80, 68, 0.08)',
  },
  successIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#195044',
    color: '#f5f1e7',
    fontSize: '20px',
    fontWeight: '700',
  },
  successContent: {
    flex: 1,
    minWidth: '220px',
  },
  successTitle: {
    margin: 0,
    color: '#123d32',
    fontFamily: 'Newsreader, Georgia, serif',
    fontSize: '23px',
    fontWeight: '500',
  },
  successMessage: {
    margin: '4px 0 0',
    color: '#40554b',
    fontSize: '14px',
    lineHeight: '1.45',
  },
  viewVoucherBtn: {
    border: '0',
    borderRadius: '5px 13px 5px 13px',
    padding: '12px 20px',
    background: '#123d32',
    color: '#f5f1e7',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'background 0.2s, transform 0.2s',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '28px',
    alignItems: 'start',
  },
  bookingPanel: {
    minWidth: 0,
    padding: '28px',
    border: '1px solid #c9d0c5',
    borderRadius: '8px 34px 8px 34px',
    background: 'rgba(255, 253, 248, 0.82)',
    boxShadow: '0 16px 38px rgba(19, 35, 29, 0.06)',
  },
  panelHeader: {
    marginBottom: '24px',
  },
  panelKicker: {
    display: 'block',
    marginBottom: '9px',
    color: '#a95038',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  panelTitle: {
    margin: '0 0 8px',
    color: '#13231d',
    fontFamily: 'Newsreader, Georgia, serif',
    fontSize: '30px',
    fontWeight: '400',
    letterSpacing: '-0.03em',
    lineHeight: '1',
  },
  panelDescription: {
    maxWidth: '420px',
    margin: 0,
    color: '#61716a',
    fontSize: '13px',
    lineHeight: '1.55',
  },
}