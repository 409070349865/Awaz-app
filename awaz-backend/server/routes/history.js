'use strict';

const express = require('express');
const router = express.Router();
const Translation = require('../models/Translation');
const { logger } = require('../utils/logger');

// GET /history
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    
    // Fetch most recent translations
    const history = await Translation.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
      
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    logger.error('[History Route] Error fetching history:', error.message);
    next(error);
  }
});

module.exports = router;
