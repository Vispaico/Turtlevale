import React from 'react';
import { Container, Typography, Box } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Ads from './Ads';

const Portfolio = () => {
  const { t } = useTranslation();
  const { market } = useParams();

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('portfolio.title')} - {market}
      </Typography>
      
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="body1">
          Portfolio tracking for {market} will be implemented here.
        </Typography>
      </Box>

      <Ads />
    </Container>
  );
};

export default Portfolio; 