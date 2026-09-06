import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import {
  formatDateToSpanish,
  formatTime12h,
  createGoogleCalendarUrl
} from '../../../shared/utils/date-helpers.js';

export const VoucherTicket = ({ reservation, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  if (!reservation) return null;

  const {
    id,
    guestName,
    email,
    phone,
    date,
    time,
    guests,
    type,
    notes,
    status,
    createdAt
  } = reservation;

  const qrData = JSON.stringify({
    restaurant: 'Donde Ray',
    reservationId: id,
    guestName,
    date,
    time,
    guests,
    status: status || 'Pendiente'
  });

  const googleCalUrl = createGoogleCalendarUrl(reservation);

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      // Fondo oscuro elegante
      doc.setFillColor(20, 22, 28);
      doc.rect(0, 0, 148, 210, 'F');

      // Borde dorado
      doc.setDrawColor(212, 163, 89);
      doc.setLineWidth(0.8);
      doc.roundedRect(8, 8, 132, 194, 4, 4, 'S');

      // Encabezado
      doc.setTextColor(212, 163, 89);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('DONDE RAY', 74, 24, { align: 'center' });

      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Sabor Afrocaribeño & Bar • Puerto Viejo de Talamanca', 74, 30, { align: 'center' });

      // Línea separadora
      doc.setDrawColor(80, 80, 80);
      doc.setLineWidth(0.3);
      doc.line(16, 36, 132, 36);

      // Título Comprobante
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('COMPROBANTE DE RESERVA', 74, 44, { align: 'center' });

      // Código y Estado
      doc.setFontSize(9);
      doc.setTextColor(212, 163, 89);
      doc.text(`ID: #${id}`, 20, 54);

      doc.setTextColor(245, 158, 11);
      doc.text(`ESTADO: ${(status || 'Pendiente').toUpperCase()}`, 128, 54, { align: 'right' });

      // Cuadro de Detalles
      doc.setFillColor(30, 32, 40);
      doc.roundedRect(16, 60, 116, 88, 3, 3, 'F');

      const items = [
        ['Titular:', guestName || 'N/A'],
        ['Fecha:', formatDateToSpanish(date) || date],
        ['Horario:', formatTime12h(time) || time],
        ['Personas:', `${guests} ${guests === 1 ? 'persona' : 'personas'}`],
        ['Ocasión:', type || 'General'],
        ['Teléfono:', phone || 'N/A'],
        ['Correo:', email || 'N/A'],
        ['Peticiones:', notes ? `"${notes}"` : 'Ninguna']
      ];

      let yPos = 70;
      doc.setFontSize(9);
      items.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(170, 170, 170);
        doc.text(label, 22, yPos);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(255, 255, 255);
        const splitVal = doc.splitTextToSize(value, 68);
        doc.text(splitVal, 56, yPos);
        yPos += splitVal.length > 1 ? splitVal.length * 5.5 : 8.5;
      });

      // Mensaje de Políticas
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(7.5);
      doc.text(
        '* Por favor llega 10 minutos antes de tu franja horaria.',
        74,
        158,
        { align: 'center' }
      );
      doc.text(
        'Capacidad máxima de 20 personas por turno garantizada.',
        74,
        163,
        { align: 'center' }
      );

      // Pie de comprobante
      doc.setTextColor(140, 140, 140);
      doc.setFontSize(7);
      doc.text(
        `Emitido el ${new Date(createdAt || Date.now()).toLocaleString('es-ES')}`,
        74,
        188,
        { align: 'center' }
      );

      doc.save(`comprobante-donde-ray-${id}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Hubo un problema al generar el archivo PDF. Intenta nuevamente.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContent}>
        {/* Ticket Header */}
        <div style={styles.ticketHeader}>
          <div style={styles.restaurantTag}>DONDE RAY • PUERTO VIEJO</div>
          <h2 style={styles.ticketTitle}>Voucher de Reserva</h2>
          <p style={styles.ticketSubtitle}>
            Presenta este comprobante digital o su código QR al llegar al restaurante
          </p>
          <button
            type="button"
            onClick={onClose}
            style={styles.closeIconBtn}
            aria-label="Cerrar modal"
          >
            
          </button>
        </div>

        {/* Separador con efecto notch de ticket */}
        <div style={styles.notchDivider}>
          <div style={styles.notchLeft} />
          <div style={styles.dashedLine} />
          <div style={styles.notchRight} />
        </div>

        {/* Ticket Body */}
        <div style={styles.ticketBody}>
          {/* QR Code Container */}
          <div style={styles.qrContainer}>
            <div style={styles.qrWrapper}>
              <QRCodeSVG
                value={qrData}
                size={125}
                level="M"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#0e1015"
              />
            </div>
            <span style={styles.reservationCode}>CÓDIGO: #{id}</span>
            <span style={styles.statusPill}>{status || 'Pendiente'}</span>
          </div>

          {/* Información Detallada */}
          <div style={styles.infoList}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Titular:</span>
              <span style={styles.infoValue}>{guestName}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Fecha:</span>
              <span style={styles.infoValue}>{formatDateToSpanish(date)}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Horario:</span>
              <span style={styles.infoValueHighlight}>{formatTime12h(time)}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Invitados:</span>
              <span style={styles.infoValue}>
                 {guests} {guests === 1 ? 'persona' : 'personas'}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Ocasión:</span>
              <span style={styles.infoValue}> {type || 'Cena'}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Contacto:</span>
              <span style={styles.infoValue}>
                {phone}
                <br />
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{email}</span>
              </span>
            </div>

            {notes && (
              <div style={styles.notesBlock}>
                <span style={styles.infoLabel}>Notas:</span>
                <p style={styles.notesText}>"{notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Nota informativa */}
        <div style={styles.policyNotice}>
           <strong>Importante:</strong> Tu reserva se encuentra en estado{' '}
          <strong style={{ color: '#ffd89b' }}>{status || 'Pendiente'}</strong>. El restaurante
          gestiona un cupo estricto de máximo 20 personas por turno para brindarte una atención
          personalizada y tranquila.
        </div>

        {/* Botones de Acción */}
        <div style={styles.actionsFooter}>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            style={styles.downloadBtn}
          >
            {downloading ? 'Generando PDF...' : ' Descargar PDF'}
          </button>

          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.calendarBtn}
          >
             Google Calendar
          </a>

          <button
            type="button"
            onClick={() => window.print()}
            style={styles.printBtn}
          >
             Imprimir
          </button>

          <button type="button" onClick={onClose} style={styles.closeBtn}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(32, 40, 32, 0.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px'
  },
  modalContent: {
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    borderRadius: '20px',
    maxWidth: '540px',
    width: '100%',
    boxShadow: '0 24px 60px rgba(32, 40, 32, 0.25)',
    overflow: 'hidden',
    position: 'relative',
    color: '#202820',
    animation: 'voucherEnter 0.25s ease-out'
  },
  ticketHeader: {
    padding: '28px 24px 16px',
    textAlign: 'center',
    position: 'relative',
    background: '#faf8f5'
  },
  restaurantTag: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '2.5px',
    color: '#d97706',
    textTransform: 'uppercase',
    marginBottom: '6px'
  },
  ticketTitle: {
    margin: 0,
    fontSize: '26px',
    fontFamily: 'var(--font-display, "Fraunces", serif)',
    fontWeight: '700',
    color: '#1c271e'
  },
  ticketSubtitle: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#73786f'
  },
  closeIconBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#e8e4db',
    border: 'none',
    color: '#202820',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notchDivider: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '24px',
    background: '#faf8f5'
  },
  notchLeft: {
    width: '14px',
    height: '24px',
    backgroundColor: 'rgba(32, 40, 32, 0.65)',
    borderTopRightRadius: '14px',
    borderBottomRightRadius: '14px',
    borderRight: '1px solid #d6d1c5'
  },
  notchRight: {
    width: '14px',
    height: '24px',
    backgroundColor: 'rgba(32, 40, 32, 0.65)',
    borderTopLeftRadius: '14px',
    borderBottomLeftRadius: '14px',
    borderLeft: '1px solid #d6d1c5'
  },
  dashedLine: {
    flex: 1,
    borderBottom: '2px dashed #d6d1c5',
    height: '1px'
  },
  ticketBody: {
    padding: '20px 24px',
    display: 'grid',
    gridTemplateColumns: '135px 1fr',
    gap: '20px',
    alignItems: 'center',
    background: '#ffffff'
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  qrWrapper: {
    padding: '8px',
    background: '#f4f1e9',
    border: '1px solid #d6d1c5',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(32, 40, 32, 0.06)'
  },
  reservationCode: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#b45309',
    letterSpacing: '1px'
  },
  statusPill: {
    fontSize: '10px',
    fontWeight: '700',
    background: '#fef3c7',
    color: '#b45309',
    border: '1px solid #f59e0b',
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase'
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '13px',
    textAlign: 'left'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    borderBottom: '1px solid #f0ece3',
    paddingBottom: '5px'
  },
  infoLabel: {
    color: '#73786f',
    fontWeight: '500'
  },
  infoValue: {
    color: '#202820',
    fontWeight: '600',
    textAlign: 'right'
  },
  infoValueHighlight: {
    color: '#0f5132',
    fontWeight: '700',
    textAlign: 'right'
  },
  notesBlock: {
    paddingTop: '4px'
  },
  notesText: {
    margin: '2px 0 0',
    fontSize: '11px',
    color: '#73786f',
    fontStyle: 'italic'
  },
  policyNotice: {
    margin: '0 24px',
    background: '#f4f1e9',
    border: '1px solid #d6d1c5',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '12px',
    color: '#555b52',
    lineHeight: '1.4'
  },
  actionsFooter: {
    padding: '20px 24px 24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    background: '#ffffff'
  },
  downloadBtn: {
    flex: '1 1 140px',
    background: '#0f5132',
    border: 'none',
    color: '#f8f5ed',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(15, 81, 50, 0.3)',
    textAlign: 'center'
  },
  calendarBtn: {
    flex: '1 1 140px',
    background: '#f4f1e9',
    border: '1px solid #d6d1c5',
    color: '#202820',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '12px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  printBtn: {
    flex: '0 1 80px',
    background: '#ffffff',
    border: '1px solid #d6d1c5',
    color: '#202820',
    borderRadius: '10px',
    padding: '12px 12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  closeBtn: {
    flex: '0 1 70px',
    background: 'transparent',
    border: '1px solid #d6d1c5',
    color: '#73786f',
    borderRadius: '10px',
    padding: '12px 12px',
    fontSize: '12px',
    cursor: 'pointer'
  }
};
