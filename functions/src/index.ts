import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin SDK
const serviceAccount = require('../turtletrader-295e8-80c659d3495d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'turtletrader-295e8',
});

// Export all functions
export { generateSignals } from './generateSignals';
export { sendNotifications } from './sendNotifications';
export { checkSubscription } from './checkSubscription';
export { simulateTrades } from './simulateTrades';
export { getAdminMetrics } from './getAdminMetrics';

// Health check function
export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Turtlevale Functions'
  });
});