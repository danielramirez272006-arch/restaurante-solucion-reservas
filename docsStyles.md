# Donde Ray - Guía de estilos e interfaz

## 1. Propósito

Este documento describe la capa visual implementada para Donde Ray: una plataforma web de restaurante con experiencia pública, área de cliente y panel administrativo.

La interfaz combina la calidez de un restaurante caribeño contemporáneo con la claridad de una aplicación digital moderna. Los estilos se mantienen reutilizables para que las pantallas implementadas por otros integrantes puedan integrarse sin cambiar la identidad visual.

## 2. Archivos principales

### Estilos

- `src/App.css`: tokens de color, tipografías, layout público, componentes visuales, formularios, tablas, estados y responsive.
- `src/index.css`: estilos globales mínimos, fuente base y normalización inicial.

### Layout

- `src/shared/components/layout/navbar.jsx`: navegación pública y menú mobile.
- `src/shared/components/layout/footer.jsx`: pie de página, contacto y enlaces.
- `src/shared/components/layout/main-layout.jsx`: wrapper con `Navbar`, `Outlet` y `Footer`.

### Componentes UI

- `src/shared/components/ui/button.jsx`
- `src/shared/components/ui/input.jsx`
- `src/shared/components/ui/card.jsx`
- `src/shared/components/ui/alert.jsx`
- `src/shared/components/ui/badge.jsx`
- `src/shared/components/ui/modal.jsx`
- `src/shared/components/ui/loading-state.jsx`
- `src/shared/components/ui/empty-state.jsx`

## 3. Dirección visual

### Personalidad


La última capa visual refuerza las vibras caribeñas inspiradas en Jamaica y Limón: verde selva y verde hoja para la vegetación, terracota para el calor y la acción, amarillo solar para la luz, y arena/marfil para evocar playa, coco y materiales naturales. Se añadieron texturas radiales muy sutiles y sombras cálidas para sugerir luz costera sin convertir la interfaz en un patrón decorativo invasivo.

### Tipografía

Se utilizan dos familias:

- `Newsreader`: titulares, nombres de platos y mensajes de marca.
- `DM Sans`: navegación, párrafos, formularios, tablas y metadatos.

Los títulos usan una serif editorial con peso regular. Los textos operativos utilizan la sans-serif para mantener una lectura clara en desktop y mobile.

## 4. Sistema de color

Los tokens viven en `:root` dentro de `src/App.css` y deben reutilizarse en lugar de introducir colores aislados.

| Token | Hexadecimal | Uso |
| --- | --- | --- |
| `--ink` | `#17241F` | Texto principal y contraste. |
| `--deep-green` | `#24483B` | Navegación de aplicación, fondos oscuros y estructura. |
| `--leaf-green` | `#6F9366` | Disponibilidad, indicadores activos y acentos suaves. |
| `--lime` | `#D7B940` | Líneas, etiquetas y detalles de identidad. |
| `--sun-yellow` | `#E8C95B` | Highlights y estado pendiente. |
| `--terracotta` | `#B94F35` | CTA principal, acciones destacadas y atención. |
| `--clay-dark` | `#8E3827` | Hover de botones y estado rechazado. |
| `--sand` | `#E7D8B9` | Tarjetas y superficies secundarias. |
| `--cream` | `#F5F0E6` | Fondo principal de la aplicación. |
| `--paper` | `#FCFAF5` | Tarjetas, formularios, modales y superficies limpias. |
| `--muted` | `#70786F` | Descripciones, metadatos y texto secundario. |
| `--line` | `#D7D5C9` | Bordes, separadores y líneas de tablas. |

### Distribución visual

- Base: crema, marfil y arena.
- Estructura: verde selva y verde hoja.
- Acción: terracota.
- Identidad y énfasis: limón y amarillo sol.
- Contraste: negro carbón.

El terracota queda reservado para acciones importantes. El amarillo no se utiliza como color dominante de botones; funciona como acento, highlight o estado pendiente.

## 5. Botones

