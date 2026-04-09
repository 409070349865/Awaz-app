'use strict';

const config = require('../config/config');
const { logger } = require('../utils/logger');

// ── Engine adapters ──────────────────────────────────────────
const engines = {
  libretranslate: require('./engines/libreTranslate'),
  google: require('./engines/google'),
  deepl: require('./engines/deepl'),
  openai: require('./engines/openai'),
};

async function translateText(text, sourceLang, targetLang) {

  const engineName = config.translateEngine;
  const engine = engines[engineName];

  if (!engine) {
    const err = new Error(
      `Unknown translation engine: "${engineName}". Valid: ${Object.keys(engines).join(', ')}`
    );
    err.code = 'ENGINE_UNAVAILABLE';
    throw err;
  }

  logger.info(`[Translator] engine=${engineName} ${sourceLang}→${targetLang} len=${text.length}`);

  const t0 = Date.now();

  const result = await engine.translate(text, sourceLang, targetLang);

  const ms = Date.now() - t0;

  logger.info(`[Translator] done in ${ms}ms`);

  return result;
}

module.exports = { translateText };