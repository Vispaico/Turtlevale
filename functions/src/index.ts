import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

const db = admin.firestore();
const alphaVantageKey = functions.config().alphavantage.key || "QF9ZXY8QXXXXXXXX";

const tickers = [
    // Indices
    { symbol: "SPY", is_us_stock: true },
    { symbol: "QQQ", is_us_stock: true },
    { symbol: "DIA", is_us_stock: true },
    { symbol: "IWM", is_us_stock: true },
    { symbol: "VTI", is_us_stock: true },
    { symbol: "EEM", is_us_stock: true },
    // Stocks
    { symbol: "AAPL", is_us_stock: true },
    { symbol: "MSFT", is_us_stock: true },
    { symbol: "NVDA", is_us_stock: true },
    { symbol: "AMZN", is_us_stock: true },
    { symbol: "TSLA", is_us_stock: true },
    { symbol: "GOOGL", is_us_stock: true },
];

const getAlphaVantageUrl = (symbol: string, isUsStock: boolean) => {
    const entitlement = isUsStock ? "&entitlement=delayed" : "";
    return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${alphaVantageKey}${entitlement}`;
};

const calculateSignals = (data: any) => {
    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
        return null;
    }
    const dates = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const latestDate = dates[0];
    const latestClose = parseFloat(timeSeries[latestDate]["4. close"]);

    const high20 = Math.max(...dates.slice(0, 20).map(date => parseFloat(timeSeries[date]["2. high"])));
    const low20 = Math.min(...dates.slice(0, 20).map(date => parseFloat(timeSeries[date]["3. low"])));
    const high55 = Math.max(...dates.slice(0, 55).map(date => parseFloat(timeSeries[date]["2. high"])));
    const low55 = Math.min(...dates.slice(0, 55).map(date => parseFloat(timeSeries[date]["3. low"])));

    let action = "hold";
    let entry = 0;
    let stopLoss = 0;
    let target = 0;

    if (latestClose > high55) {
        action = "buy";
        entry = latestClose;
        stopLoss = latestClose * 0.9; // 10% stop loss
        target = latestClose * 1.2; // 20% target
    } else if (latestClose < low20) {
        action = "sell";
        entry = latestClose;
        stopLoss = latestClose * 1.1; // 10% stop loss
        target = latestClose * 0.8; // 20% target
    }

    return { action, entry, stopLoss, target };
};

const fetchAndStoreSignals = async () => {
    for (const ticker of tickers) {
        try {
            const url = getAlphaVantageUrl(ticker.symbol, ticker.is_us_stock);
            const response = await axios.get(url);
            console.log(`Fetching ${ticker.symbol}: ${response.data}`);
            const signals = calculateSignals(response.data);

            if (signals) {
                const signal = {
                    ticker: ticker.symbol,
                    ...signals,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                };
                await db.collection("signals").add(signal);
            }
        } catch (error: any) {
            console.error(`Error for ${ticker.symbol}: ${error.message}`);
        }
        // Delay to stay within API limits
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
};

export const generateSignals = functions.pubsub.schedule("*/10 * * * *").onRun(async (context) => {
    console.log("Generating signals...");
    await fetchAndStoreSignals();
    console.log("Signal generation complete.");
});

export const manualGenerateSignals = functions.https.onRequest(async (req, res) => {
    console.log("Manual signal generation triggered.");
    await fetchAndStoreSignals();
    res.status(200).send("Signal generation started.");
});

export const simulateTrade = functions.firestore.document("signals/{signalId}").onCreate(async (snap, context) => {
    const signal = snap.data();
    const { ticker, action, entry } = signal;

    const portfolios = [
        { name: "main", balance: 10000 },
        { name: "small", balance: 800 },
    ];

    for (const portfolio of portfolios) {
        const positionSize = portfolio.balance * 0.01; // 1% of portfolio
        const quantity = Math.floor(positionSize / entry);

        if (quantity > 0) {
            const trade = {
                ticker,
                action,
                quantity,
                entry_price: entry,
                current_price: entry,
                pnl: 0,
                ig_costs: 0, // Simplified for now
                portfolio_type: portfolio.name,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("simulated_trades").add(trade);
        }
    }
});