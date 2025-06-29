import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Button, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { app } from '../firebase';

const db = getFirestore(app);

const Dashboard = () => {
  const [signals, setSignals] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const fetchSignals = async () => {
    const signalsCollection = collection(db, 'signals');
    const signalsSnapshot = await getDocs(signalsCollection);
    const signalsList = signalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSignals(signalsList);
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleRefresh = async () => {
    // This would ideally call the `manualGenerateSignals` function.
    // For now, it just re-fetches the data.
    await fetchSignals();
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const indices = ['SPY', 'QQQ', 'DIA', 'IWM', 'VTI', 'EEM'];
  const stocks = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'TSLA', 'GOOGL'];

  const filteredSignals = signals.filter(signal => {
    if (tabValue === 0) {
      return indices.includes(signal.ticker);
    }
    return stocks.includes(signal.ticker);
  });

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleRefresh} style={{ marginBottom: '20px' }}>
        Refresh Signals
      </Button>
      <Paper>
        <Tabs value={tabValue} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Indices" />
          <Tab label="Stocks" />
        </Tabs>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticker</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Entry Price</TableCell>
                <TableCell>Stop Loss</TableCell>
                <TableCell>Target Price</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSignals.map((signal) => (
                <TableRow key={signal.id}>
                  <TableCell>{signal.ticker}</TableCell>
                  <TableCell>{signal.action}</TableCell>
                  <TableCell>{signal.entry}</TableCell>
                  <TableCell>{signal.stopLoss}</TableCell>
                  <TableCell>{signal.target}</TableCell>
                  <TableCell>{new Date(signal.timestamp?.toDate()).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default Dashboard;