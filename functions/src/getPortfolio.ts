import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getPortfolio = functions.https.onRequest(async (req, res) => {
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
    const userId = req.query.userId as string;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID required' });
      return;
    }

    // Get user's portfolio document
    const portfolioRef = db.collection('portfolios').doc(userId);
    const portfolioDoc = await portfolioRef.get();
    
    if (!portfolioDoc.exists) {
      // Create initial portfolio based on recent signals
      const initialPortfolio = await createInitialPortfolio(db, userId);
      await portfolioRef.set(initialPortfolio);
      
      res.status(200).json(initialPortfolio);
      return;
    }
    
    const portfolioData = portfolioDoc.data();
    
    // Update portfolio with latest market prices (simulated)
    const updatedPortfolio = await updatePortfolioValues(portfolioData);
    
    res.status(200).json(updatedPortfolio);
    
  } catch (error) {
    console.error('Error getting portfolio:', error);
    res.status(500).json({
      error: 'Failed to fetch portfolio',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

async function createInitialPortfolio(db: any, userId: string) {
  // Get recent signals to create positions
  const signalsSnapshot = await db.collection('signals')
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get();
  
  const positions: any[] = [];
  const tradeHistory: any[] = [];
  let totalValue = 10000; // Starting capital
  let totalPnL = 0;
  
  if (!signalsSnapshot.empty) {
    // Create positions from recent signals
    const signals = signalsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    signals.slice(0, 7).forEach((signal: any, index: number) => {
      const positionSize = totalValue * 0.02; // 2% risk per position
      const quantity = Math.floor(positionSize / signal.entry);
      const currentPrice = signal.entry * (1 + (Math.random() - 0.5) * 0.05); // Simulate price movement
      const pnl = (currentPrice - signal.entry) * quantity * (signal.type === 'buy' ? 1 : -1);
      
      positions.push({
        symbol: signal.symbol,
        type: signal.type,
        entryPrice: signal.entry,
        currentPrice: currentPrice,
        quantity: quantity,
        pnl: pnl,
        pnlPercent: ((currentPrice - signal.entry) / signal.entry) * 100 * (signal.type === 'buy' ? 1 : -1),
        market: signal.market,
        entryTime: signal.timestamp,
        stopLoss: signal.stopLoss,
        target: signal.target
      });
      
      totalPnL += pnl;
    });
    
    // Create some closed trades for history
    signals.slice(7, 15).forEach((signal: any, index: number) => {
      const positionSize = totalValue * 0.02;
      const quantity = Math.floor(positionSize / signal.entry);
      const exitPrice = signal.entry * (1 + (Math.random() - 0.3) * 0.15); // Random exit
      const pnl = (exitPrice - signal.entry) * quantity * (signal.type === 'buy' ? 1 : -1);
      const exitTime = new Date(new Date(signal.timestamp).getTime() + (1 + Math.random() * 5) * 24 * 60 * 60 * 1000);
      
      tradeHistory.push({
        symbol: signal.symbol,
        type: signal.type,
        entryPrice: signal.entry,
        exitPrice: exitPrice,
        quantity: quantity,
        pnl: pnl,
        pnlPercent: ((exitPrice - signal.entry) / signal.entry) * 100 * (signal.type === 'buy' ? 1 : -1),
        market: signal.market,
        entryTime: signal.timestamp,
        exitTime: exitTime.toISOString(),
        status: 'closed'
      });
    });
  } else {
    // If no signals, create simulated portfolio
    positions.push(
      {
        symbol: 'SPY',
        type: 'buy',
        entryPrice: 425.50,
        currentPrice: 428.75,
        quantity: 23,
        pnl: 74.75,
        pnlPercent: 0.76,
        market: 'ETF',
        entryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        stopLoss: 420.25,
        target: 435.00
      },
      {
        symbol: 'AAPL',
        type: 'buy',
        entryPrice: 185.75,
        currentPrice: 187.25,
        quantity: 10,
        pnl: 15.00,
        pnlPercent: 0.81,
        market: 'Stock',
        entryTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        stopLoss: 182.50,
        target: 192.00
      }
    );
    
    tradeHistory.push(
      {
        symbol: 'NVDA',
        type: 'buy',
        entryPrice: 495.25,
        exitPrice: 510.50,
        quantity: 4,
        pnl: 61.00,
        pnlPercent: 3.08,
        market: 'Stock',
        entryTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'closed'
      }
    );
    
    totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  }
  
  const todaysPnL = totalPnL * 0.3; // Simulate today's portion
  
  return {
    userId,
    totalValue: totalValue + totalPnL,
    totalPnL,
    todaysPnL,
    todaysPnLPercent: (todaysPnL / totalValue) * 100,
    activePositions: positions,
    tradeHistory: tradeHistory.sort((a, b) => new Date(b.exitTime || b.entryTime).getTime() - new Date(a.exitTime || a.entryTime).getTime()),
    lastUpdated: new Date().toISOString()
  };
}

async function updatePortfolioValues(portfolioData: any) {
  // Simulate price updates for active positions
  const updatedPositions = portfolioData.activePositions.map((position: any) => {
    // Simulate small price movements (±2%)
    const priceChange = (Math.random() - 0.5) * 0.04;
    const newPrice = position.currentPrice * (1 + priceChange);
    const newPnL = (newPrice - position.entryPrice) * position.quantity * (position.type === 'buy' ? 1 : -1);
    
    return {
      ...position,
      currentPrice: newPrice,
      pnl: newPnL,
      pnlPercent: ((newPrice - position.entryPrice) / position.entryPrice) * 100 * (position.type === 'buy' ? 1 : -1)
    };
  });
  
  const totalPnL = updatedPositions.reduce((sum: number, pos: any) => sum + pos.pnl, 0);
  const totalValue = 10000 + totalPnL; // Starting capital + PnL
  
  return {
    ...portfolioData,
    activePositions: updatedPositions,
    totalValue,
    totalPnL,
    lastUpdated: new Date().toISOString()
  };
} 