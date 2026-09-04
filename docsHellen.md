# Donde Ray - Documentación de implementación visual

## 1. Alcance

Se implementó la primera capa visual y de navegación pública de **Donde Ray**, un restaurante premium con una interfaz editorial y una base preparada para integrar los flujos de autenticación, reservas, cliente y administración desarrollados por el resto del equipo.

La implementación se mantuvo separada de los servicios de datos y no reemplaza las reglas de disponibilidad, el contexto de autenticación ni las acciones administrativas.

## 2. Dirección visual

- **Identidad:** restaurante premium con una experiencia digital sobria y contemporánea.
- **Paleta:** verde bosque, papel cálido, crema, cobre y tonos neutros.
- **Tipografías:** `Newsreader` para titulares editoriales y `DM Sans` para navegación, textos y controles.
- **Composición:** espacios amplios, líneas finas, tarjetas discretas y jerarquía visual clara.
- **Fotografía:** imágenes de cocina utilizadas como apoyo visual del hero y de los platos destacados.
- **Interacción:** transiciones cortas en botones y navegación móvil desplegable.
- **Criterios:** sin emojis, sin colores saturados, sin animaciones excesivas y con foco en legibilidad.

## 3. Archivos creados o modificados

### Aplicación y estilos globales

- `src/App.jsx`
	- Configura `BrowserRouter`.
	- Declara las rutas públicas.
	- Incluye una superficie temporal para login y reservas mientras se integran los flujos reales.
- `src/App.css`
	- Contiene la identidad visual completa.
	- Define layout, navegación, hero, carta, footer, estados, modal y responsive.
- `src/index.css`
	- Elimina los estilos del starter de Vite.
	- Define la fuente base y estilos globales mínimos.
- `package-lock.json`
	- Actualizado después de instalar las dependencias declaradas en `package.json`.

### Layout

- `src/shared/components/layout/main-layout.jsx`
	- Wrapper general con `Navbar`, `Outlet` y `Footer`.
- `src/shared/components/layout/navbar.jsx`
	- Marca Donde Ray.
	- Enlaces a inicio, carta, nosotros, login y reservas.
	- Menú colapsable para pantallas pequeñas.
- `src/shared/components/layout/footer.jsx`
	- Enlaces principales.
	- Horarios, email, ubicación y copyright.

### Componentes UI reutilizables

- `src/shared/components/ui/button.jsx`
	- Botón reutilizable con variantes mediante la prop `variant`.
- `src/shared/components/ui/input.jsx`
	- Campo con etiqueta accesible y asociación mediante `htmlFor`.
- `src/shared/components/ui/card.jsx`
	- Contenedor reutilizable para contenido agrupado.
- `src/shared/components/ui/alert.jsx`
	- Alerta con variante visual y `role="status"`.
- `src/shared/components/ui/badge.jsx`
	- Badge de estado para reservas.
- `src/shared/components/ui/modal.jsx`
	- Estructura de modal con título, cierre y atributos ARIA.
- `src/shared/components/ui/loading-state.jsx`
	- Estado de carga visible para evitar pantallas vacías.
- `src/shared/components/ui/empty-state.jsx`
	- Estado vacío con título y descripción opcional.

## 4. Páginas implementadas

### Inicio: `/`

La landing pública contiene:

1. Hero con propuesta principal, imagen y CTA de reserva.
2. Sección de propuesta de valor.
3. Tres principios de Donde Ray:
	 - Producto cercano.
	 - Técnica sin ruido.
	 - Una mesa para volver.
4. Selección destacada de platos.
5. Sección “Nosotros” con ancla `/#nosotros`.
6. Sección de contacto con dirección y email.
7. Footer institucional.

### Carta: `/menu`

La página de carta contiene tres grupos editoriales:

- Para empezar.
- Del fuego.
- Para cerrar.

