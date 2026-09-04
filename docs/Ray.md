# Panel administrativo de Donde Ray

## Alcance

Se implemento el panel administrativo de Donde Ray con React. El panel permite consultar reservas y clientes, revisar estadisticas y gestionar el estado de las reservas.

## Funcionalidades

- Consulta de todas las reservas.
- Consulta de usuarios registrados.
- Tarjetas con:
  - Reservas pendientes.
  - Reservas confirmadas.
  - Reservas rechazadas.
  - Reservas del dia.
  - Clientes registrados.
- Tabla de reservas con cliente, fecha, hora, personas, tipo y estado.
- Filtro por fecha y estado.
- Visualizacion del detalle completo de una reserva.
- Confirmacion de reservas pendientes.
- Rechazo de reservas pendientes.
- Recarga de reservas y estadisticas despues de actualizar un estado.
- Tabla de clientes registrados.
- Consulta del historial de reservas asociado a un cliente.
- Estados visuales de carga, error y lista vacia.
- Proteccion de las rutas administrativas para usuarios con rol `admin`.

## API utilizada

La aplicacion consume JSON Server en `http://localhost:3001`.

| Operacion | Endpoint | Uso |
| --- | --- | --- |
| GET | `/reservations` | Cargar las reservas |
| GET | `/users` | Cargar los clientes |
| PATCH | `/reservations/:id` | Actualizar el campo `estado` de una reserva |

Los estados soportados son:

- `Pendiente`
- `Confirmada`
- `Rechazada`
- `Cancelada`
- `Completada`

## Rutas

- `/admin`: resumen operativo, estadisticas y reservas.
- `/admin/reservas`: vista administrativa de reservas.
- `/admin/clientes`: directorio de clientes e historial.

El acceso se concede cuando el usuario guardado en `localStorage` bajo `user` o `currentUser` tiene `role` o `rol` con valor `admin`.

Los usuarios sin permisos son redirigidos a `/login` y reciben un mensaje de acceso restringido.

## Archivos principales

### Servicios y hooks

- `src/shared/services/api-client.js`: cliente HTTP base.
- `src/features/admin-reservations/admin-service.js`: operaciones de reservas y usuarios.
- `src/features/admin-reservations/use-admin-reservations.js`: estado, carga y actualizacion de reservas.
- `src/features/admin-clients/use-admin-clients.js`: estado y carga de clientes.
- `src/features/admin-dashboard/use-admin-stats.js`: calculo y carga de estadisticas.

### Componentes

- `src/features/admin-dashboard/components/stats-summary.jsx`
- `src/features/admin-reservations/components/reservations-table.jsx`
- `src/features/admin-reservations/components/date-filters.jsx`
- `src/features/admin-reservations/components/action-buttons.jsx`
- `src/features/admin-reservations/components/reservation-detail-modal.jsx`
- `src/features/admin-clients/components/clients-table.jsx`
- `src/features/admin-clients/components/client-history-modal.jsx`

### Paginas y routing

- `src/pages/admin/dashboard-page.jsx`
- `src/pages/admin/manage-reservations-page.jsx`
- `src/pages/admin/manage-clients-page.jsx`
- `src/shared/routing/admin-route.jsx`
- `src/shared/routing/app-router.jsx`

## Ejecucion

Instalar dependencias:

```bash
npm install
```

Iniciar la aplicacion React:

```bash
npm run dev
```

Iniciar JSON Server usando un archivo `db.json` con las colecciones `reservations` y `users`:

```bash
npx json-server --watch db.json --port 3001
```

## Validacion realizada

Los siguientes comandos finalizan correctamente:

```bash
npm run build
npm run lint
```

El repositorio actual tiene `db.json` vacio. Mientras no existan datos en la API, el panel muestra los estados vacios correspondientes.
