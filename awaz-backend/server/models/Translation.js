'use strict';

const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  sourceText: {
    type: String,
    required: true,
  },
  translatedText: {
    type: String,
    required: true,
  },
  sourceLang: {
    type: String,
    required: true,
  },
  targetLang: {
    type: String,
    required: true,
  },
  engine: {
    type: String,
    default: 'unknown',
  },
  latencyMs: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Translation', translationSchema);
