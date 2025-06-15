import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  lastUpdated: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  riskWarning: {
    marginBottom: theme.spacing(3),
  },
}));

const Terms = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" style={{ paddingTop: 64, paddingBottom: 32 }}>
      <Paper className={classes.paper}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          🐢 Turtelli Terms and Conditions
        </Typography>
        
        <Typography variant="body2" className={classes.lastUpdated} align="center" gutterBottom>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        {/* Risk Warning */}
        <Alert severity="warning" className={classes.riskWarning}>
          <Typography variant="h6" gutterBottom>
            ⚠️ IMPORTANT RISK WARNING
          </Typography>
          <Typography variant="body2">
            Trading in financial instruments involves substantial risk and may not be suitable for all investors. 
            Past performance does not guarantee future results. You may lose some or all of your investment. 
            Please ensure you understand the risks involved before using our services.
          </Typography>
        </Alert>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Turtelli ("the Service"), you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms and Conditions constitute a legal agreement between you and Turtelli regarding your use 
            of our trading signal service and related website functionality.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. Service Description
          </Typography>
          <Typography variant="body1" paragraph>
            Turtelli provides trading signals based on the Turtle Trading system, including:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Daily trading signals for indices, stocks, forex, and cryptocurrency" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Entry, stop-loss, and target price recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Portfolio tracking and performance analytics" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Email notifications and signal delivery" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            Our signals are generated using systematic algorithmic analysis and are delivered for informational 
            purposes only.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. Subscription Terms
          </Typography>
          
          <Typography variant="h6" component="h3" gutterBottom>
            Free Trial
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="6 free signals upon registration" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Access to 1 market category" />
            </ListItem>
            <ListItem>
              <ListItemText primary="1-hour delayed email notifications" />
            </ListItem>
          </List>

          <Typography variant="h6" component="h3" gutterBottom>
            Individual Subscription ($10/month per market)
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Unlimited signals for chosen market(s)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Real-time email notifications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Advanced portfolio tracking" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Monthly billing, cancel anytime" />
            </ListItem>
          </List>

          <Typography variant="h6" component="h3" gutterBottom>
            Full Access Subscription ($30/month or $360/year)
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="All 60+ trading instruments" />
            </ListItem>
            <ListItem>
              <ListItemText primary="All market categories (indices, stocks, forex, crypto)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Priority support and early feature access" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Annual subscription saves 2 months (16% discount)" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. Investment Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>IMPORTANT:</strong> Turtelli provides trading signals for educational and informational purposes only. 
            We are NOT providing:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Investment advice or financial planning services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Guarantees of profit or protection from losses" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Personalized investment recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Professional financial advisory services" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            All trading signals are based on systematic analysis and should not be considered as investment advice. 
            You should conduct your own research and consider your financial situation before making any trading decisions.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Risk Acknowledgment
          </Typography>
          <Typography variant="body1" paragraph>
            By using our service, you acknowledge and understand that:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Trading involves substantial risk of loss" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Past performance does not indicate future results" />
            </ListItem>
            <ListItem>
              <ListItemText primary="You may lose part or all of your investment" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Market volatility can result in rapid and substantial losses" />
            </ListItem>
            <ListItem>
              <ListItemText primary="You are solely responsible for your trading decisions" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. User Responsibilities
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Provide accurate and current information during registration" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Maintain the security of your account credentials" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Use the service only for lawful purposes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Conduct your own due diligence before making trading decisions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comply with all applicable laws and regulations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not share or redistribute our signals without permission" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            7. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TURTELLI SHALL NOT BE LIABLE FOR:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Any trading losses or investment losses" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Missed opportunities or delayed signals" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Technical errors or service interruptions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Indirect, incidental, or consequential damages" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Any damages exceeding the amount paid for the service" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            8. Service Availability
          </Typography>
          <Typography variant="body1" paragraph>
            We strive to provide reliable service, but we do not guarantee:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Uninterrupted or error-free service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Accuracy or completeness of all signals" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Availability during maintenance periods" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Protection against technical failures" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            Signals are generated daily at 5 PM ET (10 PM UTC). Delivery times may vary due to technical factors.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            9. Cancellation and Refunds
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="You may cancel your subscription at any time" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cancellations take effect at the end of the current billing period" />
            </ListItem>
            <ListItem>
              <ListItemText primary="No refunds for partial months or unused signals" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Free trial signals cannot be refunded" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Refunds may be considered for technical issues on a case-by-case basis" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            10. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content, including trading signals, algorithms, website design, and documentation, 
            is the intellectual property of Turtelli. You may not:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Copy, distribute, or reproduce our signals commercially" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Reverse engineer our signal generation methods" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Create derivative works based on our service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Use our trademarks or brand without permission" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            11. Privacy and Data Protection
          </Typography>
          <Typography variant="body1" paragraph>
            Your privacy is important to us. Please review our Privacy Policy to understand how we 
            collect, use, and protect your information. By using our service, you consent to our 
            data practices as described in the Privacy Policy.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            12. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to terminate or suspend your account at any time for:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Violation of these Terms and Conditions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Fraudulent or abusive behavior" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Non-payment of subscription fees" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Any other reason at our sole discretion" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            13. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms and Conditions are governed by and construed in accordance with applicable laws. 
            Any disputes arising from the use of this service shall be subject to the exclusive jurisdiction 
            of the competent courts.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            14. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms and Conditions at any time. Material changes 
            will be communicated via email or prominent notice on our website. Continued use of the 
            service after changes constitutes acceptance of the new terms.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            15. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For questions about these Terms and Conditions, please contact us:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Email: support@turtelli.com" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Legal: legal@turtelli.com" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Website: https://turtelli.com" />
            </ListItem>
          </List>
        </Box>

        <Divider style={{ margin: '24px 0' }} />
        
        <Alert severity="info">
          <Typography variant="body2">
            <strong>By using Turtelli, you acknowledge that you have read, understood, and agree to these 
            Terms and Conditions and our Privacy Policy.</strong>
          </Typography>
        </Alert>
        
        <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: 16 }}>
          © 2025 Turtelli. All rights reserved.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms; 