Las clases principales son:

```jsx
<button className="button button--primary">Reservar mesa</button>
<button className="button button--outline">Ver carta</button>
<button className="button button--small button--primary">Acción</button>
```

### Variantes

- `.button`: estructura base, alineación, espaciado y transición.
- `.button--primary`: fondo terracota y texto marfil.
- `.button--outline`: borde y texto terracota.
- `.button--small`: versión compacta para navbar y acciones secundarias.
- `.button-accent`: alias utilizado por el dashboard cliente.
- `.button-dark`: clase reservada para integraciones que necesiten acción sobre fondos claros.

Los botones deben usar textos cortos y representar acciones reales. No se deben agregar botones que parezcan funcionales si todavía no existe una acción conectada.

## 6. Cards y superficies

`Card` aplica la clase `.ui-card` y permite agregar una clase específica:

```jsx
<Card className="value-card">
	<h3>Producto cercano</h3>
	<p>Ingredientes de estación.</p>
</Card>
```

Superficies utilizadas:

- `.ui-card`: base neutra.
- `.value-card`: principios de marca.
- `.dish-card`: platos destacados.
- `.panel`: contenedores del panel administrativo.
- `.panel-card`: tarjetas del dashboard cliente.
- `.stat-card`: métricas resumidas.
- `.auth-card`: formulario de acceso y registro.

Las tarjetas utilizan bordes suaves y fondos cálidos. No se usan sombras pesadas ni tarjetas anidadas sin necesidad.

## 7. Formularios

`Input` mantiene la etiqueta asociada al campo mediante `htmlFor`:

```jsx
<Input id="email" label="Correo electrónico" type="email" />
```

Estilos incluidos:

- Fondo marfil.
- Borde natural.
- Texto carbón.
- Estado `:focus` con borde terracota y halo suave.
- Etiqueta visible y legible.
- Adaptación al ancho disponible.

Los formularios de login y registro utilizan `.auth-page` y `.auth-card` para mantener una superficie centrada y consistente.

## 8. Alertas, carga y estados vacíos

### Alertas

```jsx
<Alert variant="info">Mensaje informativo</Alert>
<Alert variant="error">No se pudo completar la acción</Alert>
```

Las alertas usan `role="status"` y diferencian información general de errores mediante borde y fondo.

### Carga

```jsx
<LoadingState label="Cargando reservas" />
```

Evita que una pantalla quede en blanco mientras se consulta información.

### Estado vacío

```jsx
<EmptyState
	title="No tienes reservas"
	description="Solicita una mesa para comenzar."
/>
```

Debe utilizarse cuando una lista válida no contiene registros.

## 9. Estados de reserva

`Badge` traduce estados internos a etiquetas visibles:

```jsx
<Badge status="pending" />
<Badge status="confirmed" />
<Badge status="rejected" />
<Badge status="cancelled" />
<Badge status="completed" />
```

| Estado interno | Etiqueta | Tratamiento visual |
| --- | --- | --- |
| `pending` | Pendiente | Amarillo suave. |
| `confirmed` | Confirmada | Verde claro. |
| `rejected` | Rechazada | Terracota claro. |
| `cancelled` | Cancelada | Gris cálido. |
| `completed` | Completada | Verde positivo. |

También existen clases `.status` para componentes existentes del dashboard cliente.

## 10. Navegación y layout público

### Navbar

La navbar incluye:

- Marca `DR` y nombre Donde Ray.
- Inicio.
- Carta.
- Nosotros.
- Iniciar sesión.
- Reservar mesa.

En mobile se reemplaza la navegación horizontal por un botón compacto que abre y cierra el menú.

### Footer

El footer contiene:

- Descripción breve de la marca.
- Enlaces a carta, nosotros y reservas.
- Horario de atención.
- Email.
- Ubicación general.
- Año y ciudad.

### Main layout

`MainLayout` usa `Outlet` para que las páginas públicas compartan automáticamente navbar y footer. Las rutas de cliente y administración pueden utilizar sus propios wrappers cuando necesitan navegación especializada.

