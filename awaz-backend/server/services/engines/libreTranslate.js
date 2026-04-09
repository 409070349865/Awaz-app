/**
 * engines/libreTranslate.js
 * ─────────────────────────
 * Adapter for LibreTranslate (https://libretranslate.com)
 *
 * LibreTranslate is a free, open-source machine translation API.
 * You can use the public instance or self-host it for zero cost.
 *
 * Self-hosting docs: https://github.com/LibreTranslate/LibreTranslate
 *
 * Environment variables:
 *   LIBRETRANSLATE_URL    — defaults to https://libretranslate.com
 *   LIBRETRANSLATE_APIKEY — optional; required on the public instance
 */

'use strict';

const config     = require('../../config/config');
const { logger } = require('../../utils/logger');

const BASE_URL   = config.libreTranslate.url.replace(/\/$/, '');
const API_KEY    = config.libreTranslate.apiKey;

/**
 * Translate using LibreTranslate REST API.
 *
 * @param {string} text
 * @param {string} source  - ISO 639-1 code (e.g. 'en')
 * @param {string} target  - ISO 639-1 code (e.g. 'es')
 * @returns {Promise<string>}
 */
async function translate(text, source, target) {
  const url      = `${BASE_URL}/translate`;
  const payload  = { q: text, source, target, format: 'text' };
  if (API_KEY) payload.api_key = API_KEY;

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error(`[LibreTranslate] HTTP ${res.status}: ${body}`);
      const err  = new Error(`LibreTranslate returned HTTP ${res.status}`);
      err.code   = 'TRANSLATION_FAILED';
      err.status = 502;
      throw err;
    }

    const data = await res.json();

    if (!data.translatedText) {
      const err  = new Error('LibreTranslate returned empty translation.');
      err.code   = 'TRANSLATION_FAILED';
      throw err;
    }

    return data.translatedText;

  } catch (err) {
    if (err.name === 'AbortError') {
      const timeout  = new Error('LibreTranslate request timed out.');
      timeout.code   = 'TRANSLATION_TIMEOUT';
      timeout.status = 504;
      throw timeout;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { translate };
