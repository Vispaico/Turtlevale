import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getTickerBySymbol } from './markets';

const db = admin.firestore();

interface SimulatedTrade {
  tradeId: string;
  ticker: string;
  market: string;
  portfolioType: 'main' | 'small'; // $10,000 vs $800
  entryPrice: number;
  exitPrice?: number;
  positionSize: number;
  spreadCost: number;
  commission: number;
  profitLoss: number;
  timestamp: admin.firestore.Timestamp;
  status: 'open' | 'closed';
  entryReason: string;
  exitReason?: string;
}

export const simulateTrades = functions.pubsub.schedule('10 22 * * *') // 10 minutes after signals
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting trade simulation process');
    
    try {
      // Get today's signals
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const signalsSnapshot = await db.collection('signals')
        .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(today))
        .get();

      if (signalsSnapshot.empty) {
        console.log('No signals found for today');
        return;
      }

      const signals = signalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Process signals for both portfolio types
      for (const signal of signals) {
        await processSignalForPortfolios(signal);
      }

      // Update portfolio balances
      await updatePortfolioBalances();

      console.log(`Trade simulation completed for ${signals.length} signals`);

    } catch (error) {
      console.error('Error in trade simulation:', error);
      throw error;
    }
  });

async function processSignalForPortfolios(signal: any): Promise<void> {
  const ticker = getTickerBySymbol(signal.ticker);
  if (!ticker) {
    console.error(`Ticker not found: ${signal.ticker}`);
    return;
  }

  // Process for both portfolio types
  await createSimulatedTrade(signal, ticker, 'main', 10000);
  await createSimulatedTrade(signal, ticker, 'small', 800);
}

async function createSimulatedTrade(
  signal: any, 
  ticker: any, 
  portfolioType: 'main' | 'small', 
  portfolioBalance: number
): Promise<void> {
  
  // Calculate position size (2% risk)
  const riskAmount = portfolioBalance * 0.02;
  const atr = calculateSimulatedATR(signal.price);
  const stopDistance = Math.abs(signal.price - (signal.stopLoss || signal.price * 0.98));
  const positionSize = Math.floor(riskAmount / stopDistance);

  // Calculate costs based on IG Trading spreads/commissions
  let spreadCost = 0;
  let commission = 0;

  if (ticker.market === 'stocks') {
    commission = Math.max(positionSize * ticker.commission, ticker.minCommission || 15);
  } else {
    // Forex, Indices, Crypto use spreads
    spreadCost = positionSize * ticker.spread;
  }

  const totalCosts = spreadCost + commission;

  // Create the trade record
  const trade: SimulatedTrade = {
    tradeId: `${signal.ticker}_${portfolioType}_${Date.now()}`,
    ticker: signal.ticker,
    market: signal.market,
    portfolioType,
    entryPrice: signal.price,
    positionSize,
    spreadCost,
    commission,
    profitLoss: -totalCosts, // Start with negative due to costs
    timestamp: admin.firestore.Timestamp.now(),
    status: 'open',
    entryReason: `Turtle ${signal.action} signal - 20-day breakout`
  };

  // Store in Firestore
  await db.collection('simulated_trades').doc(trade.tradeId).set(trade);
  
  console.log(`Created simulated trade: ${trade.tradeId}`);
}

