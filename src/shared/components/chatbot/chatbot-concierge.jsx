import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getTodayDateString,
  getNextDays,
  formatDateToSpanish,
  formatTime12h,
  isTimePassed,
  RESTAURANT_TIME_SLOTS
} from '../../utils/date-helpers.js';
import { mockFetch } from '../../services/mock-api.js';
import { AuthContext } from '../../context/auth-context.js';
import { queryAIConcierge, getAIConfig, saveAIConfig } from '../../../services/ai-concierge-service.js';

// Lista de categorías rápidas en el carrusel superior con iconos completos
const QUICK_CATEGORIES = [
  { id: 'aforo_vivo', label: '📊 Cupos en Vivo' },
  { id: 'consultar_reserva', label: '🔍 Consultar Mi Reserva' },
  { id: 'asistida', label: '📅 Reservar Paso a Paso' },
  { id: 'recom', label: '🍲 Platos & Especialidades' },
  { id: 'quiz', label: '✨ Test de Antojo' },
  { id: 'precios', label: '💰 Precios & Presupuesto' },
  { id: 'contacto', label: '📞 Teléfono & WhatsApp' },
  { id: 'ubicacion', label: '📍 Ubicación & Cómo Llegar' },
  { id: 'horarios', label: '🕒 Horarios & Turnos' },
  { id: 'cocteles', label: '🍷 Vinos & Coctelería' },
  { id: 'dietas', label: '🌱 Dietas & Alergias' },
  { id: 'celebrar', label: '🎉 Celebrar & Grupos' },
  { id: 'parqueo', label: '🚗 Parqueo Privado' },
  { id: 'ambiente', label: '🎶 Música & Dress Code' },
  { id: 'comprobante', label: '🎫 Voucher & QR' },
  { id: 'pagos', label: '💳 Métodos de Pago' },
  { id: 'historia', label: '🌴 Filosofía Donde Ray' }
];

const INITIAL_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: '¡Wapin mi gente! Pura vida. Soy Ray, tu concierge gastronómico en Donde Ray aquí en Puerto Viejo de Talamanca. ¿Cómo te puedo ayudar hoy a organizar tu mesa, verificar cupos en vivo o consultar el estado de tu reserva?',
  actions: [
    { label: '📊 Consultar Cupos en Vivo', actionId: 'aforo_vivo' },
    { label: '🔍 Consultar Mi Reserva', actionId: 'consultar_reserva' },
    { label: '📅 Reservar Paso a Paso', actionId: 'asistida' },
    { label: '🍲 Platos Recomendados', actionId: 'recom' },
    { label: '✨ ¿Qué se te antoja hoy?', actionId: 'quiz' }
  ]
};

