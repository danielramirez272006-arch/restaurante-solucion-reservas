import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { formatDateToSpanish, formatTime12h } from '../../../shared/utils/date-helpers.js';

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
      doc.text('Experiencia Gastronómica Exclusiva', 74, 30, { align: 'center' });

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
        ['Comensales:', `${guests} ${guests === 1 ? 'persona' : 'personas'}`],
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
          <div style={styles.restaurantTag}>DONDE RAY</div>
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
            ✕
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
                size={130}
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
              <span style={styles.infoLabel}>Comensal:</span>
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
                👥 {guests} {guests === 1 ? 'persona' : 'personas'}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Ocasión:</span>
              <span style={styles.infoValue}>🏷️ {type || 'Cena'}</span>
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
          💡 <strong>Importante:</strong> Tu reserva se encuentra en estado{' '}
          <strong style={{ color: '#ffd89b' }}>{status || 'Pendiente'}</strong>. El restaurante
          gestiona un cupo estricto de máximo 20 comensales por franja para brindarte una atención
          personalizada.
        </div>

        {/* Botones de Acción */}
        <div style={styles.actionsFooter}>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            style={styles.downloadBtn}
          >
            {downloading ? 'Generando PDF...' : '📄 Descargar Voucher PDF'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            style={styles.printBtn}
          >
            🖨️ Imprimir
          </button>

          <button type="button" onClick={onClose} style={styles.closeBtn}>
            Volver
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px'
  },
  modalContent: {
    background: 'linear-gradient(160deg, #1e2029 0%, #12131a 100%)',
    border: '1px solid rgba(212, 163, 89, 0.4)',
    borderRadius: '20px',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 163, 89, 0.2)',
    overflow: 'hidden',
    position: 'relative',
    color: '#ffffff'
  },
  ticketHeader: {
    padding: '24px 24px 16px',
    textAlign: 'center',
    position: 'relative'
  },
  restaurantTag: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '2px',
    color: '#ffd89b',
    textTransform: 'uppercase',
    marginBottom: '6px'
  },
  ticketTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff'
  },
  ticketSubtitle: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#9ca3af'
  },
  closeIconBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#d1d5db',
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
    height: '24px'
  },
  notchLeft: {
    width: '14px',
    height: '24px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderTopRightRadius: '14px',
    borderBottomRightRadius: '14px',
    borderRight: '1px solid rgba(212, 163, 89, 0.4)'
  },
  notchRight: {
    width: '14px',
    height: '24px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderTopLeftRadius: '14px',
    borderBottomLeftRadius: '14px',
    borderLeft: '1px solid rgba(212, 163, 89, 0.4)'
  },
  dashedLine: {
    flex: 1,
    borderBottom: '2px dashed rgba(212, 163, 89, 0.3)',
    height: '1px'
  },
  ticketBody: {
    padding: '16px 24px',
    display: 'grid',
    gridTemplateColumns: '140px 1fr',
    gap: '20px',
    alignItems: 'center'
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  qrWrapper: {
    padding: '6px',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
  },
  reservationCode: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#ffd89b',
    letterSpacing: '1px'
  },
  statusPill: {
    fontSize: '10px',
    fontWeight: '700',
    background: 'rgba(245, 158, 11, 0.2)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.4)',
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
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '4px'
  },
  infoLabel: {
    color: '#9ca3af',
    fontWeight: '500'
  },
  infoValue: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'right'
  },
  infoValueHighlight: {
    color: '#ffd89b',
    fontWeight: '700',
    textAlign: 'right'
  },
  notesBlock: {
    paddingTop: '4px'
  },
  notesText: {
    margin: '2px 0 0',
    fontSize: '11px',
    color: '#d1d5db',
    fontStyle: 'italic'
  },
  policyNotice: {
    margin: '0 24px',
    background: 'rgba(212, 163, 89, 0.08)',
    border: '1px solid rgba(212, 163, 89, 0.2)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '11px',
    color: '#d1d5db',
    lineHeight: '1.4'
  },
  actionsFooter: {
    padding: '20px 24px 24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center'
  },
  downloadBtn: {
    flex: 2,
    background: 'linear-gradient(135deg, #d4a359 0%, #b47828 100%)',
    border: 'none',
    color: '#08060d',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(212, 163, 89, 0.3)'
  },
  printBtn: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  closeBtn: {
    flex: 1,
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#9ca3af',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    cursor: 'pointer'
  }
};
