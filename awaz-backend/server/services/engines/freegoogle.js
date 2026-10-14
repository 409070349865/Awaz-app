'use strict';

const { logger } = require('../../utils/logger');
const config = require('../../config/config');

/**
 * Translate using the free, undocumented Google Translate API.
 * This is perfect for local development and demos without needing an API key.
 *
 * @param {string} text
 * @param {string} source  - ISO 639-1 code (e.g. 'en')
 * @param {string} target  - ISO 639-1 code (e.g. 'es')
 * @returns {Promise<string>}
 */
async function translate(text, source, target) {
  // Convert standard locales (en-US, es-ES) to 2-letter codes that Google Translate prefers,
  // except for Chinese which uses zh-CN.
  const mapLang = (l) => {
    if (l.startsWith('zh')) return l;
    return l.split('-')[0];
  };

  const sl = mapLang(source);
  const tl = mapLang(target);

  // Free Google Translate API endpoint
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), config.requestTimeoutMs || 15000);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error(`[FreeGoogle] HTTP ${res.status}: ${body}`);
      const err  = new Error(`FreeGoogle returned HTTP ${res.status}`);
      err.code   = 'TRANSLATION_FAILED';
      err.status = 502;
      throw err;
    }

    const data = await res.json();
    
    // The response is an array of arrays. The first array contains the translated sentences.
    let translatedText = '';
    if (data && data[0]) {
      data[0].forEach(part => {
        if (part[0]) {
          translatedText += part[0];
        }
      });
    }

    if (!translatedText) {
      const err  = new Error('FreeGoogle returned empty translation.');
      err.code   = 'TRANSLATION_FAILED';
      throw err;
    }

    return translatedText;

  } catch (err) {
    if (err.name === 'AbortError') {
      const timeout  = new Error('FreeGoogle request timed out.');
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
