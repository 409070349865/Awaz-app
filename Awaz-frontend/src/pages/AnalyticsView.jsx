import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useSpeech';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './AnalyticsView.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsView = () => {
  const { fetchHistory } = useTranslation();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory().then(setHistory);
  }, []);

  // Compute stats
  const totalTranslations = history.length;
  const avgLatency = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / history.length) 
    : 0;

  // Language usage
  const langUsage = history.reduce((acc, curr) => {
    acc[curr.targetLang] = (acc[curr.targetLang] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(langUsage).map(l => l.toUpperCase()),
    datasets: [
      {
        data: Object.values(langUsage),
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Latency over time
  const lineData = {
    labels: history.slice(0, 15).map((_, i) => `#${i + 1}`).reverse(),
    datasets: [
      {
        label: 'Latency (ms)',
        data: history.slice(0, 15).map(h => h.latencyMs).reverse(),
        borderColor: 'rgba(6, 182, 212, 1)',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#a1a1aa' } }
    },
    scales: {
      x: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#a1a1aa' } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#a1a1aa' } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#a1a1aa' } }
    }
  };

  return (
    <div className="analytics-view">
      <div className="view-header">
        <div>
          <h2 className="text-gradient">Analytics</h2>
          <p className="sub-text">Real-time charts based on your translation activity</p>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card glass-panel">
          <span className="stat-label">Total Translations</span>
          <span className="stat-value text-cyan">{totalTranslations}</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">Avg Latency</span>
          <span className="stat-value text-purple">{avgLatency}ms</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">Top Language</span>
          <span className="stat-value text-green">
            {Object.keys(langUsage).sort((a,b) => langUsage[b] - langUsage[a])[0] || '-'}
          </span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container glass-panel">
          <h3>Latency Trend</h3>
          <div className="canvas-wrap">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-container glass-panel">
          <h3>Target Language Usage</h3>
          <div className="canvas-wrap">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
