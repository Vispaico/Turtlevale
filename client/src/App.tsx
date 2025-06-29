
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './pages/Dashboard';
import PortfolioMain from './pages/PortfolioMain';
import PortfolioSmall from './pages/PortfolioSmall';

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Turtelli
            </Typography>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/portfolio/main">Main Portfolio</Button>
            <Button color="inherit" component={Link} to="/portfolio/small">Small Portfolio</Button>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio/main" element={<PortfolioMain />} />
            <Route path="/portfolio/small" element={<PortfolioSmall />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
