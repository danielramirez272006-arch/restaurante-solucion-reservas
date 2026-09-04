# Documentación Técnica: Módulo de Reservas de Cliente - "Donde Ray"

> **Proyecto:** MVP Restaurante "Donde Ray"  
> **Rol asignado:** Flujo de Reservas del Cliente  
> **Metodología:** Vibe Coding (Código limpio, modular, desacoplado y robusto)  
> **Backend simulado:** JSON Server (`http://localhost:3001/reservations`)

---

## 1. Resumen Ejecutivo del Módulo

El módulo de reservas del cliente permite a los comensales del restaurante "Donde Ray":
1. Consultar la disponibilidad de mesas y franjas horarias en tiempo real.
2. Crear una nueva reserva con validaciones automáticas de capacidad y límites diarios por usuario.
3. Obtener un comprobante digital (**Voucher Ticket**) con código QR dinámico y opción de descarga en PDF.
4. Gestionar su historial en **Mis Reservas**, filtrando exclusivamente sus registros mediante query param en backend (`GET /reservations?userId=...`), con soporte para cancelación y visualización de comprobantes.

---

## 2. Reglas de Negocio Estrictas Implementadas

| # | Regla de Negocio | Implementación Técnica | Comportamiento en UI / Backend |
|---|---|---|---|
| **1** | **Capacidad Máxima (20 personas por franja horaria)** | `calculateOccupancyBySlot()` y `getSlotsAvailability()` en `reservation-rules.js` | Suma los `guests` de reservas activas (excluye `Cancelada`). Si `ocupados + nuevos > 20`, bloquea el horario con tag "Agotado" o "Solo X cupos". En el POST, revalida con un fetch fresco para prevenir condiciones de carrera. |
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

## 4. Estructura de Archivos y Responsabilidades

Todo el desarrollo se concentró **exclusivamente** dentro del alcance asignado, respetando la arquitectura del equipo de 4 personas:

```text
src/
├── features/
│   └── client-reservations/
│       ├── reservation-service.js        # Capa de consumo HTTP (Fetch API: GET y POST)
│       ├── use-reservations.js           # Custom hook (Estado reactivo, orquestación y pre-flight checks)
│       └── components/
│           ├── availability-calendar.jsx # Selector de fecha y cuadrícula de franjas horarias
│           ├── booking-form.jsx          # Formulario de datos del titular y validaciones inline
│           ├── reservation-card.jsx      # Tarjeta visual para el historial con badges de estado
│           └── voucher-ticket.jsx        # Comprobante digital con QR (qrcode.react) y PDF (jspdf)
├── pages/
│   └── client/
│       ├── book-reservation-page.jsx     # Página principal de reservas (layout 2 columnas)
│       └── my-reservations-page.jsx      # Página "Mis Reservas" con tabs y búsqueda
└── shared/
    └── utils/
        ├── date-helpers.js               # Utilidades de fecha, horas (12h/24h) y franjas del restaurante
        └── reservation-rules.js          # Aislamiento de constantes y funciones de validación pura
```

### Detalle de Componentes y Módulos

#### 1. `reservation-service.js`
- `getReservationsByDate(date)`: Consulta reservas activas para la fecha especificada (`GET /reservations?date=...`).
- `getUserReservations(userId)`: Consulta las reservas exclusivas del usuario (`GET /reservations?userId=...`).
- `getReservationById(id)`: Consulta individual por ID.
- `createReservation(reservationData)`: Envía el `POST` forzando `status: 'Pendiente'`.
- `cancelReservation(id)`: Envía un `PATCH` para actualizar el estado a `'Cancelada'`.

#### 2. `use-reservations.js`
- Gestiona los estados: `reservations`, `selectedDate`, `dateReservations`, `loading`, `availabilityLoading`, `actionLoading`, `error`, `activeVoucher`.
- Implementa **Programación Defensiva**: antes de ejecutar el POST, consulta la disponibilidad fresca en tiempo real para evitar condiciones de carrera (*race conditions*).
- Desacoplamiento de Auth: detecta el usuario desde sesión, `localStorage` o fallback de desarrollo.

