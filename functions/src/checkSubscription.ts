import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const checkSubscription = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { userId, email, market } = req.query;
    
    if (!userId && !email) {
      res.status(400).json({ error: 'User ID or email required' });
      return;
    }

    // VIP access for testing account
    if (email === 'niels@vispaico.com' || email === 'niels@vispaic.com') {
      res.status(200).json({
        hasAccess: true,
        subscription: {
          type: 'full-access',
          markets: ['indices', 'stocks', 'forex', 'crypto'],
          isActive: true,
          vip: true
        },
        message: 'VIP access granted'
      });
      return;
    }

    // Get user subscription data
    let userDoc;
    if (userId) {
      userDoc = await db.collection('users').doc(userId as string).get();
    } else if (email) {
      const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
      if (!userQuery.empty) {
        userDoc = userQuery.docs[0];
      }
    }

    if (!userDoc || !userDoc.exists) {
      res.status(404).json({ 
        hasAccess: false, 
        error: 'User not found',
        subscription: { type: 'none', markets: [], isActive: false }
      });
      return;
    }

    const userData = userDoc.data();
    const subscription = userData.subscription || { 
      type: 'free', 
      markets: [], 
      isActive: false,
      signalsUsed: 0,
      signalsLimit: 6
    };

    // Check access based on subscription type and market
    let hasAccess = false;
    let accessDetails = {};

    if (subscription.type === 'full-access' && subscription.isActive) {
      hasAccess = true;
      accessDetails = { unlimited: true, allMarkets: true };
    } else if (subscription.type === 'individual' && subscription.isActive) {
      hasAccess = market ? subscription.markets.includes(market) : true;
      accessDetails = { markets: subscription.markets };
    } else if (subscription.type === 'free') {
      // Free users get trial signals
      const signalsUsed = subscription.signalsUsed || 0;
      const signalsLimit = subscription.signalsLimit || 6;
      hasAccess = signalsUsed < signalsLimit;
      accessDetails = { 
        trial: true, 
        signalsUsed, 
        signalsLimit,
        remainingSignals: Math.max(0, signalsLimit - signalsUsed)
      };
    }

    res.status(200).json({
      hasAccess,
      subscription: {
        ...subscription,
        ...accessDetails
      },
      message: hasAccess ? 'Access granted' : 'Access denied - upgrade required'
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({
      hasAccess: false,
      error: 'Failed to check subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}); 