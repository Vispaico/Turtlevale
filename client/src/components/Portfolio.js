import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@material-ui/core';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance, 
  ShowChart 
} from '@material-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Ads from './Ads';
import { Alert as MuiAlert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  portfolioCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    marginBottom: theme.spacing(3),
  },
  balanceCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  profitText: {
    color: theme.palette.success.main,
  },
  lossText: {
    color: theme.palette.error.main,
  },
  signupButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: theme.spacing(2),
  },
  tradesTable: {
    marginTop: theme.spacing(3),
  },
  statusChip: {
    fontWeight: 'bold',
  }
}));

const Portfolio = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { market } = useParams();
  const navigate = useNavigate();
  
  const [portfolioData, setPortfolioData] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioType, setPortfolioType] = useState('main');

  useEffect(() => {
    fetchPortfolioData();
    fetchTrades();
  }, [market, portfolioType]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://us-central1-turtletrader-295e8.cloudfunctions.net/getPortfolio?market=${market || 'all-markets'}&public=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      
      const data = await response.json();
      setPortfolioData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err.message);
      // Set fallback data for demo purposes
      setPortfolioData({
        main_balance: 10000,
        small_balance: 800,
        main_pnl: 0,
        small_pnl: 0,
        main_open_positions: 0,
        small_open_positions: 0,
        main_closed_trades: 0,
        small_closed_trades: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async () => {
    try {
      // This would typically fetch from Firebase
      // For now, we'll use simulated data
      const simulatedTrades = generateSimulatedTrades();
      setTrades(simulatedTrades);
    } catch (err) {
      console.error('Error fetching trades:', err);
    }
  };

  const generateSimulatedTrades = () => {
    const tickers = ['SPY', 'AAPL', 'EURUSD', 'BTCUSD', 'QQQ', 'TSLA'];
    const trades = [];
    
    for (let i = 0; i < 10; i++) {
      const ticker = tickers[Math.floor(Math.random() * tickers.length)];
      const entryPrice = Math.random() * 200 + 50;
      const isProfit = Math.random() > 0.4;
      const exitPrice = isProfit 
        ? entryPrice * (1 + Math.random() * 0.1)
        : entryPrice * (1 - Math.random() * 0.05);
      
      trades.push({
        id: i,
        ticker,
        entryPrice: entryPrice.toFixed(2),
        exitPrice: Math.random() > 0.3 ? exitPrice.toFixed(2) : null,
        status: Math.random() > 0.3 ? 'closed' : 'open',
        portfolioType,
        profitLoss: Math.random() > 0.3 ? ((exitPrice - entryPrice) * 100).toFixed(2) : 0,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
    
    return trades;
  };

  const handleSignupClick = () => {
    navigate('/subscription');
  };

  const currentBalance = portfolioType === 'main' 
    ? portfolioData?.main_balance || 10000
    : portfolioData?.small_balance || 800;
    
  const currentPnL = portfolioType === 'main'
    ? portfolioData?.main_pnl || 0
    : portfolioData?.small_pnl || 0;

  const openPositions = portfolioType === 'main'
    ? portfolioData?.main_open_positions || 0
    : portfolioData?.small_open_positions || 0;

  const closedTrades = portfolioType === 'main'
    ? portfolioData?.main_closed_trades || 0
    : portfolioData?.small_closed_trades || 0;

  const initialBalance = portfolioType === 'main' ? 10000 : 800;
  const returnPercentage = ((currentBalance - initialBalance) / initialBalance * 100).toFixed(2);

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ paddingTop: 64, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: 16 }}>
          Loading portfolio data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: 64, paddingBottom: 32 }}>
      {/* Header */}
      <Box textAlign="center" marginBottom={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          🐢 Turtelli Portfolio Tracker
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          {market ? `${market.charAt(0).toUpperCase()}${market.slice(1)} Market` : 'All Markets'} Performance
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Real simulated trading performance using our Turtle Trading signals
        </Typography>
      </Box>

      {/* Portfolio Type Tabs */}
      <Box marginBottom={3}>
        <Tabs
          value={portfolioType}
          onChange={(e, value) => setPortfolioType(value)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Main Portfolio ($10,000)" value="main" />
          <Tab label="Small Portfolio ($800)" value="small" />
        </Tabs>
      </Box>

      {/* Portfolio Overview Cards */}
      <Grid container spacing={3} style={{ marginBottom: 32 }}>
        <Grid item xs={12} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent>
              <AccountBalance fontSize="large" color="primary" />
              <Typography variant="h4" component="div" style={{ marginTop: 8 }}>
                ${currentBalance.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">
                Current Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent>
              {currentPnL >= 0 ? (
                <TrendingUp fontSize="large" className={classes.profitText} />
              ) : (
                <TrendingDown fontSize="large" className={classes.lossText} />
              )}
              <Typography 
                variant="h4" 
                component="div" 
                className={currentPnL >= 0 ? classes.profitText : classes.lossText}
                style={{ marginTop: 8 }}
              >
                ${currentPnL.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">
                Total P&L
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent>
              <ShowChart fontSize="large" color="primary" />
              <Typography variant="h4" component="div" style={{ marginTop: 8 }}>
                {returnPercentage}%
              </Typography>
              <Typography color="textSecondary">
                Return
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent>
              <Typography variant="h6" color="primary">
                {openPositions}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Open Positions
              </Typography>
              <Typography variant="h6" color="primary" style={{ marginTop: 8 }}>
                {closedTrades}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Closed Trades
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Card className={classes.portfolioCard}>
        <CardContent style={{ textAlign: 'center', padding: 32 }}>
          <Typography variant="h4" gutterBottom>
            Start Your Own Trading Journey
          </Typography>
          <Typography variant="h6" style={{ opacity: 0.9, marginBottom: 24 }}>
            Get real-time Turtle Trading signals and build your own portfolio
          </Typography>
          <Button 
            className={classes.signupButton}
            variant="contained"
            size="large"
            onClick={handleSignupClick}
          >
            Sign Up to Start Trading
          </Button>
          <Typography variant="body2" style={{ marginTop: 16, opacity: 0.8 }}>
            Free trial: 6 signals • Individual: $10/month/market • Full Access: $30/month
          </Typography>
        </CardContent>
      </Card>

      {/* Recent Trades Table */}
      <Card className={classes.tradesTable}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Recent Trades ({portfolioType === 'main' ? '$10,000' : '$800'} Portfolio)
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticker</TableCell>
                  <TableCell>Entry Price</TableCell>
                  <TableCell>Current/Exit Price</TableCell>
                  <TableCell>P&L</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                        {trade.ticker}
                      </Typography>
                    </TableCell>
                    <TableCell>${trade.entryPrice}</TableCell>
                    <TableCell>
                      {trade.exitPrice ? `$${trade.exitPrice}` : 'Market Price'}
                    </TableCell>
                    <TableCell>
                      <Typography
                        className={trade.profitLoss >= 0 ? classes.profitText : classes.lossText}
                      >
                        ${trade.profitLoss}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={trade.status}
                        color={trade.status === 'open' ? 'primary' : 'default'}
                        className={classes.statusChip}
                      />
                    </TableCell>
                    <TableCell>{trade.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {error && (
        <MuiAlert severity="info" style={{ marginTop: 16 }}>
          Using simulated data for demonstration. Real portfolio tracking will use live trading signals.
        </MuiAlert>
      )}

      <Ads />
    </Container>
  );
};

export default Portfolio; 