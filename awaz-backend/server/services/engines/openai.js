/**
 * engines/openai.js
 * ─────────────────
 * Adapter for OpenAI's chat models used as a translation engine.
 *
 * Uses GPT-4o-mini by default (fast, cheap, excellent translations).
 * Handles all languages including low-resource ones better than
 * traditional MT engines.
 *
 * Setup:
 *   Set OPENAI_API_KEY in .env.
 *   Optionally set OPENAI_MODEL (default: gpt-4o-mini).
 *
 * Cost (gpt-4o-mini):  $0.15 / 1M input tokens, $0.60 / 1M output tokens
 *   ≈ very cheap for short voice utterances.
 */

'use strict';

const config     = require('../../config/config');
const { logger } = require('../../utils/logger');

const API_KEY = config.openai.apiKey;
const MODEL   = config.openai.model;

/**
 * @param {string} text
 * @param {string} source  - language name or BCP-47 code
 * @param {string} target  - language name or BCP-47 code
 * @returns {Promise<string>}
 */
async function translate(text, source, target) {
  if (!API_KEY) {
    const err  = new Error('OPENAI_API_KEY is not set.');
    err.code   = 'ENGINE_UNAVAILABLE';
    err.status = 503;
    throw err;
  }

  const systemPrompt = [
    'You are a professional, precise translator.',
    'Translate the user\'s text exactly — preserve tone, punctuation, and formatting.',
    'Output ONLY the translated text. No explanations, no quotation marks, no preamble.',
  ].join(' ');

  const userPrompt =
    `Translate from ${source} to ${target}:\n${text}`;

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model:       MODEL,
        max_tokens:  512,
        temperature: 0.1,   // low temperature → more deterministic, accurate
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      logger.error(`[OpenAI] HTTP ${res.status}: ${errBody}`);
      const err  = new Error(`OpenAI returned HTTP ${res.status}`);
      err.code   = 'TRANSLATION_FAILED';
      err.status = 502;
      throw err;
    }

    const data       = await res.json();
    const translated = data?.choices?.[0]?.message?.content?.trim();

    if (!translated) {
      const err  = new Error('OpenAI returned empty translation.');
      err.code   = 'TRANSLATION_FAILED';
      throw err;
    }

    logger.debug(`[OpenAI] tokens used: ${data.usage?.total_tokens ?? '?'}`);
    return translated;

  } catch (err) {
    if (err.name === 'AbortError') {
      const t  = new Error('OpenAI request timed out.');
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
