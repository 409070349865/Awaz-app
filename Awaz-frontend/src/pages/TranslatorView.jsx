import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation, useSpeechRecognition, useSpeechSynthesis } from '../hooks/useSpeech';
import { useImageOCR } from '../hooks/useImageOCR';
import { Mic, Square, Play, Square as StopIcon, ArrowRightLeft, Image as ImageIcon, UploadCloud, ClipboardPaste } from 'lucide-react';
import './TranslatorView.css';

const LANGUAGES = [
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', label: 'French', flag: '🇫🇷' },
  { code: 'de-DE', label: 'German', flag: '🇩🇪' },
  { code: 'it-IT', label: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', label: 'Portuguese', flag: '🇧🇷' },
  { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ja-JP', label: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-CN', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ko-KR', label: 'Korean', flag: '🇰🇷' },
  { code: 'ru-RU', label: 'Russian', flag: '🇷🇺' },
  { code: 'ar-SA', label: 'Arabic', flag: '🇸🇦' },
  { code: 'ur-PK', label: 'Urdu', flag: '🇵🇰' },
  { code: 'tr-TR', label: 'Turkish', flag: '🇹🇷' },
  { code: 'nl-NL', label: 'Dutch', flag: '🇳🇱' }
];

const TranslatorView = () => {
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('es-ES');
  const [messages, setMessages] = useState([]); // { text, type: 'source'|'translation' }
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState('audio'); // 'audio', 'text', 'image'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { translate, isTranslating } = useTranslation();
  const { speak, stop: stopTTS, isSpeaking } = useSpeechSynthesis();
  const { processImage, isProcessing, progress } = useImageOCR();

  const handleFinalText = useCallback(async (text) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setMessages(prev => [...prev, { text, type: 'source', timestamp }]);
    
    const translatedText = await translate(text, sourceLang, targetLang);
    setMessages(prev => [...prev, { text: translatedText, type: 'translation', timestamp }]);
  }, [translate, sourceLang, targetLang]);

  const { isListening, interimText, toggleListening } = useSpeechRecognition(handleFinalText);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleFinalText(textInput.trim());
    setTextInput('');
  };

  const handleImageProcessing = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
       alert('Please upload a valid image file');
       return;
    }
    try {
       const text = await processImage(file, sourceLang);
       if (text) {
          handleFinalText(text);
       } else {
          alert('No text detected in the image.');
       }
    } catch (e) {
       alert('Failed to process image OCR');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageProcessing(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        handleImageProcessing(items[i].getAsFile());
        break;
      }
    }
  };

  const lastTranslation = messages.filter(m => m.type === 'translation').pop()?.text;

  return (
    <div className="translator-view">
      {/* Top Language Bar */}
      <div className="lang-bar glass-panel">
        <div className="lang-group">
          <span className="lang-label">From</span>
          <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="lang-select">
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>
        </div>
        
        <button className="swap-btn" onClick={handleSwap}>
          <ArrowRightLeft size={18} />
        </button>
        
        <div className="lang-group">
          <span className="lang-label">To</span>
          <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="lang-select">
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mode-selector">
        <button className={`mode-btn ${mode === 'audio' ? 'active' : ''}`} onClick={() => setMode('audio')}>
          <Mic size={16} /> VOICE MODE
        </button>
        <button className={`mode-btn ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
          <Square size={16} /> TEXT MODE
        </button>
        <button className={`mode-btn ${mode === 'image' ? 'active' : ''}`} onClick={() => setMode('image')}>
          <ImageIcon size={16} /> IMAGE MODE
        </button>
      </div>

      <div className="main-translation-grid">
        {/* Source Panel */}
        <div className="panel source-panel glass-panel">
          <div className="panel-header">
            <h3>{mode === 'audio' ? 'TRANSCRIPTION' : mode === 'text' ? 'SOURCE TEXT' : 'IMAGE UPLOAD'}</h3>
            <span className="badge badge-cyan">{sourceLang.split('-')[0].toUpperCase()} EN</span>
          </div>
          
          {mode === 'audio' ? (
            <div className="message-area">
              {messages.filter(m => m.type === 'source').length === 0 && !interimText && (
                <div className="empty-state">
                  <Mic size={32} opacity={0.4} />
                  <p>Press the mic button to start speaking.<br/>Your words will appear here.</p>
                </div>
              )}
              {messages.filter(m => m.type === 'source').map((m, i) => (
                <div key={i} className="msg-bubble source-bubble">
                  <div className="msg-text">{m.text}</div>
                  {m.timestamp && <div className="msg-time">{m.timestamp}</div>}
                </div>
              ))}
              {interimText && (
                <div className="msg-bubble source-bubble interim-bubble">
                  <div className="msg-text">{interimText}</div>
                </div>
              )}
            </div>
          ) : mode === 'text' ? (
            <div className="text-mode-area">
              <textarea 
                className="text-mode-input" 
                placeholder="Type or paste your text here..."
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
              />
              <button 
                className="btn btn-primary text-translate-btn" 
                onClick={() => {
                  if (textInput.trim()) {
                    handleFinalText(textInput.trim());
                  }
                }}
                disabled={!textInput.trim() || isTranslating}
              >
                {isTranslating ? 'Translating...' : 'Translate Text'}
              </button>
            </div>
          ) : (
            <div 
              className={`image-upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onPaste={handlePaste}
              tabIndex="0"
            >
               <div className="upload-left">
                 <UploadCloud size={60} color="#00E5FF" />
                 <p className="drag-text">Drag and drop</p>
               </div>
               <div className="upload-divider"></div>
               <div className="upload-right">
                 <p className="upload-hint">Or choose a file</p>
                 <button className="btn btn-primary browse-btn" onClick={() => fileInputRef.current?.click()}>
                   Browse your files
                 </button>
                 <button className="btn clipboard-btn" onClick={async () => {
                   try {
                     const items = await navigator.clipboard.read();
                     for (let item of items) {
                       if (item.types.some(t => t.startsWith('image/'))) {
                         const blob = await item.getType(item.types.find(t => t.startsWith('image/')));
                         handleImageProcessing(blob);
                         return;
                       }
                     }
                   } catch(err) {
                     alert("Clipboard permission denied or no image found.");
                   }
                 }}>
                   <ClipboardPaste size={16} /> Paste from clipboard
                 </button>
                 <p className="supported-formats">Supported file types: .jpg, .jpeg, .png, .webp.</p>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   hidden 
                   accept="image/jpeg, image/png, image/webp" 
                   onChange={e => handleImageProcessing(e.target.files[0])}
                 />
               </div>
               
               {isProcessing && (
                 <div className="processing-overlay">
                   <div className="loader-spinner"></div>
                   <p>Extracting text... {progress}%</p>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Center Column */}
        <div className="center-mic-column">
          <div className="center-mic-wrapper">
            {mode === 'audio' ? (
              <>
                {isListening ? (
                  <div className="freq-bars">
                    <span className="bar b1"></span>
                    <span className="bar b2"></span>
                    <span className="bar b3"></span>
                    <span className="bar b4"></span>
                    <span className="bar b5"></span>
                  </div>
                ) : (
                   <div className="freq-bars-placeholder"></div>
                )}
                
                <div className={`mic-button-wrap ${isListening ? 'active' : ''}`}>
                  <button 
                    className={`mic-button ${isListening ? 'listening' : ''}`}
                    onClick={() => toggleListening(sourceLang)}
                  >
                    {isListening ? (
                      <div className="stop-square"></div>
                    ) : (
                      <Mic size={26} color="#00E5FF" />
                    )}
                  </button>
                </div>
                <p className="mic-status">{isListening ? 'TAP TO STOP' : 'TAP TO SPEAK'}</p>
              </>
            ) : (
              <div className="text-mode-arrow">
                 <ArrowRightLeft size={36} color="var(--text-secondary)" opacity={0.3} />
              </div>
            )}
          </div>
        </div>

        {/* Translation Panel */}
        <div className="panel translation-panel glass-panel">
          <div className="panel-header">
            <h3>TRANSLATION</h3>
            <span className="badge badge-purple">{targetLang.split('-')[0].toUpperCase()} ES</span>
          </div>
          
          {mode === 'audio' ? (
            <div className="message-area">
              {messages.filter(m => m.type === 'translation').length === 0 && !isTranslating && (
                <div className="empty-state">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(0, 0, 0, 0.4)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5523 20.5523 16 20 16H7L3 20V5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V15Z" />
                  </svg>
                  <p>Translations will appear here<br/>after you speak.</p>
                </div>
              )}
              {messages.filter(m => m.type === 'translation').map((m, i) => (
                <div key={i} className="msg-bubble translation-bubble">
                  <div className="msg-text">{m.text}</div>
                  {m.timestamp && <div className="msg-time">{m.timestamp}</div>}
                </div>
              ))}
              {isTranslating && <div className="processing-indicator">Translating...</div>}
            </div>
          ) : (
            <div className="text-mode-area">
              {isTranslating ? (
                <div className="processing-indicator">Translating text...</div>
              ) : (
                <textarea 
                  className="text-mode-output" 
                  readOnly
                  value={lastTranslation || ''}
                  placeholder="Translation output will appear here..."
                />
              )}
            </div>
          )}

        <div className="playback-controls">
          <div className="play-buttons">
            <button 
              className="btn btn-primary play-btn" 
              disabled={!lastTranslation || isSpeaking}
              onClick={() => speak(lastTranslation, targetLang, volume, speed)}
              title="Play Translation"
            >
              <Play size={20} fill="currentColor" />
            </button>
            <button 
              className="btn btn-glass play-btn" 
              disabled={!isSpeaking}
              onClick={stopTTS}
            >
              <StopIcon size={18} />
            </button>
          </div>
          
          <div className="sliders">
            <div className="slider-group">
              <label>Vol</label>
              <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(e.target.value)} />
            </div>
            <div className="slider-group">
              <label>Speed</label>
              <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(e.target.value)} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorView;
