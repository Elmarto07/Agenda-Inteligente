# Agenda Inteligente

Agenda personal web (PWA) con integración de IA (Ollama + Qwen) para organizar citas, quedadas, compromisos y tareas.

## Requisitos

- **Bun** 1.0+ ([bun.sh](https://bun.sh))
- **Ollama** con el modelo Qwen descargado (`ollama run qwen`)

## Instalación

### Backend

```bash
cd backend
bun install
cp .env.example .env   # opcional: ajusta PORT, OLLAMA_HOST, OLLAMA_MODEL
bun start
```

La API quedará en `http://localhost:3001`. Para desarrollo con recarga automática: `bun run dev`.

Si el puerto 3001 está en uso, cambia `PORT` en `backend/.env` o libera el puerto (Windows: `netstat -ano | findstr :3001` para ver el PID, luego `taskkill /PID <número> /F`).

### Frontend

```bash
cd frontend
bun install
bun run dev
```

Abre `http://localhost:5173` en el navegador.

### Variables de entorno

**Backend** (`backend/.env`):

- `PORT`: puerto del API (por defecto 3001)
- `OLLAMA_HOST`: URL de Ollama (por defecto `http://localhost:11434`)
- `OLLAMA_MODEL`: nombre del modelo (por defecto `qwen`)

**Frontend** (`frontend/.env`):

- `VITE_API_URL`: URL del backend (por defecto `http://localhost:3001`). En el móvil, usa la IP de tu PC en la red local, por ejemplo `http://192.168.1.10:3001`.

## Uso

1. **Inicio**: próximos compromisos, resumen del día con IA y organizador de tareas con Qwen.
2. **Día**: vista por día, navegación por fechas, resumir día y recordatorio sugerido con IA.
3. **Semana**: vista por semana con eventos agrupados por día.

En móvil puedes usar “Añadir a pantalla de inicio” para instalar la PWA.

## Acceso desde otras redes (móvil, otra casa, etc.)

Para usar la agenda desde otros dispositivos y otras redes (no solo tu Wi‑Fi), expón tu PC con un **túnel**. Así no necesitas abrir puertos en el router ni tener IP fija.

### Opción recomendada: Cloudflare Tunnel (gratis, URL estable)

1. **Instala Cloudflare Tunnel**  
   - Windows: descarga [cloudflared](https://github.com/cloudflare/cloudflared/releases) o con winget: `winget install Cloudflare.cloudflared`.

2. **Dos túneles (backend + frontend)**  
   En una terminal, con el backend y el frontend ya en marcha:
   ```bash
   # Túnel para el API (puerto 3001)
   cloudflared tunnel --url http://localhost:3001
   ```
   Anota la URL que te da (ej. `https://xxxx-xx-xx-xx-xx.trycloudflare.com`).  
   En **otra** terminal:
   ```bash
   # Túnel para la web (puerto 5173 en dev, o 4173 si usas "bun run build" y "bun run preview")
   cloudflared tunnel --url http://localhost:5173
   ```
   Anota también esta URL (es la que abrirás en el móvil u otro dispositivo).

3. **Decirle al frontend dónde está el API**  
   En `frontend/public/` crea un archivo `config.json` (puedes copiar `config.json.example`):
   ```json
   { "apiUrl": "https://la-url-del-tunel-del-backend.trycloudflare.com" }
   ```
   Sustituye por la **primera** URL (la del puerto 3001). Así el frontend, al cargar desde la segunda URL, sabrá a qué API llamar sin recompilar.

4. **Uso**  
   Abre en el móvil (o en cualquier red) la **segunda** URL (la del frontend). La app cargará y usará el API a través del túnel del backend.

**Nota:** Con la versión gratuita de Cloudflare Tunnel las URLs pueden cambiar cada vez que reinicias `cloudflared`. Si quieres una URL fija, puedes usar un dominio propio con Cloudflare o un plan de pago. Mientras tanto, si la URL del backend cambia, actualiza `frontend/public/config.json` con la nueva y recarga la app.

### Alternativa: ngrok

```bash
ngrok http 3001
```
Te da una URL pública para el backend. Crea `frontend/public/config.json` con esa URL en `apiUrl`. Para el frontend puedes usar otro túnel (p. ej. `ngrok http 5173`) y abrir esa URL en el móvil. En la versión gratuita de ngrok la URL del backend cambia al reiniciar; tendrás que actualizar `config.json` y recargar.

### Resumen

- **Misma red (Wi‑Fi):** Pon en el frontend la IP de tu PC, p. ej. `VITE_API_URL=http://192.168.1.10:3001` (o `config.json` con esa URL).
- **Otra red:** Usa un túnel (Cloudflare o ngrok) para backend y frontend, y `config.json` con la URL pública del backend.

---

## Despliegue en la nube (100 % gratis, sin usar tu PC)

Para tener **una URL fija** que funcione desde cualquier sitio sin tener el ordenador encendido, puedes desplegar todo **sin pagar**:

- **Backend:** [Render](https://render.com) – plan gratuito (el servicio se “duerme” tras ~15 min sin uso; la primera petición tras eso tarda ~1 min en despertar).
- **Base de datos:** [Turso](https://turso.tech) – SQLite en la nube, plan gratuito, **datos persistentes** (no caducan).
- **Frontend:** [Vercel](https://vercel.com) – gratuito para proyectos personales.

No hace falta tarjeta de crédito para ninguno.

### 1. Cuentas y repositorio

- Crea cuenta en [Render](https://render.com) (con GitHub o email).
- Crea cuenta en [Turso](https://turso.tech) (con GitHub o email).
- Crea cuenta en [Vercel](https://vercel.com) (con GitHub).
- Sube el proyecto a **GitHub** si aún no está.

### 2. Base de datos Turso (gratis)

1. Instala el CLI de Turso: [Instalación](https://docs.turso.tech/cli/installation).
2. Inicia sesión: `turso auth login`.
3. Crea una base de datos y anota la URL y el token:
   ```bash
   turso db create agenda-inteligente --region mad
   turso db show agenda-inteligente --url
   turso db tokens create agenda-inteligente
   ```
   Guarda la **URL** (ej. `libsql://agenda-inteligente-xxx.turso.io`) y el **token** (ej. `eyJ...`). Los usarás en Render.

### 3. Backend en Render (gratis)

1. En [Render](https://dashboard.render.com), **New** → **Web Service**.
2. Conecta tu repositorio de GitHub y selecciona el proyecto.
3. Configura el servicio:
   - **Name:** por ejemplo `agenda-inteligente-api`.
   - **Root Directory:** `backend`.
   - **Runtime:** `Node` (Render usa Node; el backend funciona con Node o Bun).
   - **Build Command:** `npm install` o `bun install` (si Render soporta Bun en el build).
   - **Start Command:** `node src/index.js` (o `bun run start` si usas Bun en Render; si no, `node src/index.js` tras `npm install`).
   - **Variables de entorno** (Environment Variables), añade:
     - `TURSO_DATABASE_URL` = la URL de Turso (ej. `libsql://agenda-inteligente-xxx.turso.io`).
     - `TURSO_AUTH_TOKEN` = el token que generaste con `turso db tokens create`.
     - `NODE_ENV` = `production` (opcional).
4. **Create Web Service**. Render desplegará y te dará una URL tipo `https://agenda-inteligente-api.onrender.com`. Esa es la URL del API (sin `/api` al final).

**Nota:** En el plan gratuito, si no hay visitas durante unos 15 minutos, el servicio se apaga. La primera petición después de eso puede tardar ~1 minuto en responder mientras arranca.

### 4. Frontend en Vercel (gratis)

1. En [vercel.com](https://vercel.com), **Add New** → **Project** e importa el mismo repositorio de GitHub.
2. Configura:
   - **Root Directory:** `frontend`.
   - **Framework Preset:** Vite.
   - **Build Command:** `bun run build` o `npm run build`.
   - **Output Directory:** `dist`.
   - **Variable de entorno:** `VITE_API_URL` = la URL del backend en Render (ej. `https://agenda-inteligente-api.onrender.com`).
3. **Deploy**. Obtendrás una URL tipo `https://agenda-inteligente-xxx.vercel.app`.

### 5. Usar la app

Abre en el móvil o en cualquier dispositivo la **URL de Vercel**. Esa es tu agenda; los datos se guardan en Turso y el backend corre en Render.

**IA (Ollama/Qwen):** En Render no se ejecuta Ollama. Las funciones de resumen/recordatorio/sugerencias con IA fallarán a menos que configures un Ollama accesible por internet (por ejemplo en tu casa con un túnel y pongas `OLLAMA_HOST` en las variables de Render). El resto de la agenda (eventos, listados, recordatorios pendientes) funciona igual.

### Resumen de coste

| Servicio | Uso              | Coste   |
|----------|------------------|---------|
| Render   | Backend (plan free, se duerme tras inactividad) | **Gratis** |
| Turso    | Base de datos SQLite en la nube | **Gratis** |
| Vercel   | Frontend estático | **Gratis** |

**Alternativa de pago (si quieres backend siempre encendido):** Puedes usar [Fly.io](https://fly.io) para el backend (con volumen para SQLite local o con Turso) y seguir usando Vercel + Turso; Fly.io da crédito mensual pero requiere tarjeta. Los archivos `backend/Dockerfile` y `backend/fly.toml` siguen en el repo por si los quieres usar.

## API

- `GET/POST /api/events` – listar (query: `date`, `from`, `to`) y crear eventos
- `GET/PUT/DELETE /api/events/:id` – obtener, actualizar y eliminar
- `GET /api/ollama/health` – comprobar Ollama y modelos
- `POST /api/ollama/summarize-day` – body `{ date }` – resumen del día con Qwen
- `POST /api/ollama/suggest-reminder` – body `{ eventId? }` o `{ date? }` – recordatorio sugerido
- `POST /api/ollama/suggest-organization` – body `{ tasks: string[] }` – sugerencia de orden de tareas
- `GET /api/reminders/pending?hours=24` – eventos próximos (para recordatorios)

## Base de datos

SQLite en `backend/agenda.db` (driver nativo de Bun, `bun:sqlite`). Tablas: `events`, `reminders`.
