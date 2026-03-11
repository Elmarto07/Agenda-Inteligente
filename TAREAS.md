# TAREAS – Agenda Inteligente

Este documento es el **backlog** de tareas futuras del proyecto. Agrupa todo lo que falta para que la aplicación sea 100% funcional, más mejoras de experiencia, calidad, seguridad y documentación.

**Cómo usarlo:** Elige tareas por prioridad o por sección. Cada ítem incluye una **definición** (qué hacer), un **objetivo** (por qué) y **condiciones de cumplimiento** (criterios para darla por terminada).

---

## 1. Funcionalidad esencial (para que la app sea 100% funcional)

Tareas que cierran gaps claros respecto al uso diario de una agenda.

| ID | Tarea | Objetivo | Condiciones de cumplimiento |
|----|--------|----------|-----------------------------|
| F1 | Recordatorios programables | Que el usuario pueda definir "avísame X minutos/horas antes" por evento y recibir notificación. | Tabla `reminders` usada; backend expone creación de recordatorio por evento (o campo en evento); frontend permite elegir "recordar 15 min antes" etc.; notificación mostrada o enviada (push o in-app) a la hora indicada. |
| F2 | Notificaciones push (PWA) | Avisos en el móvil aunque la pestaña esté cerrada. | Service Worker registrado para push; backend (o script) capaz de enviar push (ej. web-push); usuario puede activar "avisos push" y recibir al menos un recordatorio de prueba. |
| F3 | Manejo de errores de red y API | Evitar pantallas rotas o silencio cuando el backend no responde o hay fallo. | Mensaje claro cuando el API no está disponible; reintento o "reintentar" en listados; errores de guardado mostrados en el formulario sin romper la vista. |
| F4 | Validación de datos en backend | Evitar datos inválidos (fechas imposibles, tipos incorrectos). | Validación de `start_at`/`end_at` (fechas válidas, end >= start); longitud/trim de `title`; tipo enum para `type`; respuestas 400 con mensaje claro. |
| F5 | Exportar / importar eventos (respaldo) | Poder guardar una copia y restaurar en otro dispositivo o tras reinstalar. | Endpoint o flujo que exporte eventos (JSON/CSV) y opción en la UI; opción de importar desde archivo sin duplicar masivamente (o con opción de reemplazar). |

### F1. Recordatorios programables

- **Definición:** Permitir al usuario configurar por evento un aviso X minutos u horas antes, y que el sistema muestre o envíe esa notificación a la hora indicada.
- **Objetivo:** Que el usuario pueda definir "avísame 15 minutos antes" (o similar) por evento y recibir el aviso en el momento adecuado.
- **Condiciones de cumplimiento:** La tabla `reminders` se usa en el flujo; el backend expone la creación de recordatorio por evento (o un campo en el evento); el frontend permite elegir "recordar 15 min antes" (y otras opciones); la notificación se muestra o envía (push o in-app) a la hora indicada.

### F2. Notificaciones push (PWA)

- **Definición:** Implementar notificaciones push web para que el usuario reciba avisos en el móvil aunque tenga la pestaña cerrada.
- **Objetivo:** Avisos en el móvil aunque la pestaña esté cerrada.
- **Condiciones de cumplimiento:** Service Worker registrado para push; backend (o script) capaz de enviar push (ej. web-push); el usuario puede activar "avisos push" y recibir al menos un recordatorio de prueba.

### F3. Manejo de errores de red y API

- **Definición:** Mostrar mensajes claros y opciones de reintento cuando el backend no responde o devuelve error, sin dejar pantallas rotas o en silencio.
- **Objetivo:** Evitar pantallas rotas o silencio cuando el backend no responde o hay fallo.
- **Condiciones de cumplimiento:** Mensaje claro cuando el API no está disponible; reintento o botón "reintentar" en listados; errores de guardado mostrados en el formulario sin romper la vista.

### F4. Validación de datos en backend

- **Definición:** Validar en el backend que las fechas sean válidas, que end >= start, que el título tenga longitud razonable y que el tipo sea uno de los permitidos; devolver 400 con mensaje claro si no.
- **Objetivo:** Evitar datos inválidos (fechas imposibles, tipos incorrectos).
- **Condiciones de cumplimiento:** Validación de `start_at`/`end_at` (fechas válidas, end >= start); longitud/trim de `title`; tipo enum para `type`; respuestas 400 con mensaje claro.

### F5. Exportar / importar eventos (respaldo)

- **Definición:** Añadir un flujo para exportar todos los eventos (JSON o CSV) y otro para importar desde archivo, como respaldo o para cambiar de dispositivo.
- **Objetivo:** Poder guardar una copia y restaurar en otro dispositivo o tras reinstalar.
- **Condiciones de cumplimiento:** Endpoint o flujo que exporte eventos (JSON/CSV) y opción en la UI; opción de importar desde archivo sin duplicar masivamente (o con opción de reemplazar).

