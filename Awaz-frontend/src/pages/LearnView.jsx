import React, { useState } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeech';
import { Volume2, BookOpen, CheckCircle } from 'lucide-react';
import { LEARN_DATA } from '../data/learnData';
import './LearnView.css';

const LearnView = () => {
  const [lang, setLang] = useState('es-ES');
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});

  const { speak } = useSpeechSynthesis();

  const data = LEARN_DATA[lang];
  if (!data) return null;

  const lessons = data.lessons;
  const currentLesson = lessons[currentLessonIdx];

  const total = lessons.length;
  const done = lessons.filter((_, i) => completedLessons[`${lang}:${i}`]).length;
  const pct = Math.round((done / total) * 100);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setCurrentLessonIdx(0);
  };

  const navigateLesson = (dir) => {
    const key = `${lang}:${currentLessonIdx}`;
    if (dir === 1) {
      setCompletedLessons(prev => ({ ...prev, [key]: true }));
      if (currentLessonIdx < lessons.length - 1) {
        setCurrentLessonIdx(prev => prev + 1);
      }
    } else if (dir === -1 && currentLessonIdx > 0) {
      setCurrentLessonIdx(prev => prev - 1);
    }
  };

  return (
    <div className="learn-view">
      <div className="view-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="text-gradient" style={{ background: 'linear-gradient(90deg, var(--green), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Language Learning Hub</h2>
          <p className="sub-text">Pick a language and start with structured basics — greetings, phrases, grammar tips</p>
        </div>
      </div>

      <div className="lang-tabs" style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(LEARN_DATA).map(([code, langData]) => (
          <button 
            key={code} 
            className={`tab ${lang === code ? 'active' : ''}`} 
            onClick={() => handleLangChange(code)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', 
              background: lang === code ? 'rgba(0,255,163,0.08)' : 'var(--glass)', 
              border: '1px solid var(--border)', borderRadius: '10px', 
              color: lang === code ? 'var(--green)' : 'var(--muted2)', 
              borderColor: lang === code ? 'rgba(0,255,163,0.35)' : '', cursor: 'pointer' 
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{langData.flag}</span> {langData.name}
          </button>
        ))}
      </div>

      <div className="learn-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
        
        {/* Sidebar */}
        <div className="lesson-sidebar" style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', height: 'fit-content', overflow: 'hidden' }}>
          <div className="lesson-sidebar-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)' }}>Lessons</div>
          <div className="lesson-list" style={{ display: 'flex', flexDirection: 'column' }}>
            {lessons.map((lesson, i) => {
              const isDone = completedLessons[`${lang}:${i}`];
              const isActive = i === currentLessonIdx;
              return (
                <div 
                  key={i} 
                  className={`lesson-item ${isActive ? 'active' : ''}`} 
                  onClick={() => setCurrentLessonIdx(i)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                    borderBottom: '1px solid var(--border)', cursor: 'pointer', 
                    background: isActive ? 'rgba(0,255,163,0.06)' : 'transparent', 
                    borderLeft: isActive ? '2px solid var(--green)' : '2px solid transparent' 
                  }}
                >
                  <div className="lesson-item-num" style={{ 
                    width: '22px', height: '22px', borderRadius: '6px', 
                    background: isActive ? 'rgba(0,255,163,0.15)' : 'var(--glass-b)', 
                    color: isActive ? 'var(--green)' : 'var(--muted)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: '0.76rem', color: isActive ? 'var(--green)' : 'var(--muted2)' }}>{lesson.title}</div>
                  {isDone && <CheckCircle size={14} color="var(--green)" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Lesson */}
        <div className="lesson-main glass-panel" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', padding: 0 }}>
          <div className="lesson-header" style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{currentLesson.title}</h3>
            <span className="badge" style={{ padding: '4px 12px', background: 'rgba(0,255,163,0.1)', color: 'var(--green)', border: '1px solid rgba(0,255,163,0.2)', borderRadius: '100px', fontSize: '0.6rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{currentLesson.level}</span>
          </div>

          <div className="lesson-body" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="lesson-progress" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Progress</span>
              <div className="progress-bar-wrap" style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div className="progress-bar-fill" style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--green), var(--accent))', borderRadius: '2px', transition: 'width 0.6s ease' }}></div>
              </div>
              <span className="progress-pct" style={{ fontSize: '0.62rem', color: 'var(--green)', minWidth: '30px', textAlign: 'right' }}>{pct}%</span>
            </div>

            <div className="phrases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {currentLesson.phrases.map((p, i) => (
                <div key={i} className="phrase-card" style={{ background: 'var(--glass-b)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', transition: 'var(--trans)' }}>
                  <div className="phrase-native" style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text)', marginBottom: '3px' }}>{p.native}</div>
                  <div className="phrase-roman" style={{ fontSize: '0.7rem', color: 'var(--accent)', marginBottom: '5px', fontStyle: 'italic' }}>{p.roman}</div>
                  <div className="phrase-eng" style={{ fontSize: '0.72rem', color: 'var(--muted2)' }}>{p.eng}</div>
                  <button className="btn phrase-speak-btn" style={{ marginTop: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.6rem', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'var(--trans)', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => speak(p.native, lang)}>
                    <Volume2 size={12} /> Listen
                  </button>
                </div>
              ))}
            </div>

            {currentLesson.grammar && (
              <div className="grammar-tip" style={{ background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '12px', padding: '16px 18px' }}>
                <div className="grammar-tip-label" style={{ fontSize: '0.58rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: '8px', fontWeight: 700 }}>💡 Grammar Tip</div>
                <div className="grammar-tip-text" style={{ fontSize: '0.8rem', color: 'var(--muted2)', lineHeight: 1.7 }}>{currentLesson.grammar}</div>
              </div>
            )}

            {currentLesson.table && currentLesson.table.length > 0 && (
              <div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: '10px', fontWeight: 700 }}>Quick Reference</div>
                <table className="ref-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.6rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Term</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.6rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLesson.table.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i === currentLesson.table.length - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.03)' }}>
                        <td style={{ padding: '9px 12px', color: 'var(--text)', fontWeight: 500 }}>{row[0]}</td>
                        <td style={{ padding: '9px 12px', color: 'var(--accent)' }}>{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="lesson-nav" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '0 22px 22px' }}>
            <button className="lesson-nav-btn" disabled={currentLessonIdx === 0} onClick={() => navigateLesson(-1)} style={{ padding: '9px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--glass)', color: 'var(--muted2)', fontSize: '0.75rem', cursor: 'pointer', opacity: currentLessonIdx === 0 ? 0.5 : 1, fontFamily: 'var(--font-mono)' }}>← Prev</button>
            <button className="lesson-nav-btn primary" onClick={() => navigateLesson(1)} style={{ padding: '9px 20px', borderRadius: '10px', border: '1px solid rgba(0,255,163,0.3)', background: 'rgba(0,255,163,0.1)', color: 'var(--green)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>{currentLessonIdx === lessons.length - 1 ? '✓ Complete' : 'Next →'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnView;
