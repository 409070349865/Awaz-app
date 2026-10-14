import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useSpeech';
import { History, RefreshCw } from 'lucide-react';
import './HistoryView.css';

const HistoryView = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchHistory } = useTranslation();

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchHistory();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="history-view">
      <div className="view-header">
        <div>
          <h2 className="text-gradient">Translation History</h2>
          <p className="sub-text">View your past translations synced from MongoDB</p>
        </div>
        <button className="btn btn-glass" onClick={loadHistory} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="history-timeline glass-panel">
        {loading ? (
          <div className="loading-state">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <History size={48} opacity={0.3} />
            <p>No history available yet.</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item._id} className="history-card">
              <div className="history-langs">
                <span className="badge badge-cyan">{item.sourceLang.toUpperCase()}</span>
                <span className="arrow">→</span>
                <span className="badge badge-purple">{item.targetLang.toUpperCase()}</span>
              </div>
              <div className="history-content">
                <div className="source-text">{item.sourceText}</div>
                <div className="translated-text">{item.translatedText}</div>
              </div>
              <div className="history-meta">
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                <span className="latency">{item.latencyMs}ms</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryView;