El texto aclara que la carta es orientativa y puede cambiar según disponibilidad. No se simulan precios, stock ni disponibilidad de reservas.

### Acceso: `/login`

Muestra una superficie informativa temporal que indica que el acceso se conectará con la autenticación del proyecto.

### Reservas: `/reservas`

Muestra una superficie informativa temporal que indica que el flujo se conectará con el sistema de disponibilidad.

### Página no encontrada

Todas las rutas no reconocidas muestran `NotFoundPage`, con enlace de retorno al inicio.

## 5. Rutas conectadas

| Ruta | Componente | Estado |
| --- | --- | --- |
| `/` | `HomePage` | Implementada |
| `/menu` | `MenuPage` | Implementada |
| `/login` | `PendingPage` | Pendiente de integración de autenticación |
| `/reservas` | `PendingPage` | Pendiente de integración de disponibilidad |
| `*` | `NotFoundPage` | Implementada |

## 6. Estados visuales

### Estados generales

- `LoadingState` para cargas en curso.
- `EmptyState` para colecciones sin resultados.
- `Alert` para mensajes informativos o de error.
- `NotFoundPage` para rutas inexistentes.

### Estados de reserva

`Badge` incluye etiquetas preparadas para diferenciar:

- `pending`: Pendiente.
- `confirmed`: Confirmada.
- `rejected`: Rechazada.
- `cancelled`: Cancelada.
- `completed`: Completada.

El componente está listo para ser consumido por las tablas y tarjetas de reservas cuando esos módulos tengan datos reales.

## 7. Responsive

Se incluyó un breakpoint principal para pantallas de hasta `720px`:

- La navegación se convierte en menú desplegable.
- Hero y secciones pasan de dos o tres columnas a una columna.
- Las tarjetas de platos se apilan verticalmente.
- La sección “Nosotros” se reorganiza en una sola columna.
- Los datos de contacto se apilan para evitar desbordes.
- El footer adapta sus columnas y su bloque inferior.
- La carta pasa de dos columnas a una columna.

La interfaz se comprobó en:

- Escritorio: `1440 x 900`.
- Móvil: `375 x 800`.

En móvil se verificó que el botón de navegación sea visible, que la imagen del hero se mantenga visible y que no exista overflow horizontal.

## 8. Comandos de validación

Instalación realizada:

```bash
npm install
```

Build de producción:

```bash
npm run build
```

Resultado: correcto. Vite compiló 32 módulos y generó la carpeta `dist`.

Lint:

```bash
npm run lint
```

Resultado: correcto, sin errores de ESLint.

Servidor local utilizado para la revisión visual:

```bash
npm run dev -- --host 127.0.0.1
```

URL local:

```text
http://127.0.0.1:5173/
```

## 9. Integraciones pendientes

- Conectar `/login` con `auth-context.jsx`, `auth-service.js` y los formularios reales.
- Conectar `/reservas` con disponibilidad, calendario y formulario de reserva.
- Montar las páginas de cliente y administración cuando sus componentes estén implementados.
- Aplicar `Badge`, `Alert`, `LoadingState` y `EmptyState` en tablas, tarjetas y paneles reales.
- Sustituir el contenido editorial de la carta por datos del servicio de menú cuando esté disponible.
- Confirmar si las imágenes remotas deben migrarse a `public/` o a `src/assets/` para producción.
- Revisar las dos vulnerabilidades reportadas por `npm install` antes del despliegue (`1 moderate`, `1 critical`).

## 10. Consideraciones de integración

- No se modificaron servicios, fetch, contexto, reglas de disponibilidad ni acciones administrativas.
- Login y reserva están señalizados como pendientes y no aparentan ejecutar acciones inexistentes.
- Los textos de platos actuales son contenido editorial de presentación y no representan disponibilidad real.
- El layout está basado en `Outlet`, por lo que las futuras páginas privadas pueden reutilizar la estructura general o incorporar wrappers específicos de cliente y administración.
