import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getSignals = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const db = admin.firestore();
    
    // Get recent signals (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const signalsSnapshot = await db.collection('signals')
      .where('timestamp', '>=', sevenDaysAgo)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    
    if (signalsSnapshot.empty) {
      // If no signals in database, return simulated signals based on real tickers
      const simulatedSignals = [
        {
          symbol: 'SPY',
          type: 'buy',
          market: 'ETF',
          entry: 425.50,
          strength: 85,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          stopLoss: 420.25,
          target: 435.00,
          atr: 3.25
        },
        {
          symbol: 'AAPL',
          type: 'buy',
          market: 'Stock',
          entry: 185.75,
          strength: 78,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          stopLoss: 182.50,
          target: 192.00,
          atr: 2.85
        },
        {
          symbol: 'EURUSD',
          type: 'sell',
          market: 'Forex',
          entry: 1.0875,
          strength: 72,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          stopLoss: 1.0925,
          target: 1.0805,
          atr: 0.0045
        },
        {
          symbol: 'BTCUSD',
          type: 'buy',
          market: 'Crypto',
          entry: 42500,
          strength: 82,
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          stopLoss: 41000,
          target: 45500,
          atr: 1250
        }
      ];
      
      res.status(200).json({
        signals: simulatedSignals,
        count: simulatedSignals.length,
        source: 'simulated',
        message: 'Displaying simulated signals. Real signals will be generated at 5:00 PM ET daily.'
      });
      return;
    }
    
    const signals = signalsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp
    }));
    
    res.status(200).json({
      signals,
      count: signals.length,
      source: 'database'
    });
    
  } catch (error) {
    console.error('Error getting signals:', error);
    res.status(500).json({
      error: 'Failed to fetch signals',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}); 