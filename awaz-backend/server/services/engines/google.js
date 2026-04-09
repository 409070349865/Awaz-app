/**
 * engines/google.js
 * ─────────────────
 * Adapter for Google Cloud Translation API v2 (Basic).
 *
 * Docs: https://cloud.google.com/translate/docs/basic/translate-text-basic
 *
 * Setup:
 *   1. Enable Cloud Translation API in your GCP project.
 *   2. Create an API key (or service account for server-side auth).
 *   3. Set GOOGLE_TRANSLATE_API_KEY in your .env
 *
 * Cost: $20 per 1 million characters (~$0.000020 per char)
 *       First 500k chars/month are FREE.
 */

'use strict';

const config     = require('../../config/config');
const { logger } = require('../../utils/logger');

const API_KEY = config.google.apiKey;
const BASE_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * @param {string} text
 * @param {string} source
 * @param {string} target
 * @returns {Promise<string>}
 */
async function translate(text, source, target) {
  if (!API_KEY) {
    const err  = new Error('GOOGLE_TRANSLATE_API_KEY is not set.');
    err.code   = 'ENGINE_UNAVAILABLE';
    err.status = 503;
    throw err;
  }

  const url  = `${BASE_URL}?key=${API_KEY}`;

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text' }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error(`[Google] HTTP ${res.status}: ${body}`);
      const err  = new Error(`Google Translate returned HTTP ${res.status}`);
      err.code   = 'TRANSLATION_FAILED';
      err.status = 502;
      throw err;
    }

    const data = await res.json();
    const translated = data?.data?.translations?.[0]?.translatedText;

    if (!translated) {
      const err  = new Error('Google Translate returned empty translation.');
      err.code   = 'TRANSLATION_FAILED';
      throw err;
    }

    // Google HTML-encodes some characters — decode them
    return decodeHtmlEntities(translated);

  } catch (err) {
    if (err.name === 'AbortError') {
      const t  = new Error('Google Translate request timed out.');
      t.code   = 'TRANSLATION_TIMEOUT';
      t.status = 504;
      throw t;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/** Decode HTML entities returned by Google Translate v2. */
function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'");
}

module.exports = { translate };
