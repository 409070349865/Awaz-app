import { useState } from 'react';
import Tesseract from 'tesseract.js';

// Map our app's language codes to Tesseract.js language codes
const OCR_LANG_MAP = {
  'en-US': 'eng',
  'en-GB': 'eng',
  'es-ES': 'spa',
  'fr-FR': 'fra',
  'de-DE': 'deu',
  'it-IT': 'ita',
  'pt-BR': 'por',
  'hi-IN': 'hin',
  'ja-JP': 'jpn',
  'zh-CN': 'chi_sim',
  'ko-KR': 'kor',
  'ru-RU': 'rus',
  'ar-SA': 'ara',
  'ur-PK': 'urd',
  'tr-TR': 'tur',
  'nl-NL': 'nld'
};

export function useImageOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processImage = async (fileOrUrl, sourceLangCode) => {
    setIsProcessing(true);
    setProgress(0);

    const tessLang = OCR_LANG_MAP[sourceLangCode] || 'eng';

    try {
      const result = await Tesseract.recognize(
        fileOrUrl,
        tessLang,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      return result.data.text.trim();
    } catch (err) {
      console.error('OCR Error:', err);
      throw err;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return { processImage, isProcessing, progress };
}
