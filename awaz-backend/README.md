# Awaz (آواز) — Real-Time Voice Translation Backend

Production-ready **Node.js / Express** backend for the **Awaz** voice translation web app.

---

## Features

- ✅ `POST /translate` — translates text via a pluggable engine
- ✅ `GET /health` — liveness probe for uptime monitors
- ✅ `GET /languages` — returns supported language list
- ✅ **WebSocket** at `ws://<host>/ws` — ready for real-time streaming
- ✅ **4 translation engines** — LibreTranslate, Google, DeepL, OpenAI
- ✅ CORS, Helmet security headers, per-route rate limiting
- ✅ Structured latency logging, global error handling
- ✅ Graceful shutdown on SIGTERM/SIGINT

---

## Project Structure

```
awaz-backend/
├── package.json
├── .env.example              ← copy to .env and fill in values
└── server/
    ├── server.js             ← main entry point
    ├── config/
    │   └── config.js         ← all env vars centralised here
    ├── routes/
    │   ├── translate.js      ← POST /translate
    │   ├── languages.js      ← GET  /languages
    │   └── health.js         ← GET  /health
    ├── services/
    │   ├── translator.js     ← engine router
    │   ├── wsHandler.js      ← WebSocket handler
    │   └── engines/
    │       ├── libreTranslate.js
    │       ├── google.js
    │       ├── deepl.js
    │       └── openai.js
    ├── middleware/
    │   ├── security.js       ← CORS + Helmet + rate-limit
    │   ├── requestLogger.js  ← latency logging
    │   └── errorHandler.js   ← global error → JSON
    └── utils/
        └── logger.js         ← coloured console logger
```

---

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure

```bash
cp .env.example .env
# Edit .env — set TRANSLATE_ENGINE and add the matching API key
```

### 3. Run

```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

---

## Translation Engines

Set `TRANSLATE_ENGINE` in `.env` to one of the values below.

| Engine | Key required | Free tier | Quality | Latency |
|---|---|---|---|---|
| `libretranslate` | Optional | ✅ Yes | Good | ~300ms |
| `google` | ✅ Yes | 500k chars/mo | Excellent | ~150ms |
| `deepl` | ✅ Yes | 500k chars/mo | Best | ~200ms |
| `openai` | ✅ Yes | Pay-per-use | Best + flexible | ~400ms |

**Recommended for getting started:** `libretranslate` (no key needed on the public instance).

---

## API Reference

### `POST /translate`

**Request:**
```json
{ "text": "Hello, how are you?", "sourceLang": "en", "targetLang": "es" }
```

**Success (200):**
```json
{ "translatedText": "Hola, ¿cómo estás?" }
```

**Error (400):**
```json
{ "error": "MISSING_FIELDS", "message": "Request body must include: text, sourceLang, targetLang." }
```

### `GET /health`

```json
{ "status": "ok", "engine": "libretranslate", "uptime": 42.3, "timestamp": "…" }
```

### `GET /languages`

```json
{ "languages": [{ "code": "en", "name": "English", "flag": "🇬🇧" }, …] }
```

### `WS ws://<host>/ws`

Send:
```json
{ "type": "translate", "id": "abc123", "text": "Hello", "sourceLang": "en", "targetLang": "fr" }
```

Receive:
```json
{ "type": "translation", "id": "abc123", "translatedText": "Bonjour", "latencyMs": 210 }
```

---

## Deployment

### Render (recommended — free tier available)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → New Web Service.
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`
5. Add environment variables from `.env.example` in the Render dashboard.
6. Deploy. Your URL will be `https://awaz-backend-xxxx.onrender.com`.

### Railway

```bash
railway init
railway up
railway variables set PORT=3000 TRANSLATE_ENGINE=libretranslate ...
```

### VPS / DigitalOcean / EC2

```bash
# On the server:
git clone <repo> awaz-backend && cd awaz-backend
npm install --omit=dev
cp .env.example .env && nano .env   # fill in keys

# Run with PM2 (auto-restart on crash)
npm install -g pm2
pm2 start server/server.js --name awaz
pm2 save && pm2 startup
```

### Docker

```bash
docker build -t awaz-backend .
docker run -p 3000:3000 --env-file .env awaz-backend
```

---

## Frontend Integration

In your `index.html`, update `BACKEND_URL`:

```js
const BACKEND_URL = 'https://your-deployed-backend.onrender.com/translate';
```

---

## Future Upgrades (pre-wired)

- **Streaming translation** — replace the batch call in `wsHandler.js` with an OpenAI stream
- **Speech-to-text pipeline** — add `type: 'stt_audio'` handler in `wsHandler.js` to pipe PCM to Whisper/Deepgram
- **Multilingual AI models** — swap in `engines/seamlessm4t.js` (Meta SeamlessM4T) as another engine option
- **Redis session store** — plug into the rate limiter for distributed deployments
