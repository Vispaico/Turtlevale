import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { app } from '../firebase';

const db = getFirestore(app);

const PortfolioSmall = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const [balance, setBalance] = useState(800);
  const [pnl, setPnl] = useState(0);

  const fetchTrades = async () => {
    const tradesCollection = query(collection(db, 'simulated_trades'), where('portfolio_type', '==', 'small'));
    const tradesSnapshot = await getDocs(tradesCollection);
    const tradesList = tradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTrades(tradesList);

    const totalPnl = tradesList.reduce((acc, trade) => acc + trade.pnl, 0);
    setPnl(totalPnl);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  return (
    <div>
      <Typography variant="h4">Small Portfolio ($800)</Typography>
      <Typography variant="h6">Balance: ${balance.toFixed(2)}</Typography>
      <Typography variant="h6">P&L: ${pnl.toFixed(2)} ({(pnl / balance * 100).toFixed(2)}%)</Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Entry Price</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>P&L</TableCell>
              <TableCell>IG Costs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.ticker}</TableCell>
                <TableCell>{trade.action}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>{trade.entry_price}</TableCell>
                <TableCell>{trade.current_price}</TableCell>
                <TableCell>{trade.pnl.toFixed(2)}</TableCell>
                <TableCell>{trade.ig_costs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PortfolioSmall;