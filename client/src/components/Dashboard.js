import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Alert as MaterialUILabAlert } from '@material-ui/lab';

const Dashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [signals, setSignals] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('all');

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const signalsQuery = query(
        collection(db, 'signals'),
        where('timestamp', '>=', today),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(signalsQuery);
      const signalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSignals(signalsData);
    } catch (error) {
      console.error('Error fetching signals:', error);
      setError('Failed to fetch signals');
    }
  };

  const handleManualPull = async () => {
    setLoading(true);
    setError(null);
    try {
      const functions = getFunctions();
      const generateSignals = httpsCallable(functions, 'manualGenerateSignals');
      await generateSignals();
      setSuccess(true);
      await fetchSignals(); // Refresh signals after generation
    } catch (error) {
      console.error('Error generating signals:', error);
      setError('Failed to generate signals');
    } finally {
      setLoading(false);
    }
  };

  const handleMarketChange = (event, newValue) => {
    setSelectedMarket(newValue);
  };

  const filteredSignals = selectedMarket === 'all' 
    ? signals 
    : signals.filter(signal => signal.market === selectedMarket);

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('nav.dashboard')}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleManualPull}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Generating Signals...' : 'Pull Signals Now'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Tabs
            value={selectedMarket}
            onChange={handleMarketChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Markets" value="all" />
            <Tab label="Indices" value="indices" />
            <Tab label="Stocks" value="stocks" />
            <Tab label="Forex" value="forex" />
            <Tab label="Crypto" value="crypto" />
          </Tabs>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {filteredSignals.map((signal) => (
              <Grid item xs={12} sm={6} md={4} key={signal.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {signal.ticker}
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: signal.action === 'BUY' ? 'success.light' : 'error.light',
                          color: 'white',
                          fontSize: '0.875rem',
                        }}
                      >
                        {signal.action}
                      </Box>
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {signal.market.toUpperCase()}
                    </Typography>
                    <Typography variant="body2">
                      Entry: ${signal.price.toFixed(2)}
                    </Typography>
                    {signal.stopLoss && (
                      <Typography variant="body2">
                        Stop Loss: ${signal.stopLoss.toFixed(2)}
                      </Typography>
                    )}
                    {signal.target && (
                      <Typography variant="body2">
                        Target: ${signal.target.toFixed(2)}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      {signal.timestamp.toDate().toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <MaterialUILabAlert severity="error" onClose={() => setError(null)}>
          {error}
        </MaterialUILabAlert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <MaterialUILabAlert severity="success" onClose={() => setSuccess(false)}>
          Signals generated successfully
        </MaterialUILabAlert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard; 