#### 3. `availability-calendar.jsx`
- Despliega las franjas horarias estándar (`12:00`, `13:00`, `14:00`, `15:00`, `18:00`, `19:00`, `20:00`, `21:00`, `22:00`).
- Muestra el estado de cada franja: *"Disponibles"*, *"Pocos cupos"*, *"Agotado"*, o *"Horario pasado"*.
- Muestra una alerta si el usuario superó las 5 reservas para la fecha seleccionada.

#### 4. `booking-form.jsx`
- Selector interactivo de comensales (1 a 20 personas).
- Campos con validación en tiempo real: Nombre, Teléfono, Correo, Tipo de evento y Notas especiales.
- Indicador visual del estado inicial obligatorio (`Pendiente`).

#### 5. `reservation-card.jsx`
- Tarjeta de presentación de reserva con códigos de color para estados:
  - **Pendiente:** Ámbar / Naranja (`#fbbf24`)
  - **Confirmada:** Verde Esmeralda (`#34d399`)
  - **Cancelada:** Rojo Carmesí (`#f87171`)
- Botón para abrir el voucher y botón para cancelar reserva activa.

#### 6. `voucher-ticket.jsx`
- Diseño tipo boleto gastronómico prémium para "Donde Ray".
- Renderizado de código QR interactivo con los datos de la reserva usando `qrcode.react`.
- Generación y descarga directa de documento PDF estilizado mediante `jspdf`.
- Soporte para impresión directa (`window.print()`).

---

## 5. Guía de Ejecución y Pruebas Locales

### Paso 1: Iniciar el Backend Simulado (JSON Server)
En una terminal independiente, ejecutar:
```bash
npx json-server --watch db.json --port 3001
```

### Paso 2: Iniciar la Aplicación Frontend (Vite)
En otra terminal:
```bash
npm run dev
```

### Paso 3: Estructura inicial de `db.json` recomendada para pruebas
```json
{
  "reservations": [
    {
      "id": "res-101",
      "userId": "user_1",
      "guestName": "Daniel Ramírez",
      "email": "daniel@dondeway.com",
      "phone": "+57 300 123 4567",
      "date": "2026-09-04",
      "time": "19:00",
      "guests": 4,
      "type": "Cena",
      "notes": "Mesa terraza",
      "status": "Pendiente",
      "createdAt": "2026-09-04T12:00:00.000Z"
    }
  ]
}
```

---

## 6. Puntos Clave para la Defensa Oral (Tech Lead Tips)

1. **¿Cómo garantizas que no se superen las 20 personas por turno si dos usuarios intentan reservar al mismo tiempo?**
   > *"Apliqué una estrategia de validación en dos capas (programación defensiva). Primero, en la UI se calculan los cupos restantes para informar al usuario de inmediato. Segundo, en el hook `bookReservation`, justo antes de despachar el POST, se vuelven a solicitar las reservas del backend para verificar que los cupos sigan disponibles en ese instante."*

2. **¿Por qué la vista 'Mis Reservas' filtra en el servidor y no en el frontend?**
   > *"Por optimización de red y seguridad. Si trajéramos todas las reservas del restaurante (`GET /reservations`) para luego usar `.filter()` en JavaScript, estaríamos transmitiendo datos privados de otros comensales y consumiendo ancho de banda innecesario. Usar `GET /reservations?userId=...` delega el filtrado al backend."*

3. **¿Cómo se integrará este módulo cuando el compañero de Autenticación termine su parte?**
   > *"El módulo no depende rígidamente de una implementación específica de Auth. `use-reservations.js` acepta un usuario inyectado por props o lo lee de `localStorage`. Cuando el contexto global de autenticación esté listo, solo bastará pasar el `user` del contexto sin modificar la lógica interna de reservas."*

4. **¿Por qué las reservas canceladas no restan capacidad?**
   > *"En `calculateOccupancyBySlot()` y `checkUserDailyLimit()` filtramos explícitamente `status !== 'Cancelada'`. Una reserva cancelada libera los cupos de la mesa para otros comensales y no penaliza al usuario en su límite de 5 reservas diarias."*
