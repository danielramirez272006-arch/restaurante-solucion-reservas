# Documentación Técnica: Módulo de Reservas de Cliente - "Donde Ray"

> **Proyecto:** MVP Restaurante "Donde Ray"  
> **Rol asignado:** Flujo de Reservas del Cliente  
> **Metodología:** Vibe Coding (Código limpio, modular, desacoplado y robusto)  
> **Backend simulado:** JSON Server (`http://localhost:3001/reservations`)

---

## 1. Resumen Ejecutivo del Módulo

El módulo de reservas del cliente permite a los comensales del restaurante "Donde Ray":
1. **Acceso Rápido de Días y Franjas:** Consultar la disponibilidad de mesas en tiempo real con selector de los próximos 7 días y barras visuales de capacidad por franja horaria.
2. **Crear Reservas con Experiencia Temática:** Formulario con selector visual de ocasión (Cena Romántica, Cumpleaños, Negocios, Familiar, etc.) y validaciones automáticas de capacidad (20 personas máx.) y límites diarios por usuario (máx. 5).
3. **Comprobante Digital (Voucher Ticket):** Con código QR dinámico (`qrcode.react`), descarga en PDF con diseño formal (`jspdf`) y botón directo para agendar en **Google Calendar**.
4. **Gestión Completa en "Mis Reservas":** Filtrando exclusivamente sus registros mediante query param en backend (`GET /reservations?userId=...`), clasificación entre reservas **Próximas vs Pasadas**, opción de **Reagendar** reservas pendientes, cancelación y **Exportación a CSV / Excel**.

---

## 2. Reglas de Negocio Estrictas Implementadas

| # | Regla de Negocio | Implementación Técnica | Comportamiento en UI / Backend |
|---|---|---|---|
| **1** | **Capacidad Máxima (20 personas por franja horaria)** | `calculateOccupancyBySlot()` y `getSlotsAvailability()` en `reservation-rules.js` | Suma los `guests` de reservas activas (excluye `Cancelada`). Muestra una barra visual de ocupación (Verde, Ámbar o Roja) y deshabilita si `ocupados + nuevos > 20`. En el POST, revalida con un fetch fresco para prevenir condiciones de carrera. |
| **2** | **Límite por Usuario (Máx. 5 reservas por fecha)** | `checkUserDailyLimit()` en `reservation-rules.js` | Si un usuario ya tiene 5 reservas registradas para una misma fecha, se despliega una alerta preventiva en el calendario, se deshabilitan las franjas y se bloquea el envío con un error claro. |
| **3** | **Estado Inicial Obligatorio** | Forzado en `use-reservations.js` y `reservation-service.js` | Toda nueva reserva enviada al backend tiene fijado de forma inmutable el atributo `"status": "Pendiente"`. |
| **4** | **Disponibilidad Dinámica** | Fetch `GET /reservations?date=YYYY-MM-DD` | Antes de habilitar un turno, se consultan las reservas de esa fecha en el servidor y se calcula la capacidad restante por hora. |
| **5** | **Filtrado Exclusivo del Cliente** | Fetch `GET /reservations?userId=X` | En "Mis Reservas", la consulta viaja con el parámetro de query a JSON Server, asegurando que el cliente nunca descargue ni vea reservas ajenas. |

---

## 3. Contrato de Datos (REST API)

Toda reserva creada en el endpoint `http://localhost:3001/reservations` respeta el siguiente esquema JSON:

```json
{
  "id": "1a2b",
  "userId": "user_1",
  "guestName": "Daniel Ramírez",
  "email": "daniel@dondeway.com",
  "phone": "+57 300 123 4567",
  "date": "2026-09-10",
  "time": "19:00",
  "guests": 4,
  "type": "Cena",
  "notes": "Mesa cerca de la ventana, celebración de aniversario",
  "status": "Pendiente",
  "createdAt": "2026-09-04T20:15:00.000Z"
}
```

---

## 4. Mejoras de Alto Valor Agregado Implementadas

1. **Chips de Acceso Rápido para los Próximos 7 Días (`availability-calendar.jsx`)**:
   - Cinta de botones interactivos con días próximos ("Hoy", "Mañana", "Sáb 5", etc.) para cambio instantáneo de fecha sin abrir el date picker nativo.
2. **Barra Visual de Ocupación por Horario (`availability-calendar.jsx`)**:
   - Micro-barra de progreso en cada franja horaria que ilustra el porcentaje de ocupación en tiempo real (Verde < 60%, Ámbar 60-89%, Rojo 90-100%).
