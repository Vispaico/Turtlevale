import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { getAllTickers, getTickerBySymbol, MarketTicker } from './markets';
import { MarketType, TurtleSignal } from './types';

const db = admin.firestore();

// Market configuration
const MARKETS = {
  INDICES: {
    name: 'Indices',
    tickers: [
      { symbol: 'SPY', name: 'S&P 500 ETF', market: 'indices' as MarketType, isUSStock: true, alphaVantageSymbol: 'SPY', spread: 0.8, commission: 0 },
      { symbol: 'QQQ', name: 'NASDAQ 100 ETF', market: 'indices' as MarketType, isUSStock: true, alphaVantageSymbol: 'QQQ', spread: 0.8, commission: 0 },
      { symbol: 'DIA', name: 'Dow Jones ETF', market: 'indices' as MarketType, isUSStock: true, alphaVantageSymbol: 'DIA', spread: 0.8, commission: 0 },
      { symbol: 'IWM', name: 'Russell 2000 ETF', market: 'indices' as MarketType, isUSStock: true, alphaVantageSymbol: 'IWM', spread: 0.8, commission: 0 },
      { symbol: 'VTI', name: 'Total Stock Market ETF', market: 'indices' as MarketType, isUSStock: true, alphaVantageSymbol: 'VTI', spread: 0.8, commission: 0 },
      { symbol: 'EEM', name: 'Emerging Markets ETF', market: 'indices' as MarketType, isUSStock: true, alphaVantageSymbol: 'EEM', spread: 0.8, commission: 0 },
      { symbol: '^GDAXI', name: 'DAX Index', market: 'indices' as MarketType, isUSStock: false, alphaVantageSymbol: '^GDAXI', spread: 2.4, commission: 0 },
      { symbol: '^FTSE', name: 'FTSE 100', market: 'indices' as MarketType, isUSStock: false, alphaVantageSymbol: '^FTSE', spread: 2.4, commission: 0 },
      { symbol: '^N225', name: 'Nikkei 225', market: 'indices' as MarketType, isUSStock: false, alphaVantageSymbol: '^N225', spread: 2.4, commission: 0 },
      { symbol: '^HSI', name: 'Hang Seng Index', market: 'indices' as MarketType, isUSStock: false, alphaVantageSymbol: '^HSI', spread: 2.4, commission: 0 }
    ]
  },
  STOCKS: {
    name: 'Stocks',
    tickers: [
      { symbol: 'AAPL', name: 'Apple Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'AAPL', spread: 0, commission: 0.05 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'MSFT', spread: 0, commission: 0.05 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'NVDA', spread: 0, commission: 0.05 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'AMZN', spread: 0, commission: 0.05 },
      { symbol: 'TSLA', name: 'Tesla Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'TSLA', spread: 0, commission: 0.05 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'GOOGL', spread: 0, commission: 0.05 },
      { symbol: 'META', name: 'Meta Platforms Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'META', spread: 0, commission: 0.05 },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'JPM', spread: 0, commission: 0.05 },
      { symbol: 'WMT', name: 'Walmart Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'WMT', spread: 0, commission: 0.05 },
      { symbol: 'V', name: 'Visa Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'V', spread: 0, commission: 0.05 },
      { symbol: 'BAC', name: 'Bank of America Corp.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'BAC', spread: 0, commission: 0.05 },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'XOM', spread: 0, commission: 0.05 },
      { symbol: 'CVX', name: 'Chevron Corporation', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'CVX', spread: 0, commission: 0.05 },
      { symbol: 'PFE', name: 'Pfizer Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'PFE', spread: 0, commission: 0.05 },
      { symbol: 'JNJ', name: 'Johnson & Johnson', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'JNJ', spread: 0, commission: 0.05 },
      { symbol: 'PG', name: 'Procter & Gamble Co.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'PG', spread: 0, commission: 0.05 },
      { symbol: 'KO', name: 'Coca-Cola Company', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'KO', spread: 0, commission: 0.05 },
      { symbol: 'MCD', name: 'McDonald\'s Corporation', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'MCD', spread: 0, commission: 0.05 },
      { symbol: 'DIS', name: 'Walt Disney Company', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'DIS', spread: 0, commission: 0.05 },
      { symbol: 'CSCO', name: 'Cisco Systems Inc.', market: 'stocks' as MarketType, isUSStock: true, alphaVantageSymbol: 'CSCO', spread: 0, commission: 0.05 }
    ]
  }
};

// Flatten all tickers for processing
const ALL_MARKET_TICKERS: MarketTicker[] = [
  ...MARKETS.INDICES.tickers,
  ...MARKETS.STOCKS.tickers
];

// Helper function to get market data from Alpha Vantage
async function getMarketData(ticker: MarketTicker): Promise<any> {
  try {
    const config = functions.config();
    const apiKey = config.alphavantage?.premium_key || config.alphavantage?.free_key;
    
    if (!apiKey) {
      console.error('Alpha Vantage API key not configured');
      return null;
    }

    // Use TIME_SERIES_DAILY_ADJUSTED for all tickers
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker.alphaVantageSymbol}&apikey=${apiKey}&outputsize=compact${ticker.isUSStock ? '&entitlement=delayed' : ''}`;
    
    console.log(`Fetching data for ${ticker.symbol} from: ${url}`);
    const response = await axios.get(url);
    
    if (response.data['Error Message']) {
      console.error(`Alpha Vantage API error for ${ticker.symbol}:`, response.data['Error Message']);
      return null;
    }

    if (response.data['Note']) {
      console.warn(`Alpha Vantage API note for ${ticker.symbol}:`, response.data['Note']);
    }

    console.log(`Fetched ${ticker.symbol}: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${ticker.symbol}: ${error.message}`);
    return null;
  }
}

// Helper function to calculate ATR
function calculateATR(high: number[], low: number[], close: number[], period: number = 14): number {
  const trueRanges: number[] = [];
  
  for (let i = 1; i < close.length; i++) {
    const tr = Math.max(
      high[i] - low[i],
      Math.abs(high[i] - close[i - 1]),
      Math.abs(low[i] - close[i - 1])
    );
    trueRanges.push(tr);
  }
  
  // Calculate simple moving average of true ranges
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += trueRanges[i];
  }
  
  return sum / period;
}

// Helper function to generate signal for a ticker
async function generateSignalForTicker(ticker: MarketTicker): Promise<TurtleSignal | null> {
  try {
    const data = await getMarketData(ticker);
    if (!data || !data['Time Series (Daily)']) {
      console.error(`No data available for ${ticker.symbol}`);
      return null;
    }

    // Convert time series data to arrays
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort();
    const closes = dates.map(date => parseFloat(timeSeries[date]['4. close']));
    const highs = dates.map(date => parseFloat(timeSeries[date]['2. high']));
    const lows = dates.map(date => parseFloat(timeSeries[date]['3. low']));

    // Calculate 20-day breakout levels
    const breakoutPeriod = 20;
    const currentPrice = closes[0];
    const highestHigh = Math.max(...highs.slice(1, breakoutPeriod + 1));
    const lowestLow = Math.min(...lows.slice(1, breakoutPeriod + 1));

    // Calculate ATR for stop loss and target
    const atr = calculateATR(highs, lows, closes);

    // Generate signal based on breakout
    let action: 'BUY' | 'SELL' | null = null;
    let stopLoss: number | undefined;
    let target: number | undefined;

    if (currentPrice > highestHigh) {
      action = 'BUY';
      stopLoss = currentPrice - (2 * atr);
      target = currentPrice + (3 * atr);
    } else if (currentPrice < lowestLow) {
      action = 'SELL';
      stopLoss = currentPrice + (2 * atr);
      target = currentPrice - (3 * atr);
    }

    if (action) {
      return {
        ticker: ticker.symbol,
        market: ticker.market,
        action,
        price: currentPrice,
        stopLoss,
        target,
        timestamp: admin.firestore.Timestamp.now()
      };
    }

    return null;
  } catch (error) {
    console.error(`Error generating signal for ${ticker.symbol}:`, error);
    return null;
  }
}

// Main signal generation function
async function generateSignals(context: functions.EventContext): Promise<void> {
  try {
    const signals: TurtleSignal[] = [];
    const BATCH_SIZE = 5; // Process 5 tickers at a time
    const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds between batches

    // Split tickers into batches
    for (let i = 0; i < ALL_MARKET_TICKERS.length; i += BATCH_SIZE) {
      const batch = ALL_MARKET_TICKERS.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(ALL_MARKET_TICKERS.length/BATCH_SIZE)}`);
      
      // Process batch in parallel
      const batchPromises = batch.map(async (ticker) => {
        try {
          console.log(`Processing ticker: ${ticker.symbol}`);
          const signal = await generateSignalForTicker(ticker);
          if (signal) {
            signals.push(signal);
            console.log(`Generated signal for ${ticker.symbol}: ${signal.action} at ${signal.price}`);
          }
        } catch (error) {
          console.error(`Error generating signal for ${ticker.symbol}:`, error);
        }
      });

      await Promise.all(batchPromises);

      // Add delay between batches if not the last batch
      if (i + BATCH_SIZE < ALL_MARKET_TICKERS.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    // Store signals in Firestore
    const batch = db.batch();
    signals.forEach(signal => {
      const signalRef = db.collection('signals').doc();
      batch.set(signalRef, signal);
    });

    await batch.commit();
    console.log(`Generated ${signals.length} signals successfully`);

    // Trigger notifications for new signals
    await triggerNotifications(signals);

  } catch (error) {
    console.error('Error in signal generation:', error);
    throw error;
  }
}

// Manual trigger endpoint for admin users
export const manualGenerateSignals = functions.https.onRequest(async (req, res) => {
  try {
    // Verify admin token
    if (req.headers['x-admin-token'] !== functions.config().admin.secret) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Verify admin role
    const adminEmail = 'niels@vispaic.com';
    const adminUser = await db.collection('users')
      .where('email', '==', adminEmail)
      .where('role', '==', 'admin')
      .get();

    if (adminUser.empty) {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }

    await generateSignals({} as functions.EventContext);
    res.status(200).json({ success: true, message: 'Signals generated successfully' });
  } catch (error) {
    console.error('Manual signal generation error:', error);
    res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
});

// Scheduled trigger (every 10 minutes)
export const scheduledGenerateSignals = functions.pubsub
  .schedule('*/10 * * * *')
  .timeZone('UTC')
  .onRun(generateSignals);

async function triggerNotifications(signals: TurtleSignal[]): Promise<void> {
  // This would trigger the notification function
  console.log(`Triggering notifications for ${signals.length} new signals`);
  // Implementation will call the sendNotifications function
} 