## 11. Página de inicio

La home utiliza las siguientes clases principales:

- `.hero-section`: composición de texto e imagen.
- `.hero-copy`: propuesta de valor y CTA.
- `.hero-visual`: imagen principal y ficha de temporada.
- `.intro-section`: bloque de identidad sobre fondo verde.
- `.values-section`: tres principios de marca.
- `.featured-section`: selección de platos.
- `.about-section`: presentación de Donde Ray.
- `.contact-section`: llamada final a reservar.

La fotografía del hero y de los platos usa un tratamiento de saturación reducida para integrarse con la paleta natural.

## 12. Página de carta

`MenuPage` utiliza:

- `.page-shell`: ancho de lectura controlado.
- `.page-intro`: encabezado editorial.
- `.menu-list`: distribución de categorías.
- `.menu-section`: grupo de platos.
- `.menu-item`: nombre, descripción y línea decorativa.
- `.menu-footer-note`: nota informativa y enlace de reserva.

La carta aclara que el contenido es orientativo y puede variar según disponibilidad. No se muestran precios o stock ficticios.

## 13. Cliente y administración

Se añadieron reglas de estilo para los módulos existentes:

### Cliente

- `.dashboard-page`
- `.dashboard-header`
- `.dashboard-nav-links`
- `.dashboard-content`
- `.stats-grid`
- `.stat-card`
- `.panel-card`
- `.empty-state`
- `.status`

### Administración

- `.admin-shell`
- `.admin-header`
- `.page`
- `.page-heading`
- `.panel`
- `.panel-heading`
- `.notice`
- `.table-wrapper`
- `table`, `th` y `td`

El panel administrativo usa verde selva como cabecera, fondos crema para la aplicación y marfil para paneles de trabajo.

## 14. Responsive

El breakpoint principal es `720px`.

En pantallas pequeñas:

- La navbar muestra un botón de menú.
- El hero pasa a una columna.
- Las tarjetas de valores y platos se apilan.
- La carta pasa de dos columnas a una.
- Nosotros se muestra en una columna.
- Contacto y footer reorganizan su contenido.
- Dashboard, paneles y formularios reducen padding.
- Las tablas pueden desplazarse horizontalmente dentro de `.table-wrapper`.

El contenido debe conservar siempre su legibilidad y evitar desbordamiento horizontal.

## 15. Accesibilidad y consistencia

- Los enlaces mantienen textos descriptivos.
- Los botones de menú tienen `aria-expanded` y `aria-label`.
- Los modales utilizan `role="dialog"`, `aria-modal` y título asociado.
- Las alertas utilizan `role="status"`.
- Los inputs reciben etiquetas visibles y asociación accesible.
- Los colores de estado se acompañan con texto, no dependen únicamente del color.
- Se mantienen estados `hover` y `focus` visibles en controles principales.

## 16. Validación realizada

```bash
npm run build
npm run lint
git diff --check -- docsStyles.md src/App.css
```

Resultados:

- Build correcto.
- ESLint correcto.
- Sin errores de formato en los archivos revisados.
- Vite informa únicamente un warning de tamaño de chunks, sin impedir la compilación.

La interfaz fue revisada en:

- Desktop: `1440 x 900`.
- Mobile: `375 x 800`.

En mobile se comprobó la visibilidad del menú, la imagen del hero y la ausencia de overflow horizontal.

## 17. Reglas para futuras pantallas

1. Reutilizar los tokens de `:root`.
2. No introducir nuevos colores sin justificarlo en el sistema visual.
3. Usar terracota para acciones principales y amarillo para acentos o pendientes.
4. Mantener `Newsreader` para títulos y `DM Sans` para interfaz.
5. Mostrar siempre loading, error o empty state cuando corresponda.
6. No representar disponibilidad o acciones que el servicio todavía no soporte.
7. Mantener el layout legible en desktop y mobile.
8. Utilizar las clases existentes antes de crear estilos paralelos.

