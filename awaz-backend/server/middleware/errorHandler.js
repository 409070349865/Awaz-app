/**
 * errorHandler.js — Centralised Express error handler
 *
 * Must be registered LAST with app.use(errorHandler).
 * Converts thrown errors into consistent JSON responses.
 */

'use strict';

const { logger } = require('../utils/logger');

/**
 * Maps well-known error codes/names to HTTP status codes.
 */
const ERROR_STATUS_MAP = {
  VALIDATION_ERROR:      400,
  MISSING_FIELDS:        400,
  UNSUPPORTED_LANGUAGE:  400,
  RATE_LIMIT_EXCEEDED:   429,
  TRANSLATION_TIMEOUT:   504,
  ENGINE_UNAVAILABLE:    503,
  TRANSLATION_FAILED:    502,
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Determine HTTP status
  const status =
    err.status ||
    ERROR_STATUS_MAP[err.code] ||
    (err.name === 'AbortError'    ? 504 :
     err.name === 'FetchError'    ? 503 :
     err.type === 'request-timeout' ? 504 : 500);

  // Only log 5xx as errors; 4xx as warnings
  if (status >= 500) {
    logger.error(`[ErrorHandler] ${status} — ${err.message}`, err.stack || '');
  } else {
    logger.warn(`[ErrorHandler] ${status} — ${err.message}`);
  }

  // Never expose stack traces in production
  const body = {
    error:   err.code  || 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred.',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}

module.exports = errorHandler;
