import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const db = admin.firestore();

interface TurtleSignal {
  ticker: string;
  market: string;
  action: 'BUY' | 'SELL';
  price: number;
  stopLoss?: number;
  target?: number;
  timestamp: admin.firestore.Timestamp;
  indicators: {
    rsi?: number;
    macd?: number;
    sma20?: number;
    sma55?: number;
  };
}

// Sample tickers for testing
const SAMPLE_TICKERS = {
  indices: ['SPY', 'QQQ', 'IWM', 'VTI'],
  stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'],
  forex: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'],
  crypto: ['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD']
};

export const generateSignals = functions.pubsub.schedule('0 22 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting signal generation at 5 PM ET (10 PM UTC)');
    
    try {
      const config = functions.config();
      const alphaVantageKey = config.alphavantage?.premium_key || config.alphavantage?.free_key;
      
      if (!alphaVantageKey) {
        console.error('Alpha Vantage API key not configured');
        return;
      }

      const signals: TurtleSignal[] = [];

      // Generate signals for each market
      for (const [market, tickers] of Object.entries(SAMPLE_TICKERS)) {
        for (const ticker of tickers) {
          try {
            const signal = await generateSignalForTicker(ticker, market, alphaVantageKey);
            if (signal) {
              signals.push(signal);
            }
            
            // Rate limiting - wait between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Error generating signal for ${ticker}:`, error);
          }
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

      // Trigger notification sending
      await triggerNotifications(signals);

    } catch (error) {
      console.error('Error in signal generation:', error);
      throw error;
    }
  });

async function generateSignalForTicker(ticker: string, market: string, apiKey: string): Promise<TurtleSignal | null> {
  try {
    // Check if it's a US stock (needs delayed entitlement)
    const isUSStock = market === 'stocks' || market === 'indices';
    const entitlementParam = isUSStock ? '&entitlement=delayed' : '';
    
    // Fetch daily price data
    const priceUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}${entitlementParam}`;
    const priceResponse = await axios.get(priceUrl);
    
    if (priceResponse.data['Error Message'] || priceResponse.data['Note']) {
      console.log(`API limit or error for ${ticker}:`, priceResponse.data);
      return null;
    }

    const timeSeries = priceResponse.data['Time Series (Daily)'];
    if (!timeSeries) {
      console.log(`No time series data for ${ticker}`);
      return null;
    }

    // Get recent prices for analysis
    const dates = Object.keys(timeSeries).sort().reverse();
    const recentPrices = dates.slice(0, 60).map(date => ({
      date,
      close: parseFloat(timeSeries[date]['4. close']),
      high: parseFloat(timeSeries[date]['2. high']),
      low: parseFloat(timeSeries[date]['3. low']),
    }));

    if (recentPrices.length < 55) {
      console.log(`Insufficient data for ${ticker}`);
      return null;
    }

    // Calculate Turtle Trading signals
    const signal = calculateTurtleSignal(ticker, market, recentPrices);
    return signal;

  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    return null;
  }
}

function calculateTurtleSignal(ticker: string, market: string, prices: any[]): TurtleSignal | null {
  const currentPrice = prices[0].close;
  
  // Calculate 20-day and 55-day highs/lows
  const period20 = prices.slice(0, 20);
  const period55 = prices.slice(0, 55);
  
  const high20 = Math.max(...period20.map(p => p.high));
  const low20 = Math.min(...period20.map(p => p.low));
  
  // Calculate ATR for position sizing and stops
  const atr = calculateATR(prices.slice(0, 14));
  
  // Turtle Trading rules
  let action: 'BUY' | 'SELL' | null = null;
  let stopLoss: number | undefined;
  let target: number | undefined;
  
  // Entry signals
  if (currentPrice > high20) {
    action = 'BUY';
    stopLoss = currentPrice - (2 * atr);
    target = currentPrice + (3 * atr);
  } else if (currentPrice < low20) {
    action = 'SELL';
    stopLoss = currentPrice + (2 * atr);
    target = currentPrice - (3 * atr);
  }
  
  // Only generate signal if we have a clear action
  if (!action) {
    return null;
  }
  
  // Calculate some basic indicators
  const sma20 = period20.reduce((sum, p) => sum + p.close, 0) / period20.length;
  const sma55 = period55.reduce((sum, p) => sum + p.close, 0) / period55.length;
  
  return {
    ticker,
    market,
    action,
    price: currentPrice,
    stopLoss,
    target,
    timestamp: admin.firestore.Timestamp.now(),
    indicators: {
      sma20: Math.round(sma20 * 100) / 100,
      sma55: Math.round(sma55 * 100) / 100,
    }
  };
}

function calculateATR(prices: any[]): number {
  if (prices.length < 2) return 0;
  
  let trSum = 0;
  for (let i = 1; i < prices.length; i++) {
    const high = prices[i].high;
    const low = prices[i].low;
    const prevClose = prices[i - 1].close;
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    
    trSum += tr;
  }
  
  return trSum / (prices.length - 1);
}

async function triggerNotifications(signals: TurtleSignal[]): Promise<void> {
  // This would trigger the notification function
  console.log(`Triggering notifications for ${signals.length} new signals`);
  // Implementation will call the sendNotifications function
} 