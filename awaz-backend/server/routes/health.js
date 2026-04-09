/**
 * routes/health.js — GET /health
 * ════════════════════════════════
 * Lightweight health-check endpoint.
 * Used by load balancers, uptime monitors (e.g. UptimeRobot),
 * and container orchestrators (Docker/Kubernetes liveness probes).
 *
 * Response:
 *   200 { status: 'ok', engine: '…', uptime: 42.3, timestamp: '…' }
 */

'use strict';

const { Router } = require('express');
const config     = require('../config/config');
const START_TIME = Date.now();

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status:    'ok',
    service:   'Awaz Translation API',
    engine:    config.translateEngine,
    env:       config.env,
    uptime:    parseFloat(((Date.now() - START_TIME) / 1000).toFixed(1)),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
