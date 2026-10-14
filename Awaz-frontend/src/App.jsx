import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TranslatorView from './pages/TranslatorView';
import HistoryView from './pages/HistoryView';
import AnalyticsView from './pages/AnalyticsView';
import LearnView from './pages/LearnView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TranslatorView />} />
          <Route path="history" element={<HistoryView />} />
          <Route path="stats" element={<AnalyticsView />} />
          <Route path="learn" element={<LearnView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
