import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  ListItemIcon
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Star as StarIcon,
  TrendingUp,
  Lock as LockIcon
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Alert as MuiAlert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: theme.spacing(6, 3),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  planCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.shadows[8],
    },
  },
  popularCard: {
    border: `3px solid ${theme.palette.primary.main}`,
    background: 'linear-gradient(135deg, #f5f7ff 0%, #c3ceff 100%)',
  },
  priceSection: {
    padding: theme.spacing(2),
    textAlign: 'center',
    background: theme.palette.grey[50],
  },
  comingSoonButton: {
    background: theme.palette.grey[300],
    color: theme.palette.grey[600],
    '&:hover': {
      background: theme.palette.grey[400],
    },
  },
  marketSelector: {
    minWidth: 200,
    marginTop: theme.spacing(2),
  },
  testimonial: {
    background: theme.palette.grey[50],
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
}));

const Subscription = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [vipAccess, setVipAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);

  const markets = [
    { id: 'indices', name: 'Indices (SPY, QQQ, DAX, etc.)', count: 10 },
    { id: 'stocks', name: 'Stocks (AAPL, TSLA, NVDA, etc.)', count: 20 },
    { id: 'forex', name: 'Forex (EUR/USD, GBP/USD, etc.)', count: 15 },
    { id: 'crypto', name: 'Crypto (BTC, ETH, ADA, etc.)', count: 15 },
  ];

  useEffect(() => {
    // Check if user has VIP access
    if (currentUser?.email === 'niels@vispaico.com' || currentUser?.email === 'niels@vispaic.com') {
      setVipAccess(true);
    }

    if (currentUser) {
      fetchUserSubscription();
    }
  }, [currentUser]);

  const fetchUserSubscription = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserSubscription(userDoc.data().subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Failed to fetch subscription details');
    }
  };

  const handleSubscribe = async (type, market = null) => {
    setLoading(true);
    setError(null);
    try {
      const subscription = {
        type,
        markets: market ? [market] : [],
        isActive: true,
        trialSignals: type === 'full-access' ? 6 : 0,
        startDate: new Date()
      };

      await setDoc(doc(db, 'users', currentUser.uid), {
        subscription
      }, { merge: true });

      setUserSubscription(subscription);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleMarketSelection = (marketId) => {
    setSelectedMarkets(prev => {
      const isSelected = prev.includes(marketId);
      if (isSelected) {
        return prev.filter(id => id !== marketId);
      } else {
        return [...prev, marketId];
      }
    });
  };

  const calculateIndividualPrice = () => {
    return selectedMarkets.length * 10;
  };

  const renderFeatureList = (features) => (
    <List>
      {features.map((feature, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <CheckIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={feature} />
        </ListItem>
      ))}
    </List>
  );

  const renderSubscriptionCard = (title, price, features, type, market = null) => (
    <Card className={`${classes.planCard} ${type === 'full-access' ? classes.popularCard : ''}`}>
      {type === 'full-access' && (
        <Chip
          icon={<StarIcon />}
          label="Most Popular"
          color="primary"
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        />
      )}
      
      <CardContent style={{ flexGrow: 1, padding: 0 }}>
        {/* Plan Header */}
        <Box className={classes.priceSection}>
          <Typography variant="h5" component="h3" gutterBottom>
            {title}
          </Typography>
          
          <Typography variant="h3" component="div" color="primary" gutterBottom>
            {price}
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            {type === 'full-access' ? '2 months free!' : 'per month'}
          </Typography>
        </Box>

        <Divider />

        {/* Features List */}
        <Box padding={2}>
          {renderFeatureList(features)}

          {/* Market Selection for Individual Plan */}
          {type === 'individual' && (
            <Box marginTop={2}>
              <Typography variant="subtitle2" gutterBottom>
                Select Markets (${calculateIndividualPrice()}/month):
              </Typography>
              {markets.map((market) => (
                <Box key={market.id} marginBottom={1}>
                  <Button
                    variant={selectedMarkets.includes(market.id) ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleMarketSelection(market.id)}
                    style={{ 
                      marginRight: 8, 
                      marginBottom: 4,
                      fontSize: '0.7rem',
                      padding: '4px 8px'
                    }}
                  >
                    {market.name} ({market.count})
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          <Typography 
            variant="caption" 
            color="textSecondary" 
            style={{ display: 'block', marginTop: 16 }}
          >
            {type === 'full-access' ? 'Everything included' : `Choose from ${markets.length} markets`}
          </Typography>
        </Box>
      </CardContent>

      <CardActions style={{ padding: 16 }}>
        <Button
          variant={type === 'full-access' ? "contained" : "outlined"}
          color="primary"
          size="large"
          fullWidth
          onClick={() => handleSubscribe(type, market)}
          className={type !== 'free' ? classes.comingSoonButton : ''}
          startIcon={type === 'full-access' ? <TrendingUp /> : null}
          disabled={loading || (userSubscription?.type === type && (!market || userSubscription.markets.includes(market)))}
        >
          {loading ? <CircularProgress size={20} /> : type === 'free' ? 'Get Started Free' : 'Coming Soon'}
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" style={{ paddingTop: 64, paddingBottom: 32 }}>
      {/* Hero Section */}
      <Box className={classes.heroSection}>
        <Typography variant="h2" component="h1" gutterBottom>
          🐢 Choose Your Turtelli Plan
        </Typography>
        <Typography variant="h5" style={{ opacity: 0.9, marginBottom: 24 }}>
          Professional Turtle Trading signals delivered daily at 5 PM ET
        </Typography>
        <Typography variant="body1" style={{ opacity: 0.8 }}>
          Join thousands of traders using our systematic approach to capture market trends
        </Typography>
      </Box>

      {/* VIP Access Alert */}
      {vipAccess && (
        <MuiAlert severity="success" style={{ marginBottom: 24 }}>
          <strong>VIP Access Detected!</strong> You have full access to all features for testing purposes.
        </MuiAlert>
      )}

      {/* Pricing Cards */}
      <Grid container spacing={4}>
        {renderSubscriptionCard(
          'Free',
          '$0/month',
          [
            '1 market of your choice',
            'Delayed signals (1-hour delay)',
            'Basic market analysis',
            'Email notifications'
          ],
          'free'
        )}

        {renderSubscriptionCard(
          'Individual Market',
          '$10/month',
          [
            '1 market of your choice',
            'Real-time signals',
            'Advanced market analysis',
            'Priority email notifications',
            'Portfolio tracking'
          ],
          'individual'
        )}

        {renderSubscriptionCard(
          'Full Access',
          '$30/month',
          [
            'All markets (60+ tickers)',
            'Real-time signals',
            'Advanced market analysis',
            'Priority email notifications',
            'Portfolio tracking',
            '6-signal trial included'
          ],
          'full-access'
        )}
      </Grid>

      {/* Features Comparison */}
      <Box marginTop={6}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          What You Get
        </Typography>
        
        <Grid container spacing={3} style={{ marginTop: 16 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  🎯 Daily Signals
                </Typography>
                <Typography variant="body2">
                  Turtle Trading signals generated at 5 PM ET using 20-day breakout system with precise entry, stop-loss, and target levels.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  📊 60+ Instruments
                </Typography>
                <Typography variant="body2">
                  Trade indices, stocks, forex, and crypto with signals covering major markets worldwide.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  📈 Portfolio Tracking
                </Typography>
                <Typography variant="body2">
                  Monitor performance with real-time portfolio tracking, P&L analysis, and trade history.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonial */}
      <Box className={classes.testimonial}>
        <Typography variant="h6" align="center" gutterBottom>
          "Turtle Trading has been proven to work across decades. Turtelli makes it accessible to everyone."
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          Based on the legendary Turtle Trading experiment that turned novices into successful traders
        </Typography>
      </Box>

      {/* Footer Note */}
      <Box marginTop={4} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          * All subscriptions include 6 free trial signals to start
        </Typography>
        <Typography variant="body2" color="textSecondary">
          * No Stripe integration yet - contact support@turtelli.com for early access
        </Typography>
        <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 8 }}>
          Risk Warning: Trading involves substantial risk and may not be suitable for all investors.
        </Typography>
      </Box>

      {success && (
        <MuiAlert severity="success" sx={{ mt: 2 }}>
          Subscription updated successfully
        </MuiAlert>
      )}
    </Container>
  );
};

export default Subscription; 