---

## 2. Mejoras de experiencia de usuario (UX)

| ID | Tarea | Objetivo | Condiciones de cumplimiento |
|----|--------|----------|-----------------------------|
| U1 | Vista mes | Ver el mes completo además de día y semana. | Nueva ruta/vista (ej. `/mes`) con calendario mensual; clic en día lleva a día o abre modal; eventos visibles por día en la celda. |
| U2 | Eventos recurrentes | Repetir evento (diario, semanal, mensual). | Modelo de datos (campo o tabla) para recurrencia; UI para "repetir" al crear/editar; listado y vistas muestran las repeticiones según la regla. |
| U3 | Búsqueda y filtros | Encontrar eventos por texto o tipo. | Campo de búsqueda (título/descripción) y/o filtro por tipo; resultados en una vista o integrados en Día/Semana. |
| U4 | Tema claro/oscuro | Comodidad visual según preferencia o hora. | Variable CSS o tema (claro/oscuro); toggle en ajustes o detección de preferencia del sistema; persistencia de la elección. |
| U5 | Ajustes / preferencias | Un lugar para opciones (recordatorio por defecto, zona horaria, idioma). | Página o modal de "Ajustes"; al menos una opción guardada (ej. recordatorio por defecto o tema); persistencia en backend o `localStorage`. |
| U6 | Feedback visual en acciones | Confirmar que las acciones se hicieron. | Toast o mensaje breve tras crear/editar/eliminar evento; estado de carga visible en botones "Resumir día" / "Sugerir orden" cuando la IA tarda. |
| U7 | CSS responsive (web y móvil) | Usar la agenda cómodamente en escritorio, tablet y móvil. | Diseño adaptable con media queries o enfoque mobile-first; vistas Día/Semana y formularios usables en pantallas pequeñas; sin scroll horizontal indeseado; toques y botones con tamaño táctil adecuado en móvil. |

### U1. Vista mes

- **Definición:** Añadir una vista de calendario mensual además de las vistas Día y Semana.
- **Objetivo:** Ver el mes completo además de día y semana.
- **Condiciones de cumplimiento:** Nueva ruta/vista (ej. `/mes`) con calendario mensual; clic en día lleva a la vista día o abre modal; eventos visibles por día en la celda.

### U2. Eventos recurrentes

- **Definición:** Permitir definir que un evento se repita (diario, semanal, mensual) y que las vistas muestren esas repeticiones.
- **Objetivo:** Repetir evento (diario, semanal, mensual).
- **Condiciones de cumplimiento:** Modelo de datos (campo o tabla) para recurrencia; UI para "repetir" al crear/editar; listado y vistas muestran las repeticiones según la regla.

### U3. Búsqueda y filtros

- **Definición:** Añadir búsqueda por texto (título/descripción) y filtro por tipo de evento.
- **Objetivo:** Encontrar eventos por texto o tipo.
- **Condiciones de cumplimiento:** Campo de búsqueda (título/descripción) y/o filtro por tipo; resultados en una vista o integrados en Día/Semana.

### U4. Tema claro/oscuro

- **Definición:** Ofrecer tema claro y oscuro, con toggle o detección de la preferencia del sistema, y guardar la elección.
- **Objetivo:** Comodidad visual según preferencia o hora.
- **Condiciones de cumplimiento:** Variable CSS o tema (claro/oscuro); toggle en ajustes o detección de preferencia del sistema; persistencia de la elección.

### U5. Ajustes / preferencias

- **Definición:** Crear una página o modal de Ajustes donde el usuario pueda guardar opciones (recordatorio por defecto, tema, zona horaria, idioma, etc.).
- **Objetivo:** Un lugar para opciones (recordatorio por defecto, zona horaria, idioma).
- **Condiciones de cumplimiento:** Página o modal de "Ajustes"; al menos una opción guardada (ej. recordatorio por defecto o tema); persistencia en backend o `localStorage`.

### U6. Feedback visual en acciones

- **Definición:** Mostrar un toast o mensaje breve tras crear/editar/eliminar evento, y estado de carga en los botones de IA.
- **Objetivo:** Confirmar que las acciones se hicieron.
- **Condiciones de cumplimiento:** Toast o mensaje breve tras crear/editar/eliminar evento; estado de carga visible en botones "Resumir día" / "Sugerir orden" cuando la IA tarda.

### U7. CSS responsive (web y móvil)

