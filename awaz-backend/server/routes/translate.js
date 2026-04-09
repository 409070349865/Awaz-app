/**
 * routes/translate.js — POST /translate
 * ═══════════════════════════════════════
 *
 * Request  (JSON body):
 *   { "text": "Hello", "sourceLang": "en", "targetLang": "es" }
 *
 * Response (JSON):
 *   { "translatedText": "Hola" }
 *   or
 *   { "error": "MISSING_FIELDS", "message": "…" }
 *
 * Notes:
 *   • sourceLang accepts full BCP-47 tags (e.g. 'en-US') — the country
 *     suffix is stripped before forwarding to the translation engine.
 *   • Both source and target are normalised to lowercase ISO 639-1.
 */

'use strict';

const { Router }        = require('express');
const rateLimit         = require('express-rate-limit');
const { translateText } = require('../services/translator');
const { logger }        = require('../utils/logger');
const config            = require('../config/config');

const router = Router();

// ── Per-route rate limiter (stricter than the global one) ──
// Allows 30 translations per minute per IP.
const translateLimiter = rateLimit({
  windowMs:        60_000,
  max:             30,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error:   'RATE_LIMIT_EXCEEDED',
    message: 'Too many translation requests. Please wait a moment.',
  },
});

router.use(translateLimiter);

/**
 * POST /translate
 */
router.post('/', async (req, res, next) => {
  const { text, sourceLang, targetLang } = req.body ?? {};

  // ── Validate ──────────────────────────────────────────────
  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({
      error:   'MISSING_FIELDS',
      message: 'Request body must include: text, sourceLang, targetLang.',
    });
  }

  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      error:   'VALIDATION_ERROR',
      message: '"text" must be a non-empty string.',
    });
  }

  if (text.length > 5_000) {
    return res.status(400).json({
      error:   'VALIDATION_ERROR',
      message: '"text" must be 5,000 characters or fewer.',
    });
  }

  // ── Normalise language codes ──────────────────────────────
  // 'en-US' → 'en',  'ZH-CN' → 'zh'
  const src = sourceLang.split('-')[0].toLowerCase();
  const tgt = targetLang.split('-')[0].toLowerCase();

  // Skip translation when source and target are the same language
  if (src === tgt) {
    return res.json({ translatedText: text.trim() });
  }

  // ── Translate ─────────────────────────────────────────────
  try {
    const translatedText = await translateText(text.trim(), src, tgt);
    return res.json({ translatedText });
  } catch (err) {
    // Forward to the global error handler
    next(err);
  }
});

module.exports = router;
