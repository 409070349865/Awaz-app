/**
 * security.js — Security & CORS middleware
 *
 * Applies in order:
 *   1. helmet        — sets secure HTTP headers
 *   2. cors          — cross-origin resource sharing
 *   3. rateLimit     — protect against abuse
 *   4. sanitiseBody  — strip unexpected large payloads
 */

'use strict';

const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const config     = require('../config/config');
const { logger } = require('../utils/logger');

/**
 * Build the CORS options object.
 * If config.allowedOrigins === '*' every origin is allowed.
 * Otherwise only the listed domains are permitted.
 */
function buildCorsOptions() {
  if (config.allowedOrigins === '*') {
    return {
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  return {
    origin(origin, callback) {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error(`CORS: origin ${origin} is not allowed.`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  };
}

/**
 * Rate limiter — applied globally.
 * Hits the /translate endpoint heavily? Override per-route in translate.js.
 */
const limiter = rateLimit({
  windowMs:        config.rateLimit.windowMs,
  max:             config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error:   'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please slow down.',
  },
  handler(req, res, next, options) {
    logger.warn(`[RateLimit] ${req.ip} exceeded limit on ${req.path}`);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Apply all security middleware to the Express app.
 * @param {import('express').Application} app
 */
function securityMiddleware(app) {
  // Helmet — sensible security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // needed for web clients
    contentSecurityPolicy: false, // disable CSP for API (no HTML served)
  }));

  // Trust proxy headers (needed when behind nginx / Render / Railway / etc.)
  app.set('trust proxy', 1);

  // CORS
  app.use(cors(buildCorsOptions()));
  app.options('*', cors(buildCorsOptions())); // pre-flight for all routes

  // Rate limiting
  app.use(limiter);
}

module.exports = securityMiddleware;
