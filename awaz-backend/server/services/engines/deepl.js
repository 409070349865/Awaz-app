/**
 * engines/deepl.js
 * ────────────────
 * Adapter for the DeepL Translation API.
 *
 * Docs:  https://developers.deepl.com/docs
 * Plans: Free tier — 500,000 chars/month at no cost.
 *        Pro tier  — paid, higher limits.
 *
 * Free API URL:  https://api-free.deepl.com
 * Pro  API URL:  https://api.deepl.com
 *
 * Setup: Set DEEPL_API_KEY and (optionally) DEEPL_API_URL in .env
 *
 * Note: DeepL uses uppercase language codes for target (e.g. 'ES', 'FR').
 *       This adapter handles the conversion automatically.
 */

'use strict';

const config     = require('../../config/config');
const { logger } = require('../../utils/logger');

const API_KEY = config.deepl.apiKey;
const BASE_URL = config.deepl.url.replace(/\/$/, '');

/**
 * @param {string} text
 * @param {string} source  - ISO 639-1 lowercase (e.g. 'en')
 * @param {string} target  - ISO 639-1 lowercase (e.g. 'es')
 * @returns {Promise<string>}
 */
async function translate(text, source, target) {
  if (!API_KEY) {
    const err  = new Error('DEEPL_API_KEY is not set.');
    err.code   = 'ENGINE_UNAVAILABLE';
    err.status = 503;
    throw err;
  }

  const url = `${BASE_URL}/v2/translate`;

  // DeepL expects uppercase target language codes
  const body = new URLSearchParams({
    auth_key:    API_KEY,
    text,
    source_lang: source.toUpperCase(),
    target_lang: target.toUpperCase(),
  });

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal:  controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      logger.error(`[DeepL] HTTP ${res.status}: ${errBody}`);
      const err  = new Error(`DeepL returned HTTP ${res.status}`);
      err.code   = 'TRANSLATION_FAILED';
      err.status = 502;
      throw err;
    }

    const data = await res.json();
    const translated = data?.translations?.[0]?.text;

    if (!translated) {
      const err  = new Error('DeepL returned empty translation.');
      err.code   = 'TRANSLATION_FAILED';
      throw err;
    }

    return translated;

  } catch (err) {
    if (err.name === 'AbortError') {
      const t  = new Error('DeepL request timed out.');
      t.code   = 'TRANSLATION_TIMEOUT';
      t.status = 504;
      throw t;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { translate };
