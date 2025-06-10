import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('nav.settings')}
      </Typography>
      
      <Typography variant="body1">
        Settings page functionality will be implemented here.
      </Typography>
    </Container>
  );
};

export default Settings; 