3. **Selector Visual de Ocasión (`booking-form.jsx`)**:
   - Tarjetas clicables con iconos temáticos: 🍷 Cena Gourmet, 🕯️ Cena Romántica, 🎂 Cumpleaños, 🥂 Aniversario, 💼 Negocios, 👨‍👩‍👧‍👦 Familiar, ✨ Casual.
4. **Integración con Google Calendar (`voucher-ticket.jsx`)**:
   - Botón directo que genera la URL de Google Calendar con los datos prellenados (horario, nombre, comensales y ubicación).
5. **Reagendamiento de Reservas Pendientes (`reservation-card.jsx` y `use-reservations.js`)**:
   - Posibilidad de modificar fecha, hora y comensales de una reserva pendiente, revalidando las reglas de capacidad de 20 cupos.
6. **Clasificación Temporal y Exportación a CSV (`my-reservations-page.jsx`)**:
   - Pestañas para filtrar reservas **Próximas** vs **Historial / Pasadas**.
   - Botón para descargar todas las reservas del cliente en formato `.csv` compatible con Excel.

---

## 5. Estructura de Archivos y Responsabilidades

```text
src/
├── features/
│   └── client-reservations/
│       ├── reservation-service.js        # Consumo HTTP (GET, POST, PATCH update y cancel)
│       ├── use-reservations.js           # Custom hook (Estado reactivo, pre-flight checks y reagendamiento)
│       └── components/
│           ├── availability-calendar.jsx # 7 días rápidos, franjas y barras de capacidad
│           ├── booking-form.jsx          # Formulario con ocasiones temáticas y validación en vivo
│           ├── reservation-card.jsx      # Tarjeta con badges, reagendamiento inline y cancelación
│           └── voucher-ticket.jsx        # Comprobante digital con QR, PDF y Google Calendar
├── pages/
│   └── client/
│       ├── book-reservation-page.jsx     # Vista principal de reserva (layout 2 columnas)
│       └── my-reservations-page.jsx      # Vista "Mis Reservas" con filtros temporales y exportación CSV
└── shared/
    └── utils/
        ├── date-helpers.js               # Utilidades de fecha, horas 12h/24h, días rápidos y Google Calendar URL
        └── reservation-rules.js          # Constantes y funciones puras de reglas de negocio
```

---

## 6. Guía de Ejecución y Pruebas Locales

### Paso 1: Iniciar el Backend Simulado (JSON Server)
En una terminal:
```bash
npx json-server --watch db.json --port 3001
```

### Paso 2: Iniciar la Aplicación Frontend (Vite)
En otra terminal:
```bash
npm run dev
```

---

## 7. Puntos Clave para la Defensa Oral (Tech Lead Tips)

1. **¿Cómo garantizas que no se superen las 20 personas por turno si dos usuarios intentan reservar al mismo tiempo?**
   > *"Apliqué una estrategia de validación en dos capas (programación defensiva). Primero, en la UI se calculan los cupos restantes e informamos visualmente con una barra de progreso. Segundo, en el hook `bookReservation`, justo antes de despachar el POST, se vuelven a solicitar las reservas frescas del backend para verificar que los cupos sigan disponibles en ese instante."*

2. **¿Por qué la vista 'Mis Reservas' filtra en el servidor y no en el frontend?**
   > *"Por optimización de red y seguridad. Si trajéramos todas las reservas del restaurante (`GET /reservations`) para luego usar `.filter()` en JavaScript, estaríamos transmitiendo datos privados de otros comensales y consumiendo ancho de banda innecesario. Usar `GET /reservations?userId=...` delega el filtrado al backend."*

3. **¿Cómo se integrará este módulo cuando el compañero de Autenticación termine su parte?**
   > *"El módulo no depende rígidamente de una implementación específica de Auth. `use-reservations.js` acepta un usuario inyectado por props o lo lee de `localStorage`. Cuando el contexto global de autenticación esté listo, solo bastará pasar el `user` del contexto sin modificar la lógica interna de reservas."*

4. **¿Por qué las reservas canceladas no restan capacidad?**
   > *"En `calculateOccupancyBySlot()` y `checkUserDailyLimit()` filtramos explícitamente `status !== 'Cancelada'`. Una reserva cancelada libera los cupos de la mesa para otros comensales y no penaliza al usuario en su límite de 5 reservas diarias."*