// Normalizador fonético y de tildes para entender cualquier frase en español
const normalizeText = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos (á->a, é->e, etc.)
    .replace(/[¿?¡!.,;:()_'"/-]/g, ' ') // Quita signos de puntuación
    .replace(/\s+/g, ' ')
    .trim();
};

export const ChatbotConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAIConfig, setShowAIConfig] = useState(false);
  const [aiConfig, setAiConfig] = useState(getAIConfig());
  const [tempApiKey, setTempApiKey] = useState(aiConfig.apiKey);
  const [tempEndpoint, setTempEndpoint] = useState(aiConfig.endpoint);
  const [awaitingReservationQuery, setAwaitingReservationQuery] = useState(false);

  // Usuario autenticado (si lo hay)
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.user || null;

  // Estado del flujo de reserva paso a paso dentro del chat
  const [bookingWizard, setBookingWizard] = useState({
    active: false,
    guests: null,
    date: null,
    time: null
  });

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const addBotMessage = (text, actions = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + Math.random()),
          sender: 'bot',
          text,
          actions
        }
      ]);
    }, 350);
  };

  // Reiniciar la conversación
  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setBookingWizard({ active: false, guests: null, date: null, time: null });
    setAwaitingReservationQuery(false);
  };

  // Consulta de aforo en tiempo real hacia la base de datos (JSON Server / mockFetch)
  const handleCheckLiveCapacity = async (targetDateParam = null) => {
    setIsTyping(true);
    try {
      const today = getTodayDateString();
      const targetDate = targetDateParam || today;
      const isToday = targetDate === today;

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await mockFetch(`${apiUrl}/reservations?date=${encodeURIComponent(targetDate)}`);
      const data = res.ok ? await res.json() : [];

      const slotCounts = {};
      RESTAURANT_TIME_SLOTS.forEach((s) => (slotCounts[s] = 0));

      let totalGuestsBooked = 0;
      data.forEach((r) => {
        const st = String(r.status || r.estado || '');
        if (st !== 'Cancelada' && st !== 'Rechazada' && slotCounts[r.time] !== undefined) {
          const guests = Number(r.guests || r.personas || 1);
          slotCounts[r.time] += guests;
          totalGuestsBooked += guests;
        }
      });

      const totalSlots = RESTAURANT_TIME_SLOTS.length;
      const totalMaxCapacity = totalSlots * 20; // 180 personas
      const occupancyPercentage = Math.round((totalGuestsBooked / totalMaxCapacity) * 100);

      const availableSlotsList = [];
      const lines = RESTAURANT_TIME_SLOTS.map((s) => {
        const booked = slotCounts[s] || 0;
        const free = Math.max(0, 20 - booked);
        const passed = isToday && isTimePassed(targetDate, s);

        if (passed) {
          return `⚪ ${formatTime12h(s)}: Turno finalizado`;
        }
        if (free <= 0) {
          return `🔴 ${formatTime12h(s)}: Aforo completo (20/20)`;
        }

        availableSlotsList.push({ time: s, free, booked });
        if (free <= 5) {
          return `🟡 ${formatTime12h(s)}: ${free} cupos libres (¡Últimos lugares!)`;
        }
        return `🟢 ${formatTime12h(s)}: ${free} cupos disponibles`;
      });

      // Acciones rápidas para reservar en los turnos disponibles
      const actions = [];
      availableSlotsList.slice(0, 3).forEach((item) => {
        actions.push({
          label: `Reservar ${formatTime12h(item.time)} (${item.free} cupos) →`,
          to: `/reservar?date=${targetDate}&time=${item.time}`
        });
      });

      // Botón para consultar otro día
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      if (isToday) {
        actions.push({
          label: '📅 Consultar Mañana',
          actionId: 'aforo_manana',
          dateVal: tomorrowStr
        });
      } else {
        actions.push({
          label: '☀️ Consultar Hoy',
          actionId: 'aforo_vivo',
          dateVal: today
        });
      }

      actions.push({
        label: '📝 Reservar Paso a Paso',
        actionId: 'asistida'
      });

      setIsTyping(false);
      addBotMessage(
        `📊 Aforo en tiempo real · Donde Ray\n` +
        `📅 Fecha: ${formatDateToSpanish(targetDate) || targetDate}\n` +
        `👥 Ocupación general: ${totalGuestsBooked} de ${totalMaxCapacity} comensales (${occupancyPercentage}% ocupado)\n` +
        `───────────────────────\n` +
        `${lines.join('\n')}\n` +
        `───────────────────────\n` +
        `Capacidad máxima estricta de 20 personas por turno. ¿Te gustaría asegurar tu mesa?`,
        actions
      );
    } catch (err) {
      console.error('Error al consultar aforo en vivo:', err);
      setIsTyping(false);
      addBotMessage(
        'Hoy contamos con turnos de almuerzo (12:00 a 15:00) y cena (18:00 a 22:00). Puedes consultar el aforo interactivo en nuestro calendario:',
        [{ label: 'Ver Calendario Completo →', to: '/reservar' }]
      );
    }
  };

  // Consulta y rastreo de reserva en tiempo real
  const handleCheckReservationStatus = async (searchQuery = null) => {
    setIsTyping(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await mockFetch(`${apiUrl}/reservations`);
      const allReservations = res.ok ? await res.json() : [];

      let matches = [];

      // 1. Si no especificó término de búsqueda
      if (!searchQuery) {
        // Revisar si el usuario está logueado y tiene reservas
        if (currentUser?.id || currentUser?.email) {
          matches = allReservations.filter((r) => {
            const byId = r.userId && String(r.userId) === String(currentUser.id);
            const byEmail = r.email && currentUser.email && r.email.toLowerCase() === currentUser.email.toLowerCase();
            return byId || byEmail;
          });
        }
      } else {
        // Búsqueda por término (código, id, correo, nombre o teléfono)
        const clean = normalizeText(searchQuery);
        matches = allReservations.filter((r) => {
          const rId = String(r.id || '').toLowerCase();
          const idMatch = rId === clean || rId.includes(clean) || clean.includes(rId.replace('res-', ''));
          const nameMatch = normalizeText(r.guestName || r.cliente || r.name || '').includes(clean);
          const emailMatch = (r.email || '').toLowerCase().includes(clean);
          const phoneMatch = (r.phone || '').replace(/\D/g, '').includes(clean.replace(/\D/g, ''));
          return idMatch || nameMatch || emailMatch || (clean.length >= 4 && phoneMatch);
        });
      }

      setIsTyping(false);

      // Si no se proporcionó término y el usuario no tiene reservas registradas
      if (!searchQuery && matches.length === 0) {
        setAwaitingReservationQuery(true);
        addBotMessage(
          '🔎 Para localizar tu mesa en tiempo real en nuestro sistema, por favor escribe tu número de reserva (ejemplo: #res-101 o 101), tu correo electrónico o tu nombre:',
          [
            { label: '📂 Ir a Mis Reservas', to: '/mis-reservas' },
            { label: '📅 Hacer una Reserva Nueva', to: '/reservar' }
          ]
        );
        return;
      }

      // Si buscó y no encontró nada
      if (matches.length === 0) {
        setAwaitingReservationQuery(true);
        addBotMessage(
          `No localicé ninguna reserva que coincida con "${searchQuery}".\n\nPor favor verifica el código (ej. res-101) o el correo que usaste al registrarla. Puedes escribirlo de nuevo a continuación:`,
          [
            { label: '📂 Ver en Mis Reservas ↗', to: '/mis-reservas' },
            { label: '📅 Crear Nueva Reserva →', to: '/reservar' }
          ]
        );
        return;
      }

      // Si encontró reservas
      setAwaitingReservationQuery(false);
      const count = matches.length;
      const intro = searchQuery
        ? `¡Localicé ${count} ${count === 1 ? 'reserva' : 'reservas'} para tu búsqueda!`
        : `¡Hola ${currentUser?.name?.split(' ')[0] || 'amigo/a'}! Aquí tienes tus reservas activas en Donde Ray:`;

      const cardsText = matches.slice(0, 3).map((r) => {
        const status = r.status || r.estado || 'Pendiente';
        const statusIcon = status === 'Confirmada'
          ? '🟢 Confirmada (¡Mesa lista!)'
          : status === 'Pendiente'
          ? '🟡 Pendiente (En revisión por el equipo de sala)'
          : status === 'Rechazada'
          ? '🔴 Rechazada (Sin aforo)'
          : '⚪ Cancelada';

        return (
          `📋 Reserva #${r.id}\n` +
          `👤 Titular: ${r.guestName || r.cliente || 'Comensal'}\n` +
          `📅 Fecha: ${formatDateToSpanish(r.date) || r.date}\n` +
          `🕒 Horario: ${formatTime12h(r.time) || r.time}\n` +
          `👥 Personas: ${r.guests || 2} comensales\n` +
          `🏷️ Turno/Ocasión: ${r.type || 'Cena'}\n` +
          `📌 Estado actual: ${statusIcon}` +
          (r.notes ? `\n📝 Peticiones: "${r.notes}"` : '')
        );
      }).join('\n\n────────────────\n\n');

      addBotMessage(
        `${intro}\n\n${cardsText}\n\n¿Deseas descargar tu comprobante con código QR o necesitas realizar algún cambio?`,
        [
          { label: '🎟️ Ver Comprobante y QR', to: '/mis-reservas' },
          { label: '🔄 Reagendar o Modificar', to: '/mis-reservas' },
          { label: '📞 Contactar al Restaurante', actionId: 'contacto' },
          { label: '📅 Nueva Reserva', to: '/reservar' }
        ]
      );
    } catch (err) {
      console.error('Error al consultar estado de reserva:', err);
      setIsTyping(false);
      addBotMessage(
        'Ocurrió un inconveniente al consultar la reserva. Puedes revisarla directamente en tu sección de reservas:',
        [{ label: 'Ir a Mis Reservas →', to: '/mis-reservas' }]
      );
    }
  };

 // Despachador central de intenciones garantizado
 const handleIntent = (intentId, userPrompt = null, extraData = null) => {
 if (userPrompt) {
 setMessages((prev) => [
 ...prev,
 { id: String(Date.now()), sender: 'user', text: userPrompt }
 ]);
 }

 switch (intentId) {
 case 'recom':
 case 'menu':
 addBotMessage(
 'Nuestra cocina rinde homenaje a los sabores auténticos del Caribe costarricense con técnicas contemporáneas:\n\n' +
 '• Pesca del día caribeña: Sellada en mantequilla de coco, jengibre fresco y chile panameño.\n' +
 '• Rondón tradicional Donde Ray: Cocción lenta en leche de coco con mariscos frescos, yuca y plátano maduro.\n' +
 '• Pato a la brasa: Con reducción de ciruela y mostaza antigua.\n' +
 '• Arroz meloso de hongos y calabaza: Opción reconfortante y vegana de huerto.\n' +
 '• Postre de Cacao al 75%: Cacao orgánico de Talamanca con helado artesanal.\n\n' +
 '¿Te gustaría explorar la carta completa o reservar tu mesa?',
 [
 { label: 'Explorar la Carta ↗', to: '/menu' },
 { label: ' Reservar Mesa Ahora →', to: '/reservar' },
 { label: ' Test: ¿Qué se te antoja?', actionId: 'quiz' },
 { label: ' Ver Coctelería y Vinos', actionId: 'cocteles' }
 ]
 );
 break;

 case 'quiz':
 addBotMessage(
 'Dime qué experiencia te apetece hoy y te recomendaré el plato ideal de Donde Ray:',
 [
 { label: ' Mariscos y Pesca Fresca', actionId: 'antojo_mar' },
 { label: ' Olla Tradicional y Coco', actionId: 'antojo_rondon' },
 { label: ' Fuego, Pato o Carnes', actionId: 'antojo_carne' },
 { label: ' Huerta y Vegetariano', actionId: 'antojo_veggie' },
 { label: ' Cacao y Postres de Autor', actionId: 'antojo_postre' }
 ]
 );
 break;

 case 'antojo_mar':
 addBotMessage(
 ' Tu elección perfecta: Pesca del Día en Mantequilla de Coco y Jengibre.\n\nPescada al amanecer por pescadores locales de Cahuita y Manzanillo, sellada a punto y acompañada de puré criollo y limón mandarina.',
 [
 { label: 'Ver la Carta ↗', to: '/menu' },
 { label: 'Reservar Mesa para Probarlo →', to: '/reservar' }
 ]
 );
 break;

 case 'antojo_rondon':
 addBotMessage(
 ' Tu elección perfecta: Rondón Tradicional Donde Ray.\n\nEl alma culinaria de Limón: caldo fragante y espeso de leche de coco pura, langosta, pescado fresco, plátano maduro y tubérculos criollos perfumados con chile panameño.',
 [
 { label: 'Reservar Mesa →', to: '/reservar' },
 { label: 'Ver Maridaje de Vinos', actionId: 'cocteles' }
 ]
 );
 break;

 case 'antojo_carne':
 addBotMessage(
 ' Tu elección perfecta: Pato a la Brasa con Ciruela y Mostaza Antigua.\n\nCocinado a fuego lento con leñas locales de Talamanca. Piel crujiente, carne tierna y jugo glaseado con notas frutales.',
 [
 { label: 'Ver la Carta ↗', to: '/menu' },
 { label: 'Reservar Mesa →', to: '/reservar' }
 ]
 );
 break;

 case 'antojo_veggie':
 addBotMessage(
 ' Tu elección perfecta: Arroz Meloso de Hongos Silvestres y Calabaza Asada.\n\nCon hierbas frescas de huerta local, caldo vegetal reducido y toque ahumado. 100% libre de carnes y lleno de sabor caribeño.',
 [
 { label: 'Reservar con Menú Vegano →', to: '/reservar' }
 ]
 );
 break;

 case 'antojo_postre':
 addBotMessage(
 ' Tu elección perfecta: Texturas de Cacao Caribeño al 75%.\n\nCacao orgánico de comunidades indígenas Bribri, escamas de sal marina de Manzanillo, café arábica y helado casero.',
 [
 { label: 'Reservar Mesa para Postre y Café →', to: '/reservar' }
 ]
 );
 break;

 case 'asistida': {
 const preGuests = extraData?.guests || null;
 if (preGuests) {
 setBookingWizard({ active: true, guests: preGuests, date: null, time: null });
 const nextDays = getNextDays(5);
 addBotMessage(
 `¡Excelente! Anotamos mesa para ${preGuests} ${preGuests === 1 ? 'persona' : 'personas'}.\n\n¿Para qué día te gustaría reservar?`,
 nextDays.map((d) => ({
 label: `${d.label} (${d.weekday.slice(0, 3)})`,
 wizardStep: 'date',
 val: d.dateString
 }))
 );
 } else {
 setBookingWizard({ active: true, guests: null, date: null, time: null });
 addBotMessage(
 '¡Genial! Vamos a preparar tu reserva paso a paso en segundos.\n\nPrimero: ¿Para cuántas personas te gustaría la mesa?',
 [
 { label: ' 1 persona', wizardStep: 'guests', val: 1 },
 { label: ' 2 personas (Pareja)', wizardStep: 'guests', val: 2 },
 { label: '‍‍ 3 a 4 personas', wizardStep: 'guests', val: 4 },
 { label: '‍‍‍ 5 a 6 personas', wizardStep: 'guests', val: 6 },
 { label: ' Grupo (8 personas)', wizardStep: 'guests', val: 8 }
 ]
 );
 }
 break;
 }

  case 'aforo_vivo':
    handleCheckLiveCapacity(extraData?.date || null);
    break;

  case 'aforo_manana': {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    handleCheckLiveCapacity(tm.toISOString().split('T')[0]);
    break;
  }

  case 'consultar_reserva':
    handleCheckReservationStatus(extraData?.query || null);
    break;

 case 'contacto':
 addBotMessage(
 ' Canales Directos de Donde Ray:\n\n' +
 '• WhatsApp Concierge: +506 8888-7291 (Atención de 10:00 a 22:00)\n' +
 '• Teléfono fijo: +506 2750-0199\n' +
 '• Correo de reservas: reservas@donderay.cr\n' +
 '• Ubicación: Playa Chiquita, Puerto Viejo de Talamanca, Limón.\n\n' +
 '¿Deseas asegurar tu mesa directamente desde la web en 1 minuto?',
 [
 { label: ' Reservar en Línea →', to: '/reservar' },
 { label: ' Ver Aforo en Vivo Hoy', actionId: 'aforo_vivo' },
 { label: ' Cómo Llegar & Parqueo', actionId: 'parqueo' }
 ]
 );
 break;

 case 'precios':
 addBotMessage(
 ' Precios y Presupuesto en Donde Ray:\n\n' +
 '• Entradas y picadillos de autor: ₡5.000 a ₡8.500 ($10 a $16 USD)\n' +
 '• Platos fuertes y especialidades caribeñas: ₡9.500 a ₡17.500 ($18 a $34 USD)\n' +
 '• Cócteles de autor y vinos por copa: ₡4.500 a ₡7.000 ($9 a $14 USD)\n' +
 '• Postres artesanales: ₡4.000 a ₡6.000 ($8 a $12 USD)\n' +
 '• Consumo promedio estimado: $25 a $40 USD por persona.\n\n' +
 'Aceptamos tarjetas de crédito/débito, SINPE Móvil y efectivo (USD y Colones). Todos los precios incluyen impuestos de ley.',
 [
 { label: 'Explorar la Carta con Precios ↗', to: '/menu' },
 { label: ' Reservar Mesa →', to: '/reservar' },
 { label: ' Ver Métodos de Pago', actionId: 'pagos' }
 ]
 );
 break;

 case 'ubicacion':
 addBotMessage(
 ' Ubicación exacta de Donde Ray:\n\n' +
 'Playa Chiquita, Puerto Viejo de Talamanca (Limón, Costa Rica).\n' +
 'Estamos sobre la carretera principal hacia Punta Uva y Manzanillo, a solo 8 minutos en carro o 15 minutos en bicicleta desde el centro de Puerto Viejo. Enclavados entre selva tropical y a 100 metros del mar Caribe.\n\n' +
 'En Waze y Google Maps puedes buscarnos como: "Donde Ray Playa Chiquita".',
 [
 { label: ' Parqueo & Ruta Detallada', actionId: 'parqueo' },
 { label: ' Reservar Mesa →', to: '/reservar' }
 ]
 );
 break;

 case 'parqueo':
 addBotMessage(
 ' Estacionamiento y Cómo Llegar:\n\n' +
 '• Parqueo privado propio: Contamos con estacionamiento cercado, iluminado y con vigilancia nocturna para clientes sin costo.\n' +
 '• En automóvil: A 8 minutos al sur de Puerto Viejo centro hacia Manzanillo.\n' +
 '• En bicicleta: Carril costero plano muy accesible desde Cocles o Punta Uva.\n' +
 '• En autobús: La ruta MEPE (San José / Limón - Manzanillo) tiene parada justo frente a nuestro sendero de entrada.',
 [
 { label: ' Ver Ubicación en el Mapa', actionId: 'ubicacion' },
 { label: ' Reservar Mesa →', to: '/reservar' }
 ]
 );
 break;

 case 'horarios':
 addBotMessage(
 ' Horarios de Atención en Donde Ray:\n\n' +
 'Abierto de Miércoles a Domingo en dos turnos diarios:\n' +
 '• Turno Almuerzo: 12:00 a 15:00\n' +
 '• Turno Cena: 18:00 a 22:00\n\n' +
 ' Lunes y Martes: Cerrado por descanso de cocina y recolección de ingredientes frescos.\n' +
 ' Cupo: Máximo 20 personas por turno para garantizar una atención íntima y relajada.',
 [
 { label: ' Consultar Aforo de Hoy', actionId: 'aforo_vivo' },
 { label: ' Reservar Mi Turno →', to: '/reservar' }
 ]
 );
 break;

 case 'cocteles':
 addBotMessage(
 ' Vinos, Cervezas y Coctelería de Autor:\n\n' +
 '• Caribe Sour: Destilado artesanal, maracuyá criollo y suave perfume de chile panameño.\n' +
 '• Coco Loco de Autor: Leche de coco recién rallada, ron añejo y nuez moscada.\n' +
 '• Frescos naturales caribeños: Guanábana silvestre, carambola y jengibre.\n' +
 '• Cervezas artesanales de Costa Rica.\n' +
 '• Carta de vinos blancos, espumantes y tintos maridados especialmente con pesca marina.',
 [
 { label: ' Reservar Mesa para Brindar →', to: '/reservar' },
 { label: ' Ver Platos para Maridar', actionId: 'recom' }
 ]
 );
 break;

 case 'dietas':
 addBotMessage(
 ' Dietas, Alergias y Opciones Especiales:\n\n' +
 '• Opciones 100% vegetarianas y veganas inspiradas en la huerta de Talamanca.\n' +
 '• Platos Gluten-Free aptos para personas con celiaquía.\n' +
 '• Cocina cuidadosa con protocolos de no contaminación cruzada.\n' +
 'Al reservar, puedes escribir en "Peticiones Especiales" cualquier intolerancia (mariscos, maní, lácteos) y el chef adaptará tu menú.',
 [
 { label: ' Reservar con Petición Especial →', to: '/reservar' },
 { label: 'Explorar la Carta ↗', to: '/menu' }
 ]
 );
 break;

 case 'celebrar':
 addBotMessage(
 ' Celebraciones, Cumpleaños y Aniversarios:\n\n' +
 '¡Será un honor festejar contigo en el Caribe!\n' +
 '• Mesas especiales a la luz de las velas frente al jardín tropical.\n' +
 '• Detalle dulce de cortesía del chef para personas en su cumpleaños.\n' +
 '• Capacidad para grupos y cenas familiares de hasta 20 personas.\n' +
 'Al hacer tu reserva, solo selecciona la ocasión "Cumpleaños", "Aniversario" o "Reunión de Negocios".',
 [
 { label: ' Reservar Celebración Especial →', to: '/reservar' }
 ]
 );
 break;

 case 'ambiente':
 addBotMessage(
 ' Atmósfera, Música y Código de Vestimenta:\n\n' +
 '• Vestimenta: Casual Tropical / Resort Casual. Ropa fresca, vestidos ligeros, lino y calzado cómodo o sandalias.\n' +
 '• Música: Calypso acústico limonense, reggae roots suave y Bossa Nova en volumen moderado para conversar plácidamente.\n' +
 '• Entorno: Jardín tropical exuberante, iluminación cálida y brisa marina.',
 [
 { label: ' Reservar Velada →', to: '/reservar' }
 ]
 );
 break;

 case 'lluvia':
 addBotMessage(
 ' Clima y Lluvia Tropical:\n\n' +
 'El Caribe es famoso por sus verdes paisajes gracias a la lluvia tropical. Tanto nuestro salón principal como la terraza exterior están 100% cubiertos con techos de teca protegidos.\n\n' +
 'Comer o cenar mientras escuchas la lluvia caribeña y disfrutas de un cóctel es una de las experiencias más mágicas de Donde Ray.',
 [
 { label: ' Reservar Mesa Protegida →', to: '/reservar' }
 ]
 );
 break;

 case 'mascotas':
 addBotMessage(
 ' Niños y Mascotas (Pet-Friendly):\n\n' +
 '• Mascotas: ¡100% Pet Friendly! Tu perro es bienvenido con correa en nuestra terraza jardín al aire libre techada.\n' +
 '• Niños: Disponemos de sillas altas para bebés y platos adaptados con sabores amigables (pesca suave, papas criollas, arroz con coco).',
 [
 { label: ' Reservar Terraza Pet-Friendly →', to: '/reservar' }
 ]
 );
 break;

 case 'pagos':
 addBotMessage(
 ' Métodos de Pago Aceptados:\n\n' +
 '• Tarjetas de crédito y débito: Visa, MasterCard y American Express sin recargo.\n' +
 '• SINPE Móvil disponible para transferencias nacionales al instante.\n' +
 '• Efectivo: Colones costarricenses (CRC) y Dólares estadounidenses (USD).\n' +
 '• Facturación electrónica autorizada por Hacienda disponible para cada cuenta.',
 [
 { label: ' Reservar Mesa →', to: '/reservar' },
 { label: ' Ver Rango de Precios', actionId: 'precios' }
 ]
 );
 break;

 case 'tolerancia':
 addBotMessage(
 ' Política de Puntualidad y Tolerancia:\n\n' +
 '• Tu mesa se reserva y guarda por 15 minutos posteriores a la hora confirmada.\n' +
 '• Si experimentas algún retraso en carretera o con el clima, puedes avisarnos por WhatsApp (+506 8888-7291) y mantendremos tu lugar con todo gusto.',
 [
 { label: ' Contactar por WhatsApp', actionId: 'contacto' },
 { label: ' Gestionar Mis Reservas', to: '/mis-reservas' }
 ]
 );
 break;

 case 'wifi':
 addBotMessage(
 ' Conectividad y WiFi:\n\n' +
 'Contamos con conexión WiFi satelital de alta velocidad (Starlink) gratuita para todos nuestros clientes y visitas, ideal para coordinar traslados o compartir tu experiencia.',
 [
 { label: ' Reservar Mesa →', to: '/reservar' }
 ]
 );
 break;

 case 'accesibilidad':
 addBotMessage(
 ' Accesibilidad y Silla de Ruedas:\n\n' +
 'Donde Ray cuenta con un diseño de una sola planta al nivel del jardín, sin gradas pronunciadas, con rampas suaves de madera y corredores amplios aptos para sillas de ruedas o coches de bebé.',
 [
 { label: ' Reservar Mesa con Fácil Acceso →', to: '/reservar' }
 ]
 );
 break;

 case 'delivery':
 addBotMessage(
 ' Pedidos para Llevar y Delivery:\n\n' +
 'Nuestra experiencia está concebida para disfrutarse recién cocinada en nuestras mesas frente al jardín tropical. Sin embargo, preparamos pedidos especiales para llevar (Takeout) con llamada previa a nuestro teléfono o WhatsApp.',
 [
 { label: ' Ver Teléfono y WhatsApp', actionId: 'contacto' },
 { label: ' Mejor Reservar Mesa →', to: '/reservar' }
 ]
 );
 break;

 case 'comprobante':
 addBotMessage(
 ' Comprobante Digital (Voucher Ticket):\n\n' +
 '• Al reservar en la web, recibes de inmediato tu Voucher Ticket digital.\n' +
 '• Contiene un código QR dinámico para check-in instantáneo en la entrada.\n' +
 '• Puedes descargarlo en formato PDF o sincronizar la fecha en tu Google Calendar en 1 clic.',
 [
 { label: 'Ver Mis Reservas →', to: '/mis-reservas' },
 { label: ' Hacer Nueva Reserva →', to: '/reservar' }
 ]
 );
 break;

 case 'cancelar':
 addBotMessage(
 'Puedes consultar, modificar la fecha/hora o cancelar tu reserva en cualquier momento sin costo desde la sección "Mis Reservas" con solo iniciar sesión.',
 [
 { label: 'Ir a Mis Reservas →', to: '/mis-reservas' },
 { label: 'Iniciar Sesión', to: '/login' }
 ]
 );
 break;

 case 'historia':
 addBotMessage(
 ' Historia y Filosofía de Donde Ray:\n\n' +
 'Nacido en 2018 en Playa Chiquita, Donde Ray celebra la cocina caribeña "sin apuro". Rendimos tributo a los pescadores de Puerto Viejo y a los agricultores de Talamanca, fusionando tradición ancestral con alta gastronomía.',
 [
 { label: 'Conocer Más de Nosotros ↗', to: '/#nosotros' },
 { label: ' Reservar Mesa →', to: '/reservar' }
 ]
 );
 break;

 case 'saludo':
 addBotMessage(
 '¡Pura vida! Qué gusto saludarte. Soy Ray, y estoy a tu servicio para que tu visita a Playa Chiquita sea memorable. ¿Qué te gustaría saber hoy?',
 [
 { label: ' Reservar Paso a Paso', actionId: 'asistida' },
 { label: ' Recomendaciones del Chef', actionId: 'recom' },
 { label: ' Aforo en Vivo Hoy', actionId: 'aforo_vivo' },
 { label: ' Ubicación & Cómo Llegar', actionId: 'ubicacion' }
 ]
 );
 break;

 case 'despedida':
 addBotMessage(
 '¡Con el mayor de los gustos! Es un honor atenderte. Te esperamos muy pronto en Donde Ray para compartir los mejores sabores del Caribe. ¡Pura vida! '
 );
 break;

 case 'reservar':
 addBotMessage(
 '¡Será un gran placer recibirte en Donde Ray! Nuestro sistema de reservas te permite elegir turno con cupos en tiempo real y te entrega un voucher con código QR de inmediato.',
 [
 { label: ' Ir al Panel de Reservas →', to: '/reservar' },
 { label: 'Asistencia Paso a Paso en Chat', actionId: 'asistida' }
 ]
 );
 break;

 default: {
 const userQueryClean = userPrompt ? ` "${userPrompt}"` : '';
 addBotMessage(
 `¡Pura vida! Entiendo tu consulta${userQueryClean}. Para ayudarte de inmediato, puedes seleccionar uno de los temas más consultados o escribirnos directamente por WhatsApp:`,
 [
 { label: ' Reservar Paso a Paso', actionId: 'asistida' },
 { label: ' Platos y Carta', actionId: 'recom' },
 { label: ' Aforo en Vivo', actionId: 'aforo_vivo' },
 { label: ' WhatsApp Directo', actionId: 'contacto' },
 { label: ' Ubicación & Ruta', actionId: 'ubicacion' },
 { label: ' Precios & Presupuesto', actionId: 'precios' }
 ]
 );
 break;
 }
 }
 };

 // Detector inteligente multi-palabra y anti-acentos para texto libre
 const detectIntentFromText = (rawText) => {
 const text = normalizeText(rawText);

 // 1. Consultar estado de reserva o código específico (ej: #res-101, estado de mi reserva, buscar mi reserva)
 const codeMatch = text.match(/(?:reserva|codigo|ticket|numero|#)\s*([a-zA-Z0-9_-]+)/i) ||
                   text.match(/#?res-?[0-9]+/i) ||
                   (text.trim().length <= 8 && /^#?[0-9]+$/.test(text.trim()) ? [text.trim(), text.trim()] : null);

 if (
   codeMatch ||
   text.includes('consultar mi reserva') ||
   text.includes('estado de mi reserva') ||
   text.includes('como va mi reserva') ||
   text.includes('ver mi reserva') ||
   text.includes('buscar reserva') ||
   text.includes('consultar reserva') ||
   text.includes('mi reserva') ||
   (text.includes('reserva') && (text.includes('estado') || text.includes('codigo') || text.includes('estatus') || text.includes('localizar')))
 ) {
   const query = codeMatch ? (codeMatch[1] || codeMatch[0]).replace('#', '') : null;
   return { intent: 'consultar_reserva', extra: { query } };
 }

  // 2. Detección directa de número de personas para reserva ("mesa para 2", "somos 4", "para 5 personas")
  const partyMatch = text.match(/(?:mesa para|para|somos|grupo de)\s+(\d+)/) || text.match(/^(\d+)\s*(?:personas|personas\?|comensales)?$/);
  if (partyMatch && partyMatch[1]) {
    return { intent: 'asistida', extra: { guests: parseInt(partyMatch[1], 10) } };
  }

  // 3. Precios y presupuesto
  if (
    text.includes('precio') || text.includes('cuanto cuesta') || text.includes('costo') ||
    text.includes('caro') || text.includes('barato') || text.includes('presupuesto') ||
    text.includes('cuanto vale') || text.includes('tarifa')
  ) {
    return { intent: 'precios' };
  }

 // 4. Aforo en vivo / Capacidad / Hay campo hoy
 if (
 text.includes('aforo') || text.includes('hay campo') || text.includes('hay mesa') ||
 text.includes('hay espacio') || text.includes('disponib') || text.includes('cupo') ||
 text.includes('lleno') || text.includes('capacidad')
 ) {
 return { intent: 'aforo_vivo' };
 }

 // 5. Reserva asistida / Paso a paso
 if (
 text.includes('paso a paso') || text.includes('asistid') || text.includes('guiar') ||
 text.includes('wizard') || text.includes('ayudame a reservar')
 ) {
 return { intent: 'asistida' };
 }

 // 6. Test de antojo / Quiz
 if (
 text.includes('antojo') || text.includes('quiz') || text.includes('test') ||
 text.includes('que me recomiendas') || text.includes('sorprendeme')
 ) {
 return { intent: 'quiz' };
 }

 // 7. Platos específicos y sabores
 if (text.includes('marisco') || text.includes('camaron') || text.includes('langosta') || text.includes('pesca') || text.includes('pescado') || text.includes('ceviche') || text.includes('pulpo') || text.includes('calamar')) {
 return { intent: 'antojo_mar' };
 }
 if (text.includes('rondon') || text.includes('olla') || text.includes('sopa') || text.includes('coco')) {
 return { intent: 'antojo_rondon' };
 }
 if (text.includes('pato') || text.includes('carne') || text.includes('brasa') || text.includes('fuego') || text.includes('pollo')) {
 return { intent: 'antojo_carne' };
 }
 if (text.includes('vegano') || text.includes('vegetariano') || text.includes('veggie') || text.includes('planta') || text.includes('huerta') || text.includes('ensalada')) {
 return { intent: 'antojo_veggie' };
 }
 if (text.includes('postre') || text.includes('dulce') || text.includes('cacao') || text.includes('chocolate') || text.includes('cafe')) {
 return { intent: 'antojo_postre' };
 }

 // 8. Cocteles, vinos y bebidas
 if (
 text.includes('coctel') || text.includes('cocktail') || text.includes('vino') ||
 text.includes('bebida') || text.includes('trago') || text.includes('cerveza') ||
 text.includes('marid') || text.includes('licor') || text.includes('ron') ||
 text.includes('gin') || text.includes('sour') || text.includes('fresco') ||
 text.includes('sin alcohol')
 ) {
 return { intent: 'cocteles' };
 }

 // 9. Dietas, celiaquía, alergias
 if (
 text.includes('dieta') || text.includes('celiac') || text.includes('gluten') ||
 text.includes('alergia') || text.includes('intoleran') || text.includes('lactosa') ||
 text.includes('mani') || text.includes('nuez')
 ) {
 return { intent: 'dietas' };
 }

 // 10. Ubicación, Waze, Maps, cómo llegar
 if (
 text.includes('donde') || text.includes('ubicaci') || text.includes('direccion') ||
 text.includes('como llego') || text.includes('llegar') || text.includes('waze') ||
 text.includes('maps') || text.includes('mapa') || text.includes('ruta') ||
 text.includes('distancia') || text.includes('puerto viejo') || text.includes('chiquita') ||
 text.includes('limon') || text.includes('queda')
 ) {
 return { intent: 'ubicacion' };
 }

 // 11. Parqueo, carro, vehículo
 if (
 text.includes('parqueo') || text.includes('estaciona') || text.includes('carro') ||
 text.includes('coche') || text.includes('auto') || text.includes('cochera') ||
 text.includes('bus') || text.includes('autobus')
 ) {
 return { intent: 'parqueo' };
 }

 // 12. Celebraciones, cumpleaños, aniversarios, grupos
 if (
 text.includes('cumple') || text.includes('aniversario') || text.includes('celebr') ||
 text.includes('romant') || text.includes('fiesta') || text.includes('evento') ||
 text.includes('boda') || text.includes('grupo') || text.includes('reunion')
 ) {
 return { intent: 'celebrar' };
 }

 // 13. Horarios, días, apertura
 if (
 text.includes('horario') || text.includes('hora') || text.includes('abren') ||
 text.includes('abierto') || text.includes('cierran') || text.includes('cerrado') ||
 text.includes('dias') || text.includes('lunes') || text.includes('martes') ||
 text.includes('miercoles') || text.includes('jueves') || text.includes('viernes') ||
 text.includes('sabado') || text.includes('domingo')
 ) {
 return { intent: 'horarios' };
 }

 // 14. Ambiente, música, vestimenta
 if (
 text.includes('musica') || text.includes('vestir') || text.includes('ropa') ||
 text.includes('vestimenta') || text.includes('dress') || text.includes('ambiente') ||
 text.includes('calypso') || text.includes('reggae') || text.includes('en vivo')
 ) {
 return { intent: 'ambiente' };
 }

 // 15. Clima, lluvia
 if (
 text.includes('lluvia') || text.includes('llueve') || text.includes('clima') ||
 text.includes('techo') || text.includes('mojar') || text.includes('temporal')
 ) {
 return { intent: 'lluvia' };
 }

 // 16. Niños y Mascotas (evaluar antes de verbos generales)
 if (
 text.includes('mascota') || text.includes('perro') || text.includes('perrito') ||
 text.includes('gato') || text.includes('pet') || text.includes('nino') ||
 text.includes('nina') || text.includes('bebe') || text.includes('familia') ||
 text.includes('hijo') || text.includes('silla alta')
 ) {
 return { intent: 'mascotas' };
 }

 // 17. Pagos, tarjetas, SINPE, facturación
 if (
 text.includes('pago') || text.includes('pagar') || text.includes('tarjeta') ||
 text.includes('sinpe') || text.includes('efectivo') || text.includes('dolar') ||
 text.includes('colon') || text.includes('factura')
 ) {
 return { intent: 'pagos' };
 }

 // 18. Tolerancia, tardanza, puntualidad (evitar coincidir con "buenas tardes")
 if (
 text.includes('llegar tarde') || text.includes('llego tarde') || text.includes('si me retraso') ||
 text.includes('tolerancia') || text.includes('retraso') || text.includes('demora') ||
 text.includes('tiempo de espera') || text.includes('cuanto esperan')
 ) {
 return { intent: 'tolerancia' };
 }

 // 19. WiFi / Internet
 if (text.includes('wifi') || text.includes('internet') || text.includes('conexion')) {
 return { intent: 'wifi' };
 }

 // 20. Accesibilidad / Silla de ruedas
 if (text.includes('accesib') || text.includes('silla de ruedas') || text.includes('rampa') || text.includes('discapacid')) {
 return { intent: 'accesibilidad' };
 }

 // 21. Delivery / Llevar / Express ("para llevar" o "delivery", no "llevar" solo)
 if (
 text.includes('para llevar') || text.includes('pedir para llevar') || text.includes('express') ||
 text.includes('delivery') || text.includes('takeout') || text.includes('domicilio')
 ) {
 return { intent: 'delivery' };
 }

 // 22. Comprobante, voucher, QR, descargas
 if (
 text.includes('comprobante') || text.includes('voucher') || text.includes('ticket') ||
 text.includes('qr') || text.includes('pdf') || text.includes('calendario') ||
 text.includes('calendar')
 ) {
 return { intent: 'comprobante' };
 }

 // 23. Cancelar, modificar, reagendar
 if (text.includes('cancel') || text.includes('reagend') || text.includes('cambiar fecha') || text.includes('anular')) {
 return { intent: 'cancelar' };
 }

 // 24. Historia, chef, quiénes son
 if (
 text.includes('historia') || text.includes('filosof') || text.includes('quienes') ||
 text.includes('chef') || text.includes('ray') || text.includes('acerca')
 ) {
 return { intent: 'historia' };
 }

 // 25. Recomendaciones generales / Carta / Menú
 if (
 text.includes('recom') || text.includes('plato') || text.includes('comer') ||
 text.includes('carta') || text.includes('menu') || text.includes('especialidad') ||
 text.includes('rico')
 ) {
 return { intent: 'recom' };
 }

 // 26. Reservar genérico
 if (
 text.includes('reserva') || text.includes('mesa') || text.includes('agendar') ||
 text.includes('apartar') || text.includes('visitar') || text.includes('ir a comer')
 ) {
 return { intent: 'reservar' };
 }

// 27. Despedidas y Agradecimientos (evaluar antes de saludos generales)
 if (
 text.includes('gracias') || text.includes('excelente') || text.includes('perfecto') ||
 text.includes('genial') || text.includes('listo') || text.includes('ok') ||
 text.includes('vale') || text.includes('entendido') || text.includes('adios') ||
 text.includes('chao') || text.includes('nos vemos') || text.includes('hasta luego')
 ) {
 return { intent: 'despedida' };
 }

 // 28. Saludos
 if (
 text.includes('hola') || text.includes('buenos') || text.includes('buenas') ||
 text.includes('buen dia') || text.includes('pura vida') || text.includes('que tal') ||
 text.includes('hey') || text.includes('saludos') || text.includes('alo')
 ) {
 return { intent: 'saludo' };
 }

 return { intent: 'unknown' };
 };

  const handleSend = async () => {
    const text = inputVal.trim();
    if (!text) return;
    setInputVal('');

    // 1. Mostrar mensaje del usuario en pantalla
    const userMsg = { id: String(Date.now()), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    // 2. Si estábamos esperando el código o dato de búsqueda de reserva
    if (awaitingReservationQuery) {
      setAwaitingReservationQuery(false);
      handleCheckReservationStatus(text);
      return;
    }

    setIsTyping(true);

    // 3. Si hay conexión de IA configurada, consultar al modelo
    if (aiConfig.apiKey) {
      try {
        const aiResult = await queryAIConcierge(text, [...messages, userMsg]);
        if (aiResult && aiResult.text) {
          setIsTyping(false);
          addBotMessage(aiResult.text, [
            { label: '📅 Reservar Mesa Ahora →', to: '/reservar' },
            { label: '📊 Consultar Cupos de Hoy', actionId: 'aforo_vivo' },
            { label: '🔍 Consultar Mi Reserva', actionId: 'consultar_reserva' },
            { label: '📖 Ver Menú de Autor', to: '/menu' }
          ]);
          return;
        }
      } catch (err) {
        console.warn('AI error:', err);
      }
    }

    // 4. Fallback al motor semántico local entrenado de Donde Ray
    const { intent, extra } = detectIntentFromText(text);
    handleIntent(intent, text, extra);
  };

  // Manejador del Wizard de Reserva paso a paso con aforo real
  const handleWizardStep = async (step, val) => {
    if (step === 'guests') {
      setBookingWizard((prev) => ({ ...prev, guests: val }));
      const nextDays = getNextDays(5);
      addBotMessage(
        `Mesa para ${val} ${val === 1 ? 'persona' : 'personas'} anotada. ¿Qué día prefieres visitarnos?`,
        nextDays.map((d) => ({
          label: `${d.label} (${d.weekday.slice(0, 3)})`,
          wizardStep: 'date',
          val: d.dateString
        }))
      );
    } else if (step === 'date') {
      setBookingWizard((prev) => ({ ...prev, date: val }));
      setIsTyping(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await mockFetch(`${apiUrl}/reservations?date=${encodeURIComponent(val)}`);
        const reservations = res.ok ? await res.json() : [];

        const slotCounts = {};
        RESTAURANT_TIME_SLOTS.forEach((s) => (slotCounts[s] = 0));
        reservations.forEach((r) => {
          const st = String(r.status || r.estado || '');
          if (st !== 'Cancelada' && st !== 'Rechazada' && slotCounts[r.time] !== undefined) {
            slotCounts[r.time] += Number(r.guests || r.personas || 1);
          }
        });

        const isToday = val === getTodayDateString();
        const requiredGuests = bookingWizard.guests || 2;
        const availableOptions = [];

        RESTAURANT_TIME_SLOTS.forEach((slot) => {
          const booked = slotCounts[slot] || 0;
          const free = Math.max(0, 20 - booked);
          const passed = isToday && isTimePassed(val, slot);
          if (!passed && free >= requiredGuests) {
            const isLunch = Number(slot.split(':')[0]) < 16;
            availableOptions.push({
              label: `${isLunch ? '☀️' : '🌙'} ${formatTime12h(slot)} (${free} cupos libres)`,
              wizardStep: 'time',
              val: slot
            });
          }
        });

        setIsTyping(false);
        if (availableOptions.length === 0) {
          addBotMessage(
            `Aviso: Para el día ${formatDateToSpanish(val) || val} no encontramos turnos con ${requiredGuests} cupos libres suficientes. ¿Deseas probar con otra fecha cercana?`,
            getNextDays(5).map((d) => ({
              label: `${d.label} (${d.weekday.slice(0, 3)})`,
              wizardStep: 'date',
              val: d.dateString
            }))
          );
        } else {
          addBotMessage(
            `Fecha elegida: ${formatDateToSpanish(val) || val}.\n\nTurnos con aforo disponible para ${requiredGuests} ${requiredGuests === 1 ? 'persona' : 'personas'}:`,
            availableOptions
          );
        }
      } catch (err) {
        console.error('Error in wizard availability:', err);
        setIsTyping(false);
        addBotMessage(
          `Fecha seleccionada: ${formatDateToSpanish(val) || val}. ¿Qué turno prefieres?`,
          [
            { label: '☀️ Almuerzo · 1:00 PM', wizardStep: 'time', val: '13:00' },
            { label: '☀️ Almuerzo · 2:00 PM', wizardStep: 'time', val: '14:00' },
            { label: '🌙 Cena · 7:00 PM', wizardStep: 'time', val: '19:00' },
            { label: '🌙 Cena · 8:00 PM', wizardStep: 'time', val: '20:00' },
            { label: '🌙 Cena · 9:00 PM', wizardStep: 'time', val: '21:00' }
          ]
        );
      }
    } else if (step === 'time') {
      const targetGuests = bookingWizard.guests || 2;
      const targetDate = bookingWizard.date || getTodayDateString();
      const targetTime = val;

      addBotMessage(
        `¡Perfecto! Todo listo para tu reserva en Donde Ray:\n\n` +
        `• Comensales: ${targetGuests} personas\n` +
        `• Fecha: ${formatDateToSpanish(targetDate) || targetDate}\n` +
        `• Horario: ${formatTime12h(targetTime) || targetTime}\n\n` +
        `Haz clic abajo para abrir el formulario con estos datos prellenados y confirmar:`,
        [
          {
            label: `Confirmar Mesa (${targetGuests} pers. / ${formatTime12h(targetTime)}) →`,
            to: `/reservar?date=${targetDate}&time=${targetTime}&guests=${targetGuests}`
          }
        ]
      );
    }
  };

  const handleActionClick = (action) => {
    if (action.to) {
      setIsOpen(false);
      navigate(action.to);
      return;
    }

    if (action.wizardStep) {
      handleWizardStep(action.wizardStep, action.val);
      return;
    }

    if (action.actionId === 'aforo_vivo') {
      handleCheckLiveCapacity(action.dateVal || null);
      return;
    }

    if (action.actionId === 'aforo_manana') {
      const tm = new Date();
      tm.setDate(tm.getDate() + 1);
      handleCheckLiveCapacity(tm.toISOString().split('T')[0]);
      return;
    }

    if (action.actionId === 'consultar_reserva') {
      handleCheckReservationStatus(action.query || null);
      return;
    }

    if (action.actionId) {
      handleIntent(action.actionId);
    }
  };

  return (
    <>
      {/* Botón Flotante Concierge con Emblema Toucan */}
      <div className="chatbot-fab-container">
        {!isOpen && (
          <button
            type="button"
            className="chatbot-fab-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir asistente concierge de Donde Ray"
          >
            <img 
              src="/brand-logo.png" 
              alt="Donde Ray Logo" 
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #fae4a8' }}
            />
            <span className="chatbot-fab-text">Asistente Ray</span>
            <span className="chatbot-fab-pulse" />
          </button>
        )}
      </div>

      {/* Ventana Flotante de Chat */}
      {isOpen && (
        <aside className="chatbot-window" aria-label="Ventana de chat con Concierge Ray">
          {/* Encabezado con Botón Cerrar Visible y Configuración de IA */}
          <header className="chatbot-header">
            <div className="chatbot-header-info">
              <img 
                src="/brand-logo.png" 
                alt="Donde Ray" 
                className="chatbot-avatar-img"
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong className="chatbot-header-title">Ray · Concierge AI</strong>
                  <span className="chatbot-ai-badge">
                    {aiConfig.apiKey ? 'AI Externa' : 'AI Limonense'}
                  </span>
                </div>
                <span className="chatbot-header-subtitle">Alta Cocina · Puerto Viejo, Limón</span>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                type="button"
                className="chatbot-config-btn"
                onClick={() => {
                  setMessages([INITIAL_MESSAGE]);
                  setBookingWizard({ active: false, guests: null, date: null, time: null });
                  setAwaitingReservationQuery(false);
                }}
                title="Reiniciar conversación"
                aria-label="Reiniciar conversación"
              >
                ↺
              </button>
              <button
                type="button"
                className="chatbot-config-btn"
                onClick={() => setShowAIConfig(!showAIConfig)}
                title="Configuración de Inteligencia Artificial"
                aria-label="Configurar API de IA"
              >
                ⚙
              </button>
              <button
                type="button"
                className="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
                title="Cerrar chat (Esc)"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Panel de Configuración de API Externa / Local de IA */}
          {showAIConfig && (
            <div className="chatbot-config-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Conexión AI Externa (OpenAI / Gemini / Ollama)</label>
                <button 
                  type="button" 
                  onClick={() => setShowAIConfig(false)}
                  style={{ background: 'none', border: 'none', color: '#c8860a', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  ✕ Cerrar
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(240, 230, 204, 0.75)', lineHeight: 1.4 }}>
                Ingresa tu API Key para activar el modelo generativo externo. Si lo dejas vacío, Ray opera con el motor de conocimiento local entrenado de Donde Ray.
              </p>
              <input 
                type="password" 
                placeholder="sk-... (API Key OpenAI o compatible)" 
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <input 
                type="url" 
                placeholder="https://api.openai.com/v1/chat/completions" 
                value={tempEndpoint}
                onChange={(e) => setTempEndpoint(e.target.value)}
              />
              <button
                type="button"
                className="chatbot-config-save-btn"
                onClick={() => {
                  saveAIConfig({ apiKey: tempApiKey, endpoint: tempEndpoint });
                  setAiConfig(getAIConfig());
                  setShowAIConfig(false);
                  addBotMessage(' ¡Configuración de IA actualizada! Listo para atenderte con las respuestas del modelo.');
                }}
              >
                Guardar Conexión AI
              </button>
            </div>
          )}

          {/* Barra de Acceso Rápido con scroll horizontal */}
          <div className="chatbot-quick-chips" aria-label="Temas rápidos">
            {QUICK_CATEGORIES.map((qa) => (
              <button
                key={qa.id}
                type="button"
                className="chatbot-chip-btn"
                onClick={() => handleActionClick({ actionId: qa.id })}
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Área de Mensajes */}
          <div className="chatbot-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chatbot-msg-row ${
                  m.sender === 'user' ? 'chatbot-msg-row--user' : 'chatbot-msg-row--bot'
                }`}
              >
                {m.sender === 'bot' && (
                  <img 
                    src="/brand-logo.png" 
                    alt="Ray" 
                    className="chatbot-msg-avatar"
                  />
                )}
                <div className="chatbot-bubble-wrap">
                  <div
                    className={`chatbot-bubble ${
                      m.sender === 'user' ? 'chatbot-bubble--user' : 'chatbot-bubble--bot'
                    }`}
                  >
                    <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{m.text}</p>
                  </div>

                  {/* Acciones interactivas de 1 clic en el mensaje */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="chatbot-action-buttons">
                      {m.actions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="chatbot-btn-action"
                          onClick={() => handleActionClick(act)}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-msg-row chatbot-msg-row--bot">
                <img 
                  src="/brand-logo.png" 
                  alt="Ray" 
                  className="chatbot-msg-avatar"
                />
                <div className="chatbot-bubble chatbot-bubble--bot chatbot-typing">
                  <span className="chatbot-typing-dot" />
                  <span className="chatbot-typing-dot" />
                  <span className="chatbot-typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form
            className="chatbot-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Escribe tu consulta o pide una recomendación..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="chatbot-input"
              aria-label="Mensaje para el concierge"
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputVal.trim()}
              aria-label="Enviar mensaje"
            >
              →
            </button>
          </form>
        </aside>
      )}
    </>
  );
};

export default ChatbotConcierge;
