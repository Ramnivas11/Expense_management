import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ExpenseTable from '../components/ExpenseTable';
import ApprovalModal from '../components/ApprovalModal';
import { Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';

function ApprovalPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [action, setAction] = useState('');

  const fetchPendingExpenses = async () => {
    setLoading(true);
    try {
      const res = await API.get('/expenses/pending');
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch pending expenses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const handleAction = (expenseId, action) => {
    setSelectedExpense(expenseId);
    setAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedExpense(null);
    setAction('');
  };

  const handleModalConfirm = async (comment) => {
    if (!comment) {
      toast.error('A comment is required.');
      return;
    }

    try {
      await API.post(`/expenses/${selectedExpense}/${action.toLowerCase()}`, { comment });
      toast.success(`Expense ${action.toLowerCase()}ed successfully!`);
      fetchPendingExpenses(); // Refresh the list
    } catch (error) {
      // Error is already handled by the API service
    } finally {
      handleModalClose();
    }
  };

  const role = localStorage.getItem('userRole');


  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Approve Expenses
      </Typography>
      <ExpenseTable
        expenses={expenses}
        role={role}
        onAction={handleAction}
        loading={loading}
      />
      <ApprovalModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        action={action}
      />
    </Paper>
  );
}

export default ApprovalPage;