- **Definición:** Ajustar el CSS para que la interfaz se vea y use bien en escritorio, tablet y móvil (media queries, tamaños flexibles, touch targets).
- **Objetivo:** Usar la agenda cómodamente en cualquier dispositivo.
- **Condiciones de cumplimiento:** Diseño adaptable con media queries o enfoque mobile-first; vistas Día/Semana y formularios usables en pantallas pequeñas; sin scroll horizontal indeseado; toques y botones con tamaño táctil adecuado en móvil.

---

## 3. Robustez y calidad

| ID | Tarea | Objetivo | Condiciones de cumplimiento |
|----|--------|----------|-----------------------------|
| R1 | Tests unitarios (backend) | Evitar regresiones en la API. | Tests (Vitest, Jest u otro) para rutas de eventos (CRUD) y, si aplica, ollama/reminders; al menos listar, crear y eliminar cubiertos. |
| R2 | Tests frontend (componentes críticos) | Asegurar que formulario y listados se comportan bien. | Tests para EventForm (envío con datos válidos, validación básica) y para EventList o vista Día; ejecutables con `bun run test` o `npm test`. |
| R3 | Error Boundary en React | Evitar pantalla en blanco si un componente falla. | Componente Error Boundary que capture errores y muestre mensaje y opción de recargar; envuelve las rutas principales. |
| R4 | Manejo de desconexión (offline) | Comportamiento claro sin red. | Detección de offline; mensaje o indicador "Sin conexión"; opcional: cola de acciones para sincronizar al volver. |
| R5 | Validación en frontend | Menos envíos inválidos y mejor UX. | Validación en EventForm (fecha/hora, end > start, título no vacío); mensajes junto a los campos; el formulario no envía si hay errores. |

### R1. Tests unitarios (backend)

- **Definición:** Añadir tests automáticos para las rutas del API (eventos CRUD y, si aplica, ollama y reminders).
- **Objetivo:** Evitar regresiones en la API.
- **Condiciones de cumplimiento:** Tests con Vitest, Jest o el runner elegido para rutas de eventos (CRUD) y, si aplica, ollama/reminders; al menos listar, crear y eliminar cubiertos.

### R2. Tests frontend (componentes críticos)

- **Definición:** Añadir tests para el formulario de eventos y para el listado o la vista Día.
- **Objetivo:** Asegurar que formulario y listados se comportan bien.
- **Condiciones de cumplimiento:** Tests para EventForm (envío con datos válidos, validación básica) y para EventList o vista Día; ejecutables con `bun run test` o `npm test`.

### R3. Error Boundary en React

- **Definición:** Implementar un Error Boundary que capture errores en el árbol de componentes y muestre un mensaje y opción de recargar.
- **Objetivo:** Evitar pantalla en blanco si un componente falla.
- **Condiciones de cumplimiento:** Componente Error Boundary que capture errores en la tree y muestre mensaje y opción de recargar; envuelve las rutas principales.

### R4. Manejo de desconexión (offline)

- **Definición:** Detectar cuando no hay red y mostrar un mensaje o indicador "Sin conexión"; opcionalmente cola de acciones para sincronizar al volver.
- **Objetivo:** Comportamiento claro sin red.
- **Condiciones de cumplimiento:** Detección de offline (navigator.onLine o similar); mensaje o indicador "Sin conexión"; opcional: cola de acciones para sincronizar al volver (o solo mensaje).

### R5. Validación en frontend

- **Definición:** Validar en EventForm fechas/horas, que end > start y que el título no esté vacío; mostrar mensajes junto a los campos y no enviar si hay errores.
- **Objetivo:** Menos envíos inválidos y mejor UX.
- **Condiciones de cumplimiento:** Validación en EventForm (fecha/hora, end > start, título no vacío); mensajes junto a los campos; el formulario no envía si hay errores.

---

## 4. Seguridad y escalabilidad (si la app deja de ser solo personal)

| ID | Tarea | Objetivo | Condiciones de cumplimiento |
|----|--------|----------|-----------------------------|
| S1 | Autenticación (login) | Que cada usuario vea solo sus eventos si hay varios usuarios. | Modelo usuario (o auth externo); login/logout; rutas API que exijan usuario y filtren eventos por usuario; frontend envía credencial o token. |
| S2 | Protección de rutas API | Evitar acceso no autorizado al API desplegado. | Middleware en backend que verifique sesión o token en rutas sensibles; respuestas 401 cuando no autorizado. |
| S3 | Rate limiting | Reducir abuso o sobrecarga del servidor. | Límite de peticiones por IP o por usuario en el backend; respuesta 429 cuando se supere; opcional: cabecera con límite restante. |

### S1. Autenticación (login)

- **Definición:** Añadir login/logout y asociar eventos a un usuario para que cada uno vea solo los suyos.
- **Objetivo:** Que cada usuario vea solo sus eventos si hay varios usuarios.
- **Condiciones de cumplimiento:** Modelo usuario (o uso de auth externo); login/logout; rutas API que exijan usuario y filtren eventos por usuario; frontend envía credencial o token.

