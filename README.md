# 🐢 Turtelli - Professional Algorithmic Trading Platform

> **Systematic Trading Excellence** - A complete Firebase-powered trading system implementing the legendary Turtle Trading methodology.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Platform-blue)](https://turtelli.com)
[![Firebase](https://img.shields.io/badge/Firebase-Functions%20%26%20Hosting-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](https://reactjs.org/)

## 🌐 Live Platform
**Website:** [https://turtelli.com](https://turtelli.com)

## 📊 What is Turtle Trading?

The **Turtle Trading System** is one of the most famous algorithmic trading strategies in history. Developed by Richard Dennis and William Eckhardt in the 1980s, it proves that trading can be taught systematically. This platform implements the core Turtle methodology with modern technology.

### Core Principles:
- **Trend Following:** Capture major market moves
- **Breakout Strategy:** Enter positions on 20-day highs/lows  
- **Risk Management:** ATR-based position sizing and stops
- **Systematic Approach:** Remove emotion from trading decisions

## 🚀 Platform Features

### ✅ **Currently Live & Active**
- **🔥 Firebase Functions Backend** - Complete trading engine deployed
- **📡 Real-time API Endpoints** - Health check and trading functionality
- **📊 Automated Signal Generation** - Runs daily at 5:00 PM ET
- **🌍 Multi-Market Coverage** - Stocks, Forex, Crypto, Indices
- **⚡ Premium Data Integration** - Alpha Vantage API
- **📱 Push Notification Infrastructure** - Firebase Cloud Messaging
- **💾 Cloud Database** - Firestore for signals and portfolios

### 🔄 **In Development**
- **React Dashboard** - Advanced trading interface (Node.js compatibility being resolved)
- **Portfolio Analytics** - Performance tracking and reporting
- **Advanced Charting** - Technical analysis tools

## 🏗️ Technical Architecture

```
┌─ React Frontend (Material-UI)
├─ Firebase Functions (Node.js + TypeScript)
├─ Firestore Database (Real-time NoSQL)
├─ Cloud Scheduler (Automated Signal Generation)
├─ Alpha Vantage API (Premium Market Data)
└─ Firebase Cloud Messaging (Push Notifications)
```

### **Core Technologies:**
- **Backend:** Firebase Functions with TypeScript
- **Frontend:** React 18 with Material-UI
- **Database:** Cloud Firestore
- **Hosting:** Firebase Hosting
- **Data Source:** Alpha Vantage Premium API
- **Notifications:** Firebase Cloud Messaging
- **Scheduling:** Cloud Scheduler

## 📈 Market Coverage

| Asset Class | Symbols |
|-------------|---------|
| **📊 Indices** | SPY, QQQ, IWM, VTI |
| **💰 Stocks** | AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA |
| **💱 Forex** | EUR/USD, GBP/USD, USD/JPY, AUD/USD |
| **₿ Crypto** | BTC/USD, ETH/USD, ADA/USD, DOT/USD |

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- Firebase CLI
- Alpha Vantage API Key (Premium recommended)
- Firebase Project with Blaze Plan

### 1. Clone Repository
```bash
git clone https://github.com/Vispaico/Turtelli.git
cd Turtelli
```

### 2. Install Dependencies
```bash
# Install client dependencies
cd client && npm install --legacy-peer-deps

# Install functions dependencies  
cd ../functions && npm install
```

### 3. Configure Firebase
```bash
# Login to Firebase
firebase login

# Initialize project
firebase use turtletrader-295e8  # or your project ID
```

### 4. Set API Keys
```bash
# Set Alpha Vantage API keys
firebase functions:config:set alphavantage.premium_key="YOUR_PREMIUM_KEY"
firebase functions:config:set alphavantage.free_key="YOUR_FREE_KEY"

# Set FCM Server Key
firebase functions:config:set fcm.server_key="YOUR_FCM_KEY"
```

### 5. Build & Deploy
```bash
# Build functions
cd functions && npm run build

# Deploy everything
firebase deploy
```

## 🎯 API Endpoints

### Health Check
```
GET https://us-central1-turtletrader-295e8.cloudfunctions.net/healthCheck
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-10T18:09:11.930Z",
        "service": "Turtelli Functions"
}
```

### Trading Signals
- Automatically generated daily at 5:00 PM ET
- Stored in Firestore `/signals` collection
- Notifications sent via FCM

## 📊 Trading Algorithm

### Entry Signals
- **BUY:** Price breaks above 20-day high
- **SELL:** Price breaks below 20-day low

### Risk Management
- **Position Size:** Based on ATR (Average True Range)
- **Stop Loss:** 2 × ATR from entry price
- **Target:** 3 × ATR from entry price

### Example Signal Structure
```typescript
interface TurtleSignal {
  ticker: string;
  market: string;
  action: 'BUY' | 'SELL';
  price: number;
  stopLoss?: number;
  target?: number;
  timestamp: Timestamp;
  indicators: {
    rsi?: number;
    macd?: number;
    sma20?: number;
    sma55?: number;
  };
}
```

## 📅 Automated Schedule

- **Signal Generation:** Daily at 5:00 PM ET (10:00 PM UTC)
- **Market Analysis:** All configured symbols
- **Notification Delivery:** Immediate after signal generation
- **Database Updates:** Real-time via Firestore

## 🔐 Security Features

- **API Key Management:** Firebase Functions Config
- **Database Rules:** Firestore security rules
- **HTTPS Only:** All endpoints secured
- **Environment Isolation:** Separate dev/prod configs

## 🚀 Deployment Status

| Service | Status | URL |
|---------|--------|-----|
| **Website** | ✅ Live | [turtelli.com](https://turtelli.com) |
| **Functions** | ✅ Deployed | [View Console](https://console.firebase.google.com/project/turtletrader-295e8/functions) |
| **Database** | ✅ Active | Firestore Real-time |
| **Scheduler** | ✅ Running | Daily 5PM ET |

## 🎓 Learning Resources

- [Original Turtle Trading Rules](https://www.turtletrader.com/)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Alpha Vantage API Docs](https://www.alphavantage.co/documentation/)
- [Turtle Trading on Wikipedia](https://en.wikipedia.org/wiki/Turtle_trading)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is for educational and research purposes only. Trading involves substantial risk of loss. Past performance does not guarantee future results. Always do your own research and consider consulting with a financial advisor before making investment decisions.

---

**Built with ❤️ by the Turtelli Team**

*Systematic Trading • Quantitative Analysis • Modern Technology* 