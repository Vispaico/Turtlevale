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
}));

const Privacy = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" style={{ paddingTop: 64, paddingBottom: 32 }}>
      <Paper className={classes.paper}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          🐢 Turtelli Privacy Policy
        </Typography>
        
        <Typography variant="body2" className={classes.lastUpdated} align="center" gutterBottom>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider style={{ margin: '24px 0' }} />

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Information We Collect
          </Typography>
          
          <Typography variant="h6" component="h3" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body1" paragraph>
            When you create an account or use our services, we may collect:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Email address (required for account creation and notifications)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Display name (optional, for personalization)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Profile picture (if signing up with Google)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Subscription preferences and payment information" />
            </ListItem>
          </List>

          <Typography variant="h6" component="h3" gutterBottom>
            Usage Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Trading signal interactions and portfolio performance" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Website usage patterns and analytics via Google Analytics" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Device information and IP address" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Browser type and language preferences" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Deliver daily trading signals via email notifications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Manage your subscription and account preferences" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Track portfolio performance and trading history" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide customer support and technical assistance" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Improve our services through analytics and user feedback" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Send important service updates and security notifications" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. Data Storage and Security
          </Typography>
          <Typography variant="body1" paragraph>
            Your data is stored securely using Google Cloud Firestore with industry-standard encryption. 
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction.
          </Typography>
          <Typography variant="body1" paragraph>
            All communications between your device and our servers are encrypted using HTTPS/TLS protocols.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            We use the following third-party services that may collect your information:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Google Analytics" 
                secondary="For website usage analytics and performance monitoring"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Google Firebase" 
                secondary="For authentication, database storage, and hosting"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="SendGrid" 
                secondary="For email delivery of trading signals and notifications"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Alpha Vantage" 
                secondary="For real-time market data (no personal data shared)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="AdSense/PropellerAds" 
                secondary="For displaying relevant advertisements"
              />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell, trade, or rent your personal information to third parties. We may share your 
            information only in the following circumstances:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="With your explicit consent" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To comply with legal obligations or court orders" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To protect our rights, property, or safety" />
            </ListItem>
            <ListItem>
              <ListItemText primary="In connection with a business merger or acquisition" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the following rights regarding your personal data:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Access: Request a copy of your personal data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Rectification: Correct inaccurate or incomplete data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Erasure: Request deletion of your personal data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Portability: Receive your data in a structured format" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Objection: Object to processing for marketing purposes" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            To exercise any of these rights, please contact us at privacy@turtelli.com.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            7. Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to improve your experience on our website. 
            This includes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Essential cookies for website functionality" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Analytics cookies to understand user behavior" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Preference cookies to remember your settings" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Advertising cookies for personalized ads" />
            </ListItem>
          </List>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            8. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our services are not intended for individuals under the age of 18. We do not knowingly 
            collect personal information from children under 18. If you are a parent or guardian and 
            believe your child has provided us with personal information, please contact us immediately.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            9. International Transfers
          </Typography>
          <Typography variant="body1" paragraph>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your data during international transfers.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            10. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new Privacy Policy on this page and updating the "last updated" date.
          </Typography>
        </Box>

        <Box className={classes.section}>
          <Typography variant="h5" component="h2" gutterBottom>
            11. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Email: privacy@turtelli.com" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Support: support@turtelli.com" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Website: https://turtelli.com" />
            </ListItem>
          </List>
        </Box>

        <Divider style={{ margin: '24px 0' }} />
        
        <Typography variant="body2" color="textSecondary" align="center">
          © 2025 Turtelli. All rights reserved.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Privacy; 