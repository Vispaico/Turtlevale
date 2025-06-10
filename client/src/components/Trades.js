import React from 'react';
import { Container, Typography, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Ads from './Ads';

const Trades = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('trades.title')}
      </Typography>
      
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="body1">
          Trade management functionality will be implemented here.
        </Typography>
      </Box>

      <Ads />
    </Container>
  );
};

export default Trades; 