### S2. Protección de rutas API

- **Definición:** Proteger las rutas del API con middleware que compruebe sesión o token y devuelva 401 si no hay autorización.
- **Objetivo:** Evitar acceso no autorizado al API desplegado.
- **Condiciones de cumplimiento:** En backend, middleware que verifique sesión o token en rutas sensibles; respuestas 401 cuando no autorizado.

### S3. Rate limiting

- **Definición:** Limitar el número de peticiones por IP o por usuario en el backend y devolver 429 cuando se supere el límite.
- **Objetivo:** Reducir abuso o sobrecarga del servidor.
- **Condiciones de cumplimiento:** Límite de peticiones por IP o por usuario en el backend; respuesta 429 cuando se supere; opcional: cabecera con límite restante.

---

## 5. IA y recordatorios inteligentes

| ID | Tarea | Objetivo | Condiciones de cumplimiento |
|----|--------|----------|-----------------------------|
| A1 | Resumen matinal (automatizado) | Recibir cada mañana un resumen del día sin abrir la app. | Proceso (cron/job) que genere el resumen (con Qwen) y lo envíe por email o push; configurable (activar/desactivar, hora). |
| A2 | Detección de conflictos | Avisar si dos eventos se solapan. | Al crear/editar evento, comprobar solapamiento con otros del mismo día; aviso en frontend o en API; opcional: sugerencia de horario libre. |
| A3 | Fallback cuando Ollama no está | Que la app no dependa al 100% de que Ollama esté encendido. | Endpoints de IA devuelven mensaje amigable o deshabilitan botones cuando Ollama no responde; health check usado en frontend para mostrar estado "IA disponible" o no. |

### A1. Resumen matinal (automatizado)

- **Definición:** Un proceso (cron o job) que cada mañana genere el resumen del día con Qwen y lo envíe por email o push, con opción de activar/desactivar y elegir hora.
- **Objetivo:** Recibir cada mañana un resumen del día sin abrir la app.
- **Condiciones de cumplimiento:** Proceso (cron/job) que genere el resumen (con Qwen) y lo envíe por email o push; configurable (activar/desactivar, hora).

### A2. Detección de conflictos

- **Definición:** Al crear o editar un evento, comprobar si se solapa con otro del mismo día y avisar al usuario; opcionalmente sugerir horario libre.
- **Objetivo:** Avisar si dos eventos se solapan.
- **Condiciones de cumplimiento:** Al crear/editar evento, comprobar solapamiento con otros del mismo día; aviso en frontend o en API; opcional: sugerencia de horario libre.

### A3. Fallback cuando Ollama no está

- **Definición:** Cuando Ollama no responde, los endpoints de IA deben devolver un mensaje amigable y el frontend debe mostrar el estado "IA no disponible" o deshabilitar los botones de IA.
- **Objetivo:** Que la app no dependa al 100% de que Ollama esté encendido.
- **Condiciones de cumplimiento:** Endpoints de IA devuelven mensaje amigable o deshabilitan botones cuando Ollama no responde; health check usado en frontend para mostrar estado "IA disponible" o no.

---

## 6. Documentación y despliegue

| ID | Tarea | Objetivo | Condiciones de cumplimiento |
|----|--------|----------|-----------------------------|
| D1 | Documentar variables de entorno | Que cualquiera pueda desplegar sin adivinar. | README o .env.example con todas las variables (backend y frontend), incluyendo Turso, Ollama, VITE_API_URL; descripción breve de cada una. |
| D2 | Changelog o historial de versiones | Seguimiento de cambios entre versiones. | Archivo CHANGELOG.md (o sección en README) con versiones y cambios relevantes; al menos una entrada de ejemplo. |

### D1. Documentar variables de entorno

- **Definición:** Dejar documentadas en README y/o .env.example todas las variables de entorno del backend y del frontend (Turso, Ollama, VITE_API_URL, etc.) con una descripción breve.
- **Objetivo:** Que cualquiera pueda desplegar sin adivinar.
- **Condiciones de cumplimiento:** README o .env.example con todas las variables (backend y frontend), incluyendo Turso, Ollama, VITE_API_URL; descripción breve de cada una.

### D2. Changelog o historial de versiones

- **Definición:** Mantener un CHANGELOG.md (o sección en README) con versiones y cambios relevantes.
- **Objetivo:** Seguimiento de cambios entre versiones.
- **Condiciones de cumplimiento:** Archivo CHANGELOG.md (o sección en README) con versiones y cambios relevantes; al menos una entrada de ejemplo.

---

**Resumen:** 25 tareas en 6 categorías (Funcionalidad esencial, UX, Robustez, Seguridad, IA, Documentación).
