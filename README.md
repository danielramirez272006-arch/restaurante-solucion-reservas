# 🌴 Restaurante Donde Ray — Sistema de Gestión de Reservas

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-ca4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![JSON Server](https://img.shields.io/badge/JSON_Server-v1.0-000000?logo=json&logoColor=white)](https://github.com/typicode/json-server)
[![Metodología](https://img.shields.io/badge/Metodología-Vibe_Coding-8a2be2)](#metodología-y-arquitectura)

> **MVP funcional desarrollado en equipo** para la gestión integral de reservas, experiencia digital del comensal, control de aforo en tiempo real y administración operativa del restaurante **"Donde Ray"**.

---

## 📋 Tabla de Contenido

- [Visión General](#-visión-general)
- [Distribución del Equipo y Módulos](#-distribución-del-equipo-y-módulos)
- [Reglas de Negocio Estrictas](#-reglas-de-negocio-estrictas)
- [Stack Tecnológico](#-stack-tecnológico)
- [Puesta en Marcha](#-puesta-en-marcha-rápida)
- [Credenciales de Prueba](#-credenciales-de-prueba-demo)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Adicional](#-documentación-adicional)

---

## 🌟 Visión General

**Donde Ray** es una plataforma web para un restaurante de alta cocina caribeña que resuelve el flujo completo de atención:
1. **Comensales (Cliente):** Consulta de disponibilidad en tiempo real, creación y reagendamiento de reservas, generación instantánea de comprobantes digitales (Voucher Ticket) con código QR, descarga de boletos en PDF y sincronización con Google Calendar.
2. **Administración (Staff / Gerencia):** Panel de control operativo con métricas de ocupación, gestión de estados de reserva (Pendiente, Confirmada, Rechazada, Cancelada) y directorio de clientes con historial de visitas.
3. **Público General:** Carta y catálogo gastronómico, experiencia de bienvenida y diseño responsivo adaptativo.

---

## 👥 Distribución del Equipo y Módulos

El proyecto fue desarrollado bajo una arquitectura modular y desacoplada por un equipo de 4 desarrolladores:

| Integrante | Rol / Módulo Asignado | Responsabilidades y Archivos Clave |
| :--- | :--- | :--- |
| **Dani** | **Flujo de Reservas del Cliente** | • Disponibilidad dinámica por turnos (máx. 20 comensales).<br>• Límite de 5 reservas por cliente por fecha.<br>• Selector de 7 días rápidos y barras visuales de capacidad.<br>• Voucher digital con QR (`qrcode.react`), PDF (`jspdf`) y Google Calendar.<br>• Vista *Mis Reservas* con filtrado por `userId`, exportación CSV y reagendamiento.<br>📁 `src/features/client-reservations/`, `src/pages/client/` |
| **Sebas** | **Autenticación y Sesiones** | • Contexto global de autenticación (`useAuth`, `AuthProvider`).<br>• Formularios de inicio de sesión y registro de clientes.<br>• Persistencia en sesión y protección de rutas privadas y administrativas.<br>📁 `src/features/auth/`, `src/shared/context/auth-context.jsx` |
| **Ray** | **Panel de Administración** | • Dashboard con estadísticas operativas (reservas del día, pendientes, confirmadas).<br>• Tabla de reservas con filtros por fecha y estado.<br>• Flujo para confirmar o rechazar reservas con recarga de métricas.<br>• Directorio de clientes con historial de consumo.<br>📁 `src/features/admin-*`, `src/pages/admin/` |
| **Hellen** | **Páginas Públicas y Layout** | • Landing page institucional y presentación del restaurante.<br>• Catálogo y carta del menú gastronómico.<br>• Layout global (`Navbar`, `Footer`, página 404 personalizada) y tokens visuales.<br>📁 `src/pages/public/`, `src/shared/components/layout/` |

---

## ⚖️ Reglas de Negocio Estrictas

El sistema garantiza la integridad operativa del restaurante mediante reglas validadas en frontend y backend:

1. **Capacidad Máxima por Franja (20 personas):**
   - El restaurante opera en franjas horarias configuradas (`12:00`, `13:00`, `14:00`, `15:00`, `18:00`, `19:00`, `20:00`, `21:00`, `22:00`).
   - Se calcula en tiempo real la suma de `guests` activos (excluyendo reservas canceladas). Si una reserva nueva excede el remanente de 20 personas, la franja se bloquea con aviso de aforo completo.
   - Se aplica **programación defensiva**: se valida en la selección de horarios y nuevamente antes de confirmar el POST.
2. **Límite Diario por Usuario (Máximo 5 reservas):**
   - Un mismo usuario no puede registrar más de 5 reservas para una misma fecha. Si intenta crear la sexta, el sistema bloquea la acción con un error claro.
3. **Estado Inicial Obligatorio:**
   - Toda nueva reserva ingresa forzosamente con `status: 'Pendiente'`.
4. **Filtrado Exclusivo en "Mis Reservas":**
   - Las consultas del cliente viajan directamente con `GET /reservations?userId=...` a nivel de red para proteger la privacidad de otros usuarios.

---

## 💻 Stack Tecnológico

- **Frontend Core:** React 19, JavaScript (ESModules)
- **Tooling & Bundler:** Vite 8
- **Enrutamiento:** React Router DOM v7 (Rutas públicas, privadas y de administrador)
- **Backend Mock:** JSON Server (REST API en `http://localhost:3001`)
- **Generación de Documentos:** jsPDF v2.5
- **Códigos QR:** qrcode.react v4.2
- **Diseño & Estilos:** Vanilla CSS con variables de diseño, glassmorphism y paleta prémium para gastronomía

---

## 🚀 Puesta en Marcha Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/danielramirez272006-arch/restaurante-solucion-reservas.git
cd restaurante-solucion-reservas
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el Backend Simulado (JSON Server)
En una primera terminal, ejecuta el servidor en el puerto **3001**:
```bash
npx json-server db.json --port 3001
```
> El backend quedará disponible en `http://localhost:3001` con los endpoints `/reservations` y `/users`.

### 4. Iniciar la Aplicación Frontend (Vite)
En una segunda terminal, arranca el entorno de desarrollo:
```bash
npm run dev
```
> Abre tu navegador en la URL indicada por Vite (normalmente `http://localhost:5173` o `http://localhost:5175`).

---

## 🔑 Credenciales de Prueba (Demo)

El archivo `db.json` incluye usuarios preconfigurados para probar todos los roles del sistema:

| Rol | Correo Electrónico | Contraseña | Acceso y Permisos |
| :--- | :--- | :--- | :--- |
| **Cliente Demo** | `user@demo.com` | `1234` | Acceso a `/reservar`, `/mis-reservas` y `/dashboard` |
| **Administrador** | `admin@demo.com` | `1234` | Acceso total a `/admin`, `/admin/reservas` y `/admin/clientes` |

---

## 📁 Estructura del Proyecto

```text
restaurante-solucion-reservas/
├── docs/                               # Documentación técnica por módulo
│   ├── modulo-reservas-cliente.md      # Documentación detallada del módulo de cliente
│   ├── Ray.md                          # Documentación del panel de administración
│   └── README.md                       # Índice de documentación técnica
├── public/                             # Recursos estáticos (favicons, imágenes, SVGs)
├── src/
│   ├── assets/                         # Ilustraciones y recursos visuales
│   ├── features/                       # Módulos encapsulados por dominio
│   │   ├── admin-clients/              # Gestión de clientes y su historial
│   │   ├── admin-dashboard/            # Métricas y estadísticas de ocupación
│   │   ├── admin-reservations/         # Tabla operativa y cambio de estados
│   │   ├── auth/                       # Lógica de login, registro y servicio auth
│   │   └── client-reservations/        # Flujo de reserva, hooks, calendarios y vouchers
│   ├── pages/                          # Vistas organizadas por rol
│   │   ├── admin/                      # Dashboard y administración
│   │   ├── client/                     # Reservar mesa, Mis Reservas y dashboard cliente
│   │   └── public/                     # Home, Menú, Login, Registro y 404
│   ├── shared/                         # Código transversal reutilizable
│   │   ├── components/                 # Componentes UI (Button, Modal, Badge, Layout)
│   │   ├── context/                    # AuthContext global
│   │   ├── routing/                    # AppRouter, PrivateRoute y AdminRoute
│   │   ├── services/                   # Cliente HTTP base
│   │   └── utils/                      # Reglas de negocio, helpers de fecha y PDF
│   ├── App.jsx                         # Componente raíz con AuthProvider y BrowserRouter
│   ├── index.css                       # Sistema de diseño, tokens y reset
│   └── main.jsx                        # Punto de entrada de React 19
├── db.json                             # Base de datos simulada para JSON Server
└── package.json
```

---

## 📖 Documentación Adicional

Para revisar el detalle exhaustivo del diseño técnico, justificaciones de arquitectura y guías para sustentación oral:
- 🍽️ **[Documentación Módulo de Reservas (Cliente)](./docs/modulo-reservas-cliente.md)**
- 🛡️ **[Documentación Panel Administrativo](./docs/Ray.md)**

---

## 🛠️ Scripts Disponibles

- `npm run dev` — Inicia el servidor de desarrollo Vite con Hot Module Replacement (HMR).
- `npm run build` — Genera el bundle optimizado para producción en `/dist`.
- `npm run lint` — Ejecuta el análisis estático de código con ESLint.
- `npm run preview` — Previsualiza localmente la versión compilada de producción.
