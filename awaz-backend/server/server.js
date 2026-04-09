'use strict';

const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');

const config = require('./config/config');
const { logger } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const securityMiddleware = require('./middleware/security');

const translateRouter = require('./routes/translate');
const languagesRouter = require('./routes/languages');
const healthRouter = require('./routes/health');

const { handleWsConnection } = require('./services/wsHandler');

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', handleWsConnection);
wss.on('error', (err) => logger.error('[WSS] Server error:', err.message));

securityMiddleware(app);

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

app.use(requestLogger);

app.use('/health', healthRouter);
app.use('/languages', languagesRouter);
app.use('/translate', translateRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} does not exist.`,
  });
});

app.use(errorHandler);

server.listen(config.port, () => {
  logger.info(`
╔══════════════════════════════════════════════════╗
║   AWAZ (آواز) Backend — Production Server        ║
╠══════════════════════════════════════════════════╣
║  HTTP  → http://localhost:${config.port}          ║
║  WS    → ws://localhost:${config.port}            ║
║  Engine→ ${config.translateEngine}                 ║
║  Env   → ${config.env}                             ║
╚══════════════════════════════════════════════════╝
`);
});

const shutdown = (signal) => {
  logger.info(`[Server] ${signal} received — shutting down gracefully…`);

  server.close(() => {
    logger.info('[Server] HTTP server closed.');

    wss.close(() => {
      logger.info('[Server] WebSocket server closed.');
      process.exit(0);
    });
  });

  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('[Uncaught]', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('[Unhandled]', err);
  process.exit(1);
});

module.exports = { app, server };