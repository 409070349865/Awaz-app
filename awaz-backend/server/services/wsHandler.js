/**
 * wsHandler.js — WebSocket connection handler
 * ═══════════════════════════════════════════
 *
 * Currently handles:
 *   • Connection lifecycle (open / close / error / ping-pong heartbeat)
 *   • JSON message routing (type: 'translate' → translate and stream back)
 *
 * Future streaming upgrade path:
 *   • Replace the batch translate call with a streaming OpenAI call
 *     that forwards each chunk as a WS message of type 'chunk'.
 *   • Add type: 'stt_audio' to pipe raw PCM from the browser to a
 *     Whisper / Deepgram pipeline and stream back live transcription.
 *
 * Message protocol (client → server):
 *   { type: 'translate', id: '<uuid>', text: '…', sourceLang: 'en', targetLang: 'es' }
 *   { type: 'ping' }
 *
 * Message protocol (server → client):
 *   { type: 'translation', id: '<uuid>', translatedText: '…', latencyMs: 120 }
 *   { type: 'chunk',       id: '<uuid>', chunk: '…' }          ← future streaming
 *   { type: 'error',       id: '<uuid>', code: '…', message: '…' }
 *   { type: 'pong' }
 */

'use strict';

const { translateText } = require('./translator');
const { logger }        = require('../utils/logger');

// Keep-alive ping interval in ms
const PING_INTERVAL = 30_000;

/**
 * Handle a new WebSocket connection.
 * @param {import('ws').WebSocket} ws
 * @param {import('http').IncomingMessage} req
 */
function handleWsConnection(ws, req) {
  const clientIp = req.socket?.remoteAddress ?? 'unknown';
  logger.info(`[WS] Client connected: ${clientIp}`);

  // ── Heartbeat ────────────────────────────────────────────
  let isAlive = true;
  ws.on('pong', () => { isAlive = true; });

  const pingTimer = setInterval(() => {
    if (!isAlive) {
      logger.warn(`[WS] Client ${clientIp} did not respond to ping — terminating.`);
      return ws.terminate();
    }
    isAlive = false;
    ws.ping();
  }, PING_INTERVAL);

  // ── Message handler ──────────────────────────────────────
  ws.on('message', async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return send(ws, { type: 'error', code: 'INVALID_JSON', message: 'Message must be valid JSON.' });
    }

    switch (msg.type) {
      case 'ping':
        return send(ws, { type: 'pong' });

      case 'translate':
        await handleTranslate(ws, msg);
        break;

      // ── Future: stream audio chunks through STT pipeline ─
      // case 'stt_audio':
      //   await handleSttAudio(ws, msg);
      //   break;

      default:
        send(ws, { type: 'error', code: 'UNKNOWN_TYPE', message: `Unknown message type: ${msg.type}` });
    }
  });

  // ── Cleanup ──────────────────────────────────────────────
  ws.on('close', (code, reason) => {
    clearInterval(pingTimer);
    logger.info(`[WS] Client ${clientIp} disconnected (${code} ${reason})`);
  });

  ws.on('error', (err) => {
    logger.error(`[WS] Client ${clientIp} error: ${err.message}`);
  });

  // Send a welcome message so the client knows the WS is live
  send(ws, { type: 'connected', message: 'Awaz WS ready.' });
}

/**
 * Handle a 'translate' WS message.
 * @param {import('ws').WebSocket} ws
 * @param {{ id?: string, text: string, sourceLang: string, targetLang: string }} msg
 */
async function handleTranslate(ws, msg) {
  const { id = null, text, sourceLang, targetLang } = msg;

  if (!text || !sourceLang || !targetLang) {
    return send(ws, {
      type: 'error', id,
      code: 'MISSING_FIELDS',
      message: 'text, sourceLang, and targetLang are required.',
    });
  }

  const t0 = Date.now();
  try {
    const translatedText = await translateText(text, sourceLang, targetLang);
    send(ws, { type: 'translation', id, translatedText, latencyMs: Date.now() - t0 });
  } catch (err) {
    send(ws, { type: 'error', id, code: err.code || 'TRANSLATION_FAILED', message: err.message });
  }
}

/**
 * Safe JSON send — no-op if socket is not open.
 * @param {import('ws').WebSocket} ws
 * @param {object} data
 */
function send(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

module.exports = { handleWsConnection };
