'use strict';

const mongoose = require('mongoose');
const config = require('./config');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`[MongoDB] Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
