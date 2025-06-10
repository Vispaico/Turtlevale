import React from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import {
  TrendingUp,
  ShowChart,
  Notifications,
  Security,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Ads from './Ads';

const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <TrendingUp fontSize="large" color="primary" />,
      title: t('home.features.signals'),
      description: t('home.features.signalsDesc'),
    },
    {
      icon: <ShowChart fontSize="large" color="primary" />,
      title: t('home.features.markets'),
      description: t('home.features.marketsDesc'),
    },
    {
      icon: <Notifications fontSize="large" color="primary" />,
      title: t('home.features.notifications'),
      description: t('home.features.notificationsDesc'),
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: 'Professional Analysis',
      description: 'Turtle Trading methodology with proven risk management and systematic approach.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          padding: isMobile ? '60px 0' : '100px 0',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            {t('home.title')}
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="h2"
            gutterBottom
            sx={{ marginBottom: 4, opacity: 0.9 }}
          >
            {t('home.subtitle')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: 4, fontSize: isMobile ? '1rem' : '1.2rem' }}
          >
            {t('home.description')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/signup"
            sx={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            {t('home.getStarted')}
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ padding: '80px 0' }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ marginBottom: 6 }}
        >
          Why Choose Turtlevale?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  padding: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ marginBottom: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Markets Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '60px 0' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ marginBottom: 4 }}
          >
            Trade Across Multiple Markets
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {['Indices', 'Stocks', 'Forex', 'Crypto'].map((market) => (
              <Grid item xs={6} sm={3} key={market}>
                <Card
                  sx={{
                    textAlign: 'center',
                    padding: 3,
                    backgroundColor: 'white',
                    border: '2px solid transparent',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Typography variant="h6" component="h3">
                    {market}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Advertisement */}
      <Container maxWidth="lg">
        <Ads />
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          padding: '60px 0',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Trading?
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: 3, fontSize: '1.1rem' }}
          >
            Join thousands of traders using Turtlevale to achieve financial freedom through disciplined trading.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/signals"
            sx={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              marginRight: isMobile ? 0 : 2,
              marginBottom: isMobile ? 2 : 0,
            }}
          >
            View Signals
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            component={Link}
            to="/subscription"
            sx={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            View Plans
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default Home; 