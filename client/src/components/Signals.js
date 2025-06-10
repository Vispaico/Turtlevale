import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { TrendingUp, TrendingDown, AccessTime } from '@material-ui/icons';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { auth, db } from '../firebase';
import Ads from './Ads';

const Signals = () => {
  const { t } = useTranslation();
  const { market } = useParams();
  const [user] = useAuthState(auth);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(market || 'all');
  const [userSubscription, setUserSubscription] = useState(null);
  const [trialDialogOpen, setTrialDialogOpen] = useState(false);

  const markets = ['all', 'indices', 'stocks', 'forex', 'crypto'];

  useEffect(() => {
    if (user) {
      fetchUserSubscription();
      fetchSignals();
    }
  }, [user, selectedMarket]);

  const fetchUserSubscription = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserSubscription(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };

  const fetchSignals = async () => {
    setLoading(true);
    try {
      let signalsQuery = collection(db, 'signals');
      
      if (selectedMarket !== 'all') {
        signalsQuery = query(
          signalsQuery,
          where('market', '==', selectedMarket),
          orderBy('timestamp', 'desc'),
          limit(20)
        );
      } else {
        signalsQuery = query(
          signalsQuery,
          orderBy('timestamp', 'desc'),
          limit(50)
        );
      }

      const snapshot = await getDocs(signalsQuery);
      const signalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Check subscription access
      const accessibleSignals = filterSignalsBySubscription(signalsData);
      setSignals(accessibleSignals);
    } catch (error) {
      setError('Error fetching signals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterSignalsBySubscription = (signalsData) => {
    if (!userSubscription) return [];

    const { subscriptions } = userSubscription;
    const trialSignalsUsed = subscriptions?.free?.trialSignalsUsed || 0;

    // Check if user has full access
    if (subscriptions?.fullAccess?.active) {
      return signalsData;
    }

    // Check individual market access
    if (selectedMarket !== 'all' && subscriptions?.[selectedMarket]?.active) {
      return signalsData;
    }

    // Free tier with trial
    if (trialSignalsUsed < 6) {
      return signalsData.slice(0, 6 - trialSignalsUsed);
    }

    return [];
  };

  const handleSignalView = async (signalId) => {
    if (!userSubscription) return;

    const { subscriptions } = userSubscription;
    const trialSignalsUsed = subscriptions?.free?.trialSignalsUsed || 0;

    // If user has premium access, no need to track trial
    if (subscriptions?.fullAccess?.active || subscriptions?.[selectedMarket]?.active) {
      return;
    }

    // Track trial usage
    if (trialSignalsUsed < 6) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          'subscriptions.free.trialSignalsUsed': trialSignalsUsed + 1
        });
        
        // Update local state
        setUserSubscription(prev => ({
          ...prev,
          subscriptions: {
            ...prev.subscriptions,
            free: {
              ...prev.subscriptions.free,
              trialSignalsUsed: trialSignalsUsed + 1
            }
          }
        }));

        if (trialSignalsUsed + 1 >= 6) {
          setTrialDialogOpen(true);
        }
      } catch (error) {
        console.error('Error updating trial usage:', error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedMarket(newValue);
  };

  const getSignalIcon = (action) => {
    return action === 'BUY' ? 
      <TrendingUp style={{ color: '#4caf50' }} /> : 
      <TrendingDown style={{ color: '#f44336' }} />;
  };

  const getSignalColor = (action) => {
    return action === 'BUY' ? '#4caf50' : '#f44336';
  };

  const renderTrialCounter = () => {
    if (!userSubscription) return null;

    const { subscriptions } = userSubscription;
    const trialSignalsUsed = subscriptions?.free?.trialSignalsUsed || 0;

    if (subscriptions?.fullAccess?.active || subscriptions?.[selectedMarket]?.active) {
      return null;
    }

    const remainingTrials = Math.max(0, 6 - trialSignalsUsed);

    return (
      <Alert severity={remainingTrials > 0 ? 'info' : 'warning'} sx={{ marginBottom: 2 }}>
        {remainingTrials > 0 ? 
          t('signals.trial.remaining', { count: remainingTrials }) :
          t('signals.trial.expired')
        }
      </Alert>
    );
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('signals.title')}
      </Typography>

      {renderTrialCounter()}

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {/* Market Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
        <Tabs value={selectedMarket} onChange={handleTabChange}>
          <Tab label={t('signals.filters.all')} value="all" />
          <Tab label={t('signals.filters.indices')} value="indices" />
          <Tab label={t('signals.filters.stocks')} value="stocks" />
          <Tab label={t('signals.filters.forex')} value="forex" />
          <Tab label={t('signals.filters.crypto')} value="crypto" />
        </Tabs>
      </Box>

      {/* Signals Grid */}
      {signals.length === 0 ? (
        <Alert severity="info">
          {t('signals.noSignals')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {signals.map((signal, index) => (
            <Grid item xs={12} md={6} lg={4} key={signal.id}>
              <Card
                className={`signal-card signal-${signal.action.toLowerCase()}`}
                onClick={() => handleSignalView(signal.id)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      {getSignalIcon(signal.action)}
                      <Typography variant="h6" component="h3" sx={{ marginLeft: 1 }}>
                        {signal.ticker}
                      </Typography>
                    </Box>
                    <Chip
                      label={signal.action}
                      size="small"
                      style={{
                        backgroundColor: getSignalColor(signal.action),
                        color: 'white',
                      }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {signal.market.charAt(0).toUpperCase() + signal.market.slice(1)}
                  </Typography>

                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2">
                      {t('signals.signal.price', { price: signal.price })}
                    </Typography>
                    {signal.stopLoss && (
                      <Typography variant="body2">
                        {t('signals.signal.stopLoss', { price: signal.stopLoss })}
                      </Typography>
                    )}
                    {signal.target && (
                      <Typography variant="body2">
                        {t('signals.signal.target', { price: signal.target })}
                      </Typography>
                    )}
                  </Box>

                  <Box display="flex" alignItems="center" mt={2}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
                      {signal.timestamp ? format(signal.timestamp.toDate(), 'MMM dd, HH:mm') : 'Unknown'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Advertisements */}
      <Box sx={{ marginTop: 4 }}>
        <Ads />
      </Box>

      {/* Trial Expired Dialog */}
      <Dialog open={trialDialogOpen} onClose={() => setTrialDialogOpen(false)}>
        <DialogTitle>Trial Period Ended</DialogTitle>
        <DialogContent>
          <Typography>
            You've used all 6 of your free trial signals. Upgrade to continue receiving unlimited signals.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrialDialogOpen(false)}>
            Close
          </Button>
          <Button component={Link} to="/subscription" variant="contained" color="primary">
            Upgrade Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Signals; 