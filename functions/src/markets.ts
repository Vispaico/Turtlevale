export interface MarketTicker {
  symbol: string;
  name: string;
  market: 'indices' | 'stocks' | 'forex' | 'crypto';
  isUSStock: boolean;
  alphaVantageSymbol: string;
  spread: number; // in points/pips
  commission: number; // fixed commission or per-share
  minCommission?: number; // minimum commission for stocks
}

export const MARKET_TICKERS: MarketTicker[] = [
  // Indices (10)
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', market: 'indices', isUSStock: true, alphaVantageSymbol: 'SPY', spread: 0.8, commission: 0 },
  { symbol: 'QQQ', name: 'Invesco QQQ ETF', market: 'indices', isUSStock: true, alphaVantageSymbol: 'QQQ', spread: 1.0, commission: 0 },
  { symbol: 'DIA', name: 'SPDR Dow Jones ETF', market: 'indices', isUSStock: true, alphaVantageSymbol: 'DIA', spread: 1.2, commission: 0 },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', market: 'indices', isUSStock: true, alphaVantageSymbol: 'IWM', spread: 1.5, commission: 0 },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', market: 'indices', isUSStock: true, alphaVantageSymbol: 'VTI', spread: 1.0, commission: 0 },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', market: 'indices', isUSStock: true, alphaVantageSymbol: 'EEM', spread: 2.0, commission: 0 },
  { symbol: 'DAX', name: 'DAX 40 Index', market: 'indices', isUSStock: false, alphaVantageSymbol: 'DAX', spread: 2.4, commission: 0 },
  { symbol: 'FTSE', name: 'FTSE 100 Index', market: 'indices', isUSStock: false, alphaVantageSymbol: 'UKX', spread: 2.0, commission: 0 },
  { symbol: 'NIKKEI', name: 'Nikkei 225 Index', market: 'indices', isUSStock: false, alphaVantageSymbol: 'N225', spread: 2.5, commission: 0 },
  { symbol: 'HSI', name: 'Hang Seng Index', market: 'indices', isUSStock: false, alphaVantageSymbol: 'HSI', spread: 3.0, commission: 0 },

  // Stocks (20)
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'AAPL', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'MSFT', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'NVDA', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'AMZN', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'TSLA', name: 'Tesla Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'TSLA', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'GOOGL', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'META', name: 'Meta Platforms Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'META', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'JPM', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'WMT', name: 'Walmart Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'WMT', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'V', name: 'Visa Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'V', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'BAC', name: 'Bank of America Corp.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'BAC', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'XOM', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'CVX', name: 'Chevron Corporation', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'CVX', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'PFE', name: 'Pfizer Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'PFE', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'JNJ', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'PG', name: 'Procter & Gamble Co.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'PG', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'KO', name: 'The Coca-Cola Company', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'KO', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'MCD', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'DIS', name: 'The Walt Disney Company', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'DIS', spread: 0, commission: 0.03, minCommission: 15 },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', market: 'stocks', isUSStock: true, alphaVantageSymbol: 'CSCO', spread: 0, commission: 0.03, minCommission: 15 },

  // Forex (15)
  { symbol: 'EURUSD', name: 'Euro / US Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'EURUSD', spread: 0.6, commission: 0 },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'GBPUSD', spread: 0.8, commission: 0 },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', market: 'forex', isUSStock: false, alphaVantageSymbol: 'USDJPY', spread: 0.6, commission: 0 },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'AUDUSD', spread: 0.8, commission: 0 },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'USDCAD', spread: 1.0, commission: 0 },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', market: 'forex', isUSStock: false, alphaVantageSymbol: 'USDCHF', spread: 1.0, commission: 0 },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'NZDUSD', spread: 1.2, commission: 0 },
  { symbol: 'EURGBP', name: 'Euro / British Pound', market: 'forex', isUSStock: false, alphaVantageSymbol: 'EURGBP', spread: 1.0, commission: 0 },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', market: 'forex', isUSStock: false, alphaVantageSymbol: 'EURJPY', spread: 1.2, commission: 0 },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', market: 'forex', isUSStock: false, alphaVantageSymbol: 'GBPJPY', spread: 1.5, commission: 0 },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', market: 'forex', isUSStock: false, alphaVantageSymbol: 'AUDJPY', spread: 1.5, commission: 0 },
  { symbol: 'USDSGD', name: 'US Dollar / Singapore Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'USDSGD', spread: 1.8, commission: 0 },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'EURAUD', spread: 2.0, commission: 0 },
  { symbol: 'GBPAUD', name: 'British Pound / Australian Dollar', market: 'forex', isUSStock: false, alphaVantageSymbol: 'GBPAUD', spread: 2.5, commission: 0 },
  { symbol: 'USDZAR', name: 'US Dollar / South African Rand', market: 'forex', isUSStock: false, alphaVantageSymbol: 'USDZAR', spread: 15.0, commission: 0 },

  // Crypto (15)
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'BTC', spread: 40, commission: 0 },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'ETH', spread: 2.5, commission: 0 },
  { symbol: 'XRPUSD', name: 'XRP / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'XRP', spread: 0.6, commission: 0 },
  { symbol: 'ADAUSD', name: 'Cardano / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'ADA', spread: 1.0, commission: 0 },
  { symbol: 'SOLUSD', name: 'Solana / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'SOL', spread: 5.0, commission: 0 },
  { symbol: 'DOGEUSD', name: 'Dogecoin / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'DOGE', spread: 0.8, commission: 0 },
  { symbol: 'DOTUSD', name: 'Polkadot / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'DOT', spread: 2.0, commission: 0 },
  { symbol: 'LINKUSD', name: 'Chainlink / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'LINK', spread: 3.0, commission: 0 },
  { symbol: 'BNBUSD', name: 'Binance Coin / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'BNB', spread: 8.0, commission: 0 },
  { symbol: 'LTCUSD', name: 'Litecoin / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'LTC', spread: 5.0, commission: 0 },
  { symbol: 'MATICUSD', name: 'Polygon / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'MATIC', spread: 1.5, commission: 0 },
  { symbol: 'AVAXUSD', name: 'Avalanche / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'AVAX', spread: 4.0, commission: 0 },
  { symbol: 'ALGOUSD', name: 'Algorand / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'ALGO', spread: 1.0, commission: 0 },
  { symbol: 'XLMUSD', name: 'Stellar / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'XLM', spread: 0.8, commission: 0 },
  { symbol: 'VETUSD', name: 'VeChain / US Dollar', market: 'crypto', isUSStock: false, alphaVantageSymbol: 'VET', spread: 0.5, commission: 0 }
];

export function getTickersByMarket(market: string): MarketTicker[] {
  return MARKET_TICKERS.filter(ticker => ticker.market === market);
}

export function getAllTickers(): MarketTicker[] {
  return MARKET_TICKERS;
}

export function getTickerBySymbol(symbol: string): MarketTicker | undefined {
  return MARKET_TICKERS.find(ticker => ticker.symbol === symbol);
} 