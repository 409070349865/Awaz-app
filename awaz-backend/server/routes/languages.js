/**
 * routes/languages.js — GET /languages
 * ══════════════════════════════════════
 * Returns the list of supported language codes and names.
 * The frontend can use this to dynamically populate the language
 * selector dropdowns instead of hard-coding them in the HTML.
 *
 * Response: { languages: [{ code: 'en', name: 'English', flag: '🇬🇧' }, …] }
 */

'use strict';

const { Router } = require('express');
const router     = Router();

// Matches the language list in the frontend's index.html
const LANGUAGES = [
  { code: 'en', name: 'English',    flag: '🇬🇧' },
  { code: 'es', name: 'Spanish',    flag: '🇪🇸' },
  { code: 'fr', name: 'French',     flag: '🇫🇷' },
  { code: 'de', name: 'German',     flag: '🇩🇪' },
  { code: 'it', name: 'Italian',    flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian',    flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese',    flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese',   flag: '🇯🇵' },
  { code: 'ko', name: 'Korean',     flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic',     flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi',      flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu',       flag: '🇵🇰' },
  { code: 'nl', name: 'Dutch',      flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish',    flag: '🇸🇪' },
  { code: 'tr', name: 'Turkish',    flag: '🇹🇷' },
  { code: 'pl', name: 'Polish',     flag: '🇵🇱' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'bn', name: 'Bengali',    flag: '🇧🇩' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai',       flag: '🇹🇭' },
];

router.get('/', (req, res) => {
  res.json({ languages: LANGUAGES });
});

module.exports = router;
