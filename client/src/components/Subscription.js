import React from 'react';
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
} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

const Subscription = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: t('subscription.free.title'),
      price: t('subscription.free.price'),
      features: [
        'Access to 1 market category',
        '6 trial signals',
        '1-hour delayed notifications'
      ],
      current: true,
    },
    {
      name: t('subscription.individual.title'),
      price: t('subscription.individual.price'),
      features: [
        'Access to 1 chosen market',
        'Unlimited signals',
        'Instant notifications'
      ],
      popular: false,
    },
    {
      name: t('subscription.fullAccess.title'),
      price: t('subscription.fullAccess.price'),
      features: [
        'Access to all markets',
        'Unlimited signals',
        'Instant notifications',
        'Priority support'
      ],
      popular: true,
    },
  ];

  const handleSubscribe = (planName) => {
    console.log('Subscribing to:', planName);
    // Stripe integration will be implemented here
    alert('Stripe integration coming soon!');
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        {t('subscription.title')}
      </Typography>

      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        {plans.map((plan, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.popular ? '2px solid #1976d2' : '1px solid #e0e0e0',
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Typography variant="h3" component="div" color="primary" gutterBottom>
                  {plan.price}
                </Typography>

                <List>
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} sx={{ padding: '4px 0' }}>
                      <Check color="primary" sx={{ marginRight: 1 }} />
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                {plan.current ? (
                  <Chip label={t('subscription.current')} color="default" />
                ) : (
                  <Button
                    variant={plan.popular ? "contained" : "outlined"}
                    color="primary"
                    size="large"
                    onClick={() => handleSubscribe(plan.name)}
                    sx={{ width: '100%' }}
                  >
                    {t('subscription.subscribe')}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          * {t('subscription.annual')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Subscription; 