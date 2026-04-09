/**
 * logger.js — Structured console logger
 *
 * Uses a simple, zero-dependency approach so the project stays
 * lean.  For production you can swap this out for winston or pino
 * by replacing the methods below — the rest of the codebase only
 * imports { logger } and calls logger.info / warn / error / debug.
 */

'use strict';

const config = require('../config/config');

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LEVELS[config.logLevel] ?? LEVELS.info;

const colors = {
  reset:  '\x1b[0m',
  cyan:   '\x1b[36m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
  green:  '\x1b[32m',
};

function timestamp() {
  return new Date().toISOString();
}

function format(level, colorCode, ...args) {
  const ts  = `${colors.gray}${timestamp()}${colors.reset}`;
  const lvl = `${colorCode}[${level.toUpperCase()}]${colors.reset}`;
  return `${ts} ${lvl} ${args.join(' ')}`;
}

const logger = {
  debug(...args) {
    if (currentLevel <= LEVELS.debug)
      console.debug(format('debug', colors.gray, ...args));
  },
  info(...args) {
    if (currentLevel <= LEVELS.info)
      console.info(format('info', colors.cyan, ...args));
  },
  warn(...args) {
    if (currentLevel <= LEVELS.warn)
      console.warn(format('warn', colors.yellow, ...args));
  },
  error(...args) {
    if (currentLevel <= LEVELS.error)
      console.error(format('error', colors.red, ...args));
  },
  /**
   * Log request summary with latency colouring:
   *   green  < 300 ms
   *   yellow 300-800 ms
   *   red    > 800 ms
   */
  request(method, path, status, latencyMs) {
    const latColor =
      latencyMs < 300 ? colors.green :
      latencyMs < 800 ? colors.yellow : colors.red;
    const line = [
      `${colors.gray}${timestamp()}${colors.reset}`,
      `${colors.cyan}[REQUEST]${colors.reset}`,
      `${method.padEnd(6)}`,
      `${path.padEnd(20)}`,
      `→ HTTP ${status}`,
      `${latColor}${latencyMs} ms${colors.reset}`,
    ].join('  ');
    console.info(line);
  },
};

module.exports = { logger };
