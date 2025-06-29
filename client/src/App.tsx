import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PortfolioMain from './pages/PortfolioMain';
import PortfolioSmall from './pages/PortfolioSmall';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio/main" element={<PortfolioMain />} />
        <Route path="/portfolio/small" element={<PortfolioSmall />} />
      </Routes>
    </Router>
  );
}

export default App;