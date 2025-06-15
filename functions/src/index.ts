import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = require('../turtletrader-295e8-80c659d3495d.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'turtletrader-295e8',
});

import { manualGenerateSignals, scheduledGenerateSignals } from './generateSignals';
import { sendDailySignals } from './sendEmails';
import { checkSubscription } from './checkSubscription';
import { simulateTrades, closeMaturedTrades } from './simulateTrades';

// Health check endpoint
export const healthCheck = functions.https.onRequest((req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export all functions with configurations
export const manualGenerateSignalsWithConfig = functions.runWith({
  timeoutSeconds: 540, // 9 minutes
  memory: '1GB'
}).https.onRequest(manualGenerateSignals);

export {
  scheduledGenerateSignals,
  sendDailySignals,
  checkSubscription,
  simulateTrades,
  closeMaturedTrades
};