async function updatePortfolioBalances(): Promise<void> {
  // Calculate current balances for each market and portfolio type
  const markets = ['indices', 'stocks', 'forex', 'crypto', 'all-markets'];
  
  for (const market of markets) {
    for (const portfolioType of ['main', 'small']) {
      const startingBalance = portfolioType === 'main' ? 10000 : 800;
      
      // Get all trades for this market and portfolio type
      let tradesQuery = db.collection('simulated_trades')
        .where('portfolioType', '==', portfolioType);
      
      if (market !== 'all-markets') {
        tradesQuery = tradesQuery.where('market', '==', market);
      }
      
      const tradesSnapshot = await tradesQuery.get();
      
      // Calculate total P&L
      let totalPnL = 0;
      let openPositions = 0;
      let closedTrades = 0;
      
      tradesSnapshot.docs.forEach(doc => {
        const trade = doc.data() as SimulatedTrade;
        totalPnL += trade.profitLoss;
        
        if (trade.status === 'open') {
          openPositions++;
        } else {
          closedTrades++;
        }
      });
      
      const currentBalance = startingBalance + totalPnL;
      
      // Update portfolio document
      const portfolioData = {
        [`${portfolioType}_balance`]: currentBalance,
        [`${portfolioType}_pnl`]: totalPnL,
        [`${portfolioType}_open_positions`]: openPositions,
        [`${portfolioType}_closed_trades`]: closedTrades,
        lastUpdated: admin.firestore.Timestamp.now()
      };
      
      await db.collection('portfolios').doc(market).set(portfolioData, { merge: true });
      
      console.log(`Updated ${market} ${portfolioType} portfolio: $${currentBalance.toFixed(2)}`);
    }
  }
}

function calculateSimulatedATR(price: number): number {
  // Simplified ATR calculation for simulation
  return price * 0.02; // 2% of price as ATR estimate
}

// Function to close trades based on stop loss or target
export const closeMaturedTrades = functions.pubsub.schedule('0 23 * * *') // 11 PM UTC daily
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Checking for trades to close');
    
    try {
      const openTradesSnapshot = await db.collection('simulated_trades')
        .where('status', '==', 'open')
        .get();

      for (const doc of openTradesSnapshot.docs) {
        const trade = doc.data() as SimulatedTrade;
        
        // Simulate price movement and check if trade should be closed
        const currentPrice = simulateCurrentPrice(trade);
        const shouldClose = shouldCloseTrade(trade, currentPrice);
        
        if (shouldClose.close) {
          await closeTrade(doc.id, trade, currentPrice, shouldClose.reason);
        }
      }
      
      // Update portfolio balances after closing trades
      await updatePortfolioBalances();
      
    } catch (error) {
      console.error('Error closing matured trades:', error);
    }
  });

function simulateCurrentPrice(trade: SimulatedTrade): number {
  // Simulate realistic price movement (±5% from entry)
  const daysSinceEntry = (Date.now() - trade.timestamp.toMillis()) / (1000 * 60 * 60 * 24);
  const volatility = Math.min(daysSinceEntry * 0.01, 0.05); // Max 5% movement
  const direction = Math.random() - 0.5; // Random direction
  
  return trade.entryPrice * (1 + direction * volatility);
}

function shouldCloseTrade(trade: SimulatedTrade, currentPrice: number): { close: boolean; reason?: string } {
  const ticker = getTickerBySymbol(trade.ticker);
  if (!ticker) return { close: false };
  
  // Check if trade has been open too long (max 30 days)
  const daysSinceEntry = (Date.now() - trade.timestamp.toMillis()) / (1000 * 60 * 60 * 24);
  if (daysSinceEntry > 30) {
    return { close: true, reason: 'Time-based exit (30 days)' };
  }
  
  // Random close (simulate various exit conditions)
  if (Math.random() < 0.1) { // 10% chance daily
    return { close: true, reason: 'Market conditions exit' };
  }
  
  return { close: false };
}

async function closeTrade(docId: string, trade: SimulatedTrade, exitPrice: number, reason: string): Promise<void> {
  const priceDiff = exitPrice - trade.entryPrice;
  const tradePnL = priceDiff * trade.positionSize;
  const finalPnL = tradePnL - trade.spreadCost - trade.commission;
  
  await db.collection('simulated_trades').doc(docId).update({
    exitPrice,
    profitLoss: finalPnL,
    status: 'closed',
    exitReason: reason,
    closedAt: admin.firestore.Timestamp.now()
  });
  
  console.log(`Closed trade ${trade.tradeId}: P&L $${finalPnL.toFixed(2)}`);
} 