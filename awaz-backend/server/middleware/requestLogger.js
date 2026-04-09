/**
 * requestLogger.js — Per-request latency logging middleware
 *
 * Attaches to the response 'finish' event so the final status
 * code and elapsed time are always captured, even for errors.
 */

'use strict';

const { logger } = require('../utils/logger');

/**
 * Middleware: logs method, path, status, and latency for every request.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const latencyMs = Date.now() - start;
    logger.request(req.method, req.originalUrl, res.statusCode, latencyMs);
  });

  next();
}

module.exports = requestLogger;
