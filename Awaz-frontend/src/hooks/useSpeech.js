import { useState, useCallback, useRef, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:3000';

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  
  const translate = async (text, sourceLang, targetLang) => {
    setIsTranslating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.translatedText;
    } catch (err) {
      console.warn('[Translation API] Failed, using mock', err);
      // Fallback mock
      return `[Offline] ${text}`;
    } finally {
      setIsTranslating(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/history`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const { data } = await res.json();
      return data || [];
    } catch (err) {
      console.warn('Failed to load history:', err);
      return [];
    }
  };

  return { translate, fetchHistory, isTranslating };
}

export function useSpeechRecognition(onFinalResult) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const onFinalResultRef = useRef(onFinalResult);

  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    
    rec.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript.trim() + ' ';
        else interim += r[0].transcript;
      }
      
      setInterimText(interim);
      if (final.trim()) {
        if (onFinalResultRef.current) {
          onFinalResultRef.current(final.trim());
        }
      }
    };
    
    rec.onend = () => {
      // Auto restart if still supposed to be listening
      if (recognitionRef.current?.isListeningFlag) {
        rec.start();
      } else {
        setIsListening(false);
        setInterimText('');
      }
    };

    rec.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
      recognitionRef.current.isListeningFlag = false;
    };

    recognitionRef.current = { rec, isListeningFlag: false };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.isListeningFlag = false;
        recognitionRef.current.rec.stop();
      }
    };
  }, []);

  const toggleListening = (langCode) => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    const state = recognitionRef.current;
    
    if (state.isListeningFlag) {
      state.isListeningFlag = false;
      state.rec.stop();
      setIsListening(false);
    } else {
      state.rec.lang = langCode;
      try {
        state.rec.start();
        state.isListeningFlag = true;
        setIsListening(true);
      } catch(e) {
        // Already started
      }
    }
  };

  return { isListening, interimText, toggleListening };
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text, lang, volume = 1, speed = 1) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.volume = parseFloat(volume);
      utter.rate = parseFloat(speed);
      
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utter);
    }, 50);
  };
  
  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking };
}
