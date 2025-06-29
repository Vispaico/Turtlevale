# GEMINI.md

Build a simplified Turtelli web app in `/Users/n3ils/Sites/TurtleTrader` (Firebase project: `turtletrader-295e8`) using React (TypeScript), Firebase (Firestore, Functions, Hosting), and Alpha Vantage for Turtle Trading signals. The app displays signals for 6 indices (SPY, QQQ, DIA, IWM, VTI, EEM) and 6 stocks (AAPL, MSFT, NVDA, AMZN, TSLA, GOOGL) on a public dashboard and two public portfolio boards ($10,000 and $800) with IG Trading costs (spreads: 0.8–2.4 points for indices; 0.05% or $15 minimum for stocks). No user authentication is required (public access).

## Requirements

### Frontend
- Use React (Create React App, TypeScript), Material-UI, React Router.
- Pages:
  - `/dashboard`: Public, shows Turtle signals (buy/sell on 20-day/55-day breakouts, hold until stop/target) for 12 tickers in a table (Ticker, Action, Entry Price, Stop Loss, Target Price, Timestamp). Include a "Refresh Signals" button to call `/api/manualGenerateSignals`. Use tabs for Indices and Stocks.
  - `/portfolio/main`: Public, shows $10,000 portfolio with live balance, P&L (dollar/%), trade history table (Ticker, Action, Quantity, Entry Price, Current Price, P&L, IG Costs), and chart (Material-UI or Chart.js).
  - `/portfolio/small`: Public, shows $800 portfolio, same as above.
- Bare-bones design with Material-UI tables and buttons, mobile-responsive.

### Backend
- Firebase Functions (Node.js, TypeScript):
  - `generateSignals`: Run every 10 minutes (`*/10 * * * *`) to fetch `TIME_SERIES_DAILY_ADJUSTED`, RSI, MACD, SMA for 12 tickers (~120–240 requests/day) using Alpha Vantage Premium key (`QF9ZXY8QXXXXXXXX`). Append `entitlement=delayed` for US tickers. Spread calls over ~2 minutes (~6 requests/minute, ~10-second delay per batch of 3 tickers) with `setTimeout`. Store in Firestore `signals/{signalId}` (`ticker`, `action`, `entry`, `stop`, `target`, `timestamp`). Log: `console.log("Fetching ${ticker}: ${response.data}")`, `console.error("Error for ${ticker}: ${error.message}")`.
  - `manualGenerateSignals`: HTTP endpoint (`/api/manualGenerateSignals`) for "Refresh Signals" button, public access. Delay automatic signals by ~2 minutes after manual trigger to avoid API limits.
  - `simulateTrade`: Process signals to simulate trades ($10,000/$800 portfolios), apply IG costs, store in `simulated_trades/{tradeId}` (`ticker`, `portfolio_type`, `quantity`, `entry_price`, `current_price`, `pnl`, `ig_costs`, `timestamp`).
- Firestore:
  - `signals/{signalId}`: Signal data.
  - `simulated_trades/{tradeId}`: Trade data.
  - `portfolios/{market}`: Balances (`main_balance`, `small_balance`).
  - `markets/{marketId}`: Ticker metadata (`is_us_stock`).
  - Rules: `signals`, `simulated_trades`, `portfolios`, `markets` have public read access (`allow read: if true;`).

### Setup
- Initialize Firebase in `/client/src/firebase.ts` with placeholder config.
- Include Firebase Authentication setup (email/password, Google) but disable for public access.
- Use `react-firebase-hooks` for Firestore queries, `axios` for API calls, `@material-ui/core` for UI, `chart.js` for charts.
- Create `.gitignore`: `node_modules`, `.env`, `turtletrader-295e8-firebase-adminsdk.json`, `/client/build`.
- Create `package.json` with dependencies: `firebase`, `react`, `@material-ui/core`, `axios`, `react-firebase-hooks`, `chart.js`.
- Create `.prettierrc` for code formatting.

### Output
- Build project in `/Users/n3ils/Sites/TurtleTrader` with `/client`, `/functions`, `/firestore.rules`.
- Provide README with setup, deployment, and testing instructions.

### Notes
- Signals: Every 10 minutes, 12 tickers, real data, spread calls.
- Portfolios: Public, $10,000/$800, IG costs.
- Brand: Turtelli, turtelli.com.
- No sensitive data in codebase or GitHub.