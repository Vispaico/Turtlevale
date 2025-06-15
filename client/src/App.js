import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactGA from 'react-ga';

// Import Firebase
import { auth, analytics, onMessageListener } from './firebase';

// Import i18n
import './i18n';

// Import components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Signals from './components/Signals';
import Trades from './components/Trades';
import Portfolio from './components/Portfolio';
import Subscription from './components/Subscription';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import ProtectedRoute from './components/ProtectedRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Initialize Google Analytics
ReactGA.initialize('G-Z9SXJ88GW4');

function App() {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    // Track page views
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onMessageListener()
      .then((payload) => {
        console.log('Foreground message received:', payload);
        // Handle notification display
        if (payload.notification) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/logo192.png'
          });
        }
      })
      .catch((err) => console.log('Failed to receive message:', err));

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            
            <Route path="/signals" element={
              <ProtectedRoute user={user}>
                <Signals />
              </ProtectedRoute>
            } />
            
            <Route path="/signals/:market" element={
              <ProtectedRoute user={user}>
                <Signals />
              </ProtectedRoute>
            } />
            
            <Route path="/trades" element={
              <ProtectedRoute user={user}>
                <Trades />
              </ProtectedRoute>
            } />
            
            <Route path="/portfolio/:market" element={<Portfolio />} />
            <Route path="/portfolio/indices" element={<Portfolio />} />
            <Route path="/portfolio/stocks" element={<Portfolio />} />
            <Route path="/portfolio/forex" element={<Portfolio />} />
            <Route path="/portfolio/crypto" element={<Portfolio />} />
            <Route path="/portfolio/all-markets" element={<Portfolio />} />
            
            <Route path="/subscription" element={<Subscription />} />
            
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            <Route path="/settings" element={
              <ProtectedRoute user={user}>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/dashboard" element={
              <ProtectedRoute user={user} adminRequired={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 