import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const alphaVantageKey = process.env.ALPHAVANTAGE_PREMIUM_KEY || 'DUMMY_KEY_FOR_TESTING';

const tickers = [
  { symbol: 'SPY', is_us_stock: true },
  { symbol: 'QQQ', is_us_stock: true },
  { symbol: 'DIA', is_us_stock: true },
  { symbol: 'IWM', is_us_stock: true },
  { symbol: 'VTI', is_us_stock: true },
  { symbol: 'EEM', is_us_stock: true },
  { symbol: 'AAPL', is_us_stock: true },
  { symbol: 'MSFT', is_us_stock: true },
  { symbol: 'NVDA', is_us_stock: true },
  { symbol: 'AMZN', is_us_stock: true },
  { symbol: 'TSLA', is_us_stock: true },
  { symbol: 'GOOGL', is_us_stock: true },
];

const getAlphaVantageUrl = (symbol: string, isUsStock: boolean) => {
  const entitlement = isUsStock ? '&entitlement=delayed' : '';
  return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${alphaVantageKey}${entitlement}`;
};

const calculateSignals = (data: any) => {
  const timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) return null;
  const dates = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const latestClose = parseFloat(timeSeries[dates[0]]['4. close'] || '0');
  const high20 = Math.max(...dates.slice(0, 20).map(date => parseFloat(timeSeries[date]['2. high'] || '0')));
  const low55 = Math.min(...dates.slice(0, 55).map(date => parseFloat(timeSeries[date]['3. low'] || '0')));

  let action = 'hold';
  let entry = latestClose;
  let stopLoss = 0;
  let target = 0;

  if (latestClose > high20) {
    action = 'buy';
    stopLoss = low55;
    target = latestClose * 1.2;
  } else if (latestClose < low55) {
    action = 'sell';
    stopLoss = high20;
    target = latestClose * 0.8;
  }

  return { action, entry, stopLoss, target };
};

const fetchAndStoreSignals = async () => {
  for (const ticker of tickers) {
    try {
      const url = getAlphaVantageUrl(ticker.symbol, ticker.is_us_stock);
      const response = await axios.get(url);
      console.log(`Fetching ${ticker.symbol}: ${JSON.stringify(response.data)}`);
      const signals = calculateSignals(response.data);

      if (signals) {
        await db.collection('signals').add({
          ticker: ticker.symbol,
          ...signals,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error: any) {
      console.error(`Error for ${ticker.symbol}: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
  }
};

export const generateSignals = functions.pubsub.schedule('*/10 * * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Generating signals...');
    await fetchAndStoreSignals();
    console.log('Signal generation complete.');
  });

export const manualGenerateSignals = functions.https.onRequest(async (req, res) => {
  console.log('Manual signal generation triggered.');
  await fetchAndStoreSignals();
  res.status(200).send('Signal generation started.');
});

export const simulateTrade = functions.firestore.document('signals/{signalId}')
  .onCreate(async (snap, context) => {
    const signal = snap.data();
    if (!signal) {
      console.error('No signal data found.');
      return;
    }
    const { ticker, action, entry } = signal;

    const portfolios = [
      { name: 'main', balance: 10000 },
      { name: 'small', balance: 800 },
    ];

    for (const portfolio of portfolios) {
      const positionSize = portfolio.balance * 0.01; // 1% risk
      const quantity = Math.floor(positionSize / entry);
      const igCosts = ticker.startsWith('SPY') || ticker.startsWith('QQQ') || ticker.startsWith('DIA') || ticker.startsWith('IWM') || ticker.startsWith('VTI') || ticker.startsWith('EEM')
        ? 2.4 // Spread for indices
        : Math.max(entry * quantity * 0.0005, 15); // 0.05% or $15 minimum for stocks

      if (quantity > 0) {
        await db.collection('simulated_trades').add({
          ticker,
          action,
          quantity,
          entry_price: entry,
          current_price: entry,
          pnl: 0,
          igCosts,
          portfolio_type: portfolio.name,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        await db.collection('portfolios').doc(portfolio.name).set({
          [`${portfolio.name}_balance`]: portfolio.balance - igCosts,
        }, { merge: true });
      }
    }
  });