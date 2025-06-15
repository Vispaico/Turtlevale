import * as admin from 'firebase-admin';

export type MarketType = 'indices' | 'stocks' | 'forex' | 'crypto';

export interface MarketTicker {
  symbol: string;
  name: string;
  market: MarketType;
  isUSStock: boolean;
  alphaVantageSymbol: string;
  spread: number;
  commission: number;
}

export interface TurtleSignal {
  ticker: string;
  market: MarketType;
  action: 'BUY' | 'SELL';
  price: number;
  stopLoss?: number;
  target?: number;
  timestamp: admin.firestore.Timestamp;
}

export interface UserSubscription {
  email: string;
  userId: string;
  subscription: {
    type: 'free' | 'individual' | 'full-access';
    markets: MarketType[];
    isActive: boolean;
  };
  displayName?: string;
} 