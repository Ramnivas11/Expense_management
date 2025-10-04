import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ExpenseTable from '../components/ExpenseTable';
import { Typography, Paper } from '@mui/material';

function HistoryPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await API.get('/expenses/me');
        setExpenses(res.data);
      } catch (error) {
        console.error("Failed to fetch expense history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Expense History
      </Typography>
      <ExpenseTable expenses={expenses} role="EMPLOYEE" loading={loading} />
    </Paper>
  );
}

export default HistoryPage;