# Módulo de Sebas — Autenticación y acceso del cliente

## 1. Responsable

**Responsable:** Sebas  
**Módulo:** Autenticación, sesión, control de acceso y dashboard inicial del cliente.  
**Rama de trabajo:** `sebas`  
**Proyecto:** Donde Ray — Restaurante y sistema de reservas.

## 2. Objetivo

Implementar el acceso básico de usuarios al sistema. El módulo permite iniciar sesión, registrarse, cerrar sesión, conservar la sesión al recargar la página y separar el acceso de clientes y administradores según el campo `role` del usuario.

> La responsabilidad de Sebas es controlar quién puede entrar y qué área puede ver. La creación y gestión de reservas pertenece al módulo de Daniel; el panel administrativo pertenece al módulo de Raymond; los estilos públicos pertenecen al módulo de Hellen.

## 3. Funcionalidades realizadas

| Funcionalidad | Descripción | Estado |
|---|---|---|
| Login | Consulta usuarios contra JSON Server y valida correo y contraseña. | Completado |
| Registro | Crea un usuario nuevo y abre una sesión de cliente. | Completado |
| Persistencia de sesión | Guarda la sesión en `localStorage` usando `donde-ray-session`. | Completado |
| Restauración de sesión | Al recargar, recupera el usuario y conserva el área correspondiente. | Completado |
| Logout | Elimina la sesión local y devuelve al acceso público. | Completado |
| Protección de cliente | Impide entrar a dashboards sin autenticación. | Completado |
| Protección de admin | Solo permite acceso cuando `user.role === 'admin'`. | Completado |
| Dashboard cliente | Muestra resumen de reservas y accesos a las funciones del cliente. | Completado |
| Redirección por rol | Cliente y administrador son enviados a sus áreas correspondientes. | Completado |

## 4. Archivos implementados

| Ruta | Responsabilidad |
|---|---|
| `src/features/auth/auth-service.js` | Login y registro contra JSON Server. |
| `src/features/auth/use-auth.js` | Hook para consumir la sesión desde los componentes. |
| `src/features/auth/components/login-form.jsx` | Formulario controlado de inicio de sesión. |
| `src/features/auth/components/register-form.jsx` | Formulario controlado de registro. |
| `src/pages/public/login-page.jsx` | Página pública de acceso. |
| `src/pages/public/register-page.jsx` | Página pública de registro. |
| `src/pages/client/dashboard-page.jsx` | Dashboard inicial del cliente. |
| `src/shared/context/auth-context.js` | Declara y exporta `AuthContext`. |
| `src/shared/context/auth-context.jsx` | Implementa `AuthProvider`, login, registro, logout y restauración de sesión. |
| `src/shared/routing/private-route.jsx` | Protege las rutas de usuarios autenticados. |
| `src/shared/routing/admin-route.jsx` | Protege las rutas exclusivas de administradores. |
| `src/shared/routing/app-router.jsx` | Conecta las rutas públicas, cliente y administración. |
| `src/App.jsx` | Envuelve la aplicación con `BrowserRouter` y `AuthProvider`. |
| `db.json` | Contiene los usuarios demo necesarios para probar el acceso. |

## 5. Relación entre los dos archivos del contexto

Los archivos siguientes **no son dos contextos diferentes**:

```text
src/shared/context/auth-context.js
src/shared/context/auth-context.jsx
```

El archivo `.js` contiene únicamente la instancia compartida:

```js
import { createContext } from 'react'

export const AuthContext = createContext(null)
```

El archivo `.jsx` contiene el proveedor que utiliza esa instancia:

```jsx
<AuthContext.Provider value={value}>
  {children}
</AuthContext.Provider>
```

Esta separación permite que `use-auth.js` consuma el contexto y que `auth-context.jsx` se encargue de la lógica de sesión sin duplicar responsabilidades.

## 6. Usuarios demo

El `db.json` incluye estas cuentas para pruebas locales:

| Tipo | Correo | Contraseña | Rol |
|---|---|---|---|
| Cliente | `user@demo.com` | `1234` | `user` |
| Administrador | `admin@demo.com` | `1234` | `admin` |

Estas credenciales son únicamente para desarrollo académico local. No deben utilizarse como credenciales reales en producción.

## 7. Flujo del cliente

El cliente entra en `/login`, proporciona sus credenciales y, si son correctas, se guarda una sesión con la clave `donde-ray-session`. Después es redirigido a `/dashboard`.

Desde el dashboard puede entrar a:

```text
/dashboard
/reservar
/mis-reservas
```

Las rutas `/reservar` y `/mis-reservas` son consumidas por el módulo de Daniel, pero su acceso depende de la protección implementada por Sebas.

## 8. Flujo del administrador

El administrador usa el mismo formulario de login, pero su usuario tiene `role: "admin"`. Después de autenticarse puede entrar a:

```text
/admin
/admin/reservas
/admin/clientes
```

La ruta administrativa debe validar el rol desde la sesión. No debe depender del nombre de una persona ni de una ruta fija para Raymon.

## 9. Validación realizada

La implementación fue validada con:

```powershell
npm install
npm run build
npm run lint
```

El resultado esperado es:

```text
build: correcto
lint: correcto
```

También se probó el acceso del cliente con `user@demo.com / 1234`, la redirección a `/dashboard`, el bloqueo de `/admin` para usuarios normales y el acceso del administrador con `admin@demo.com / 1234`.

## 10. Commit y push de la rama de Sebas

Ejecutar estos comandos desde la carpeta del proyecto cuando los cambios estén en la rama `sebas`:

```powershell
git checkout sebas
```

```powershell
git status
```

Si el estado es correcto, agregar los archivos:

```powershell
git add db.json package-lock.json src/App.jsx src/features/auth src/pages/client/dashboard-page.jsx src/pages/public/login-page.jsx src/pages/public/register-page.jsx src/shared/context src/shared/routing
```

Crear el commit:

```powershell
git commit -m "feat: implement authentication and client access flow"
```

Subir la rama:

```powershell
git push -u origin sebas
```

Si Git indica que no hay cambios para commit, significa que el commit ya fue creado. En ese caso basta con:

```powershell
git push origin sebas
```

## 11. Regla de integración

La rama `sebas` debe integrarse antes que las ramas de Daniel, Raymond y Hellen porque define la sesión y las rutas protegidas. Durante el merge no se debe reemplazar completo `App.jsx` ni `app-router.jsx` sin combinar las rutas de todos los módulos.

El orden recomendado es:

```text
sebas → dani → ray → hellen → validación final → main
```

## 12. Entrega

La entrega de Sebas se considera lista cuando:

1. Los archivos de autenticación existen en las rutas indicadas.
2. El login de cliente funciona contra JSON Server.
3. El login de administrador funciona por rol.
4. Las rutas privadas redirigen correctamente.
5. `npm run build` termina sin errores.
6. `npm run lint` termina sin errores.
7. La rama `sebas` está subida al remoto.
