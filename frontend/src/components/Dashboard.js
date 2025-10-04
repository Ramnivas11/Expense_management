import React, { useEffect, useState, useCallback } from 'react';
import { Table, Badge, Button, Card, Spinner, Alert } from 'react-bootstrap';
import API from '../services/api';
import ApprovalModal from './ApprovalModal';

const statusBadges = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
};

function Dashboard({ role }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [action, setAction] = useState('');

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(''); // Reset error on new fetch
    try {
      // Admins and managers see pending expenses, employees see their own.
      const endpoint = role === 'EMPLOYEE' ? '/expenses/me' : '/expenses/pending';
      const res = await API.get(endpoint);
      setExpenses(res.data);
    } catch (err) {
      setError('Failed to fetch expenses.');
    }
    setLoading(false);
  }, [role]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleActionClick = (expense, newAction) => {
    setSelectedExpense(expense);
    setAction(newAction);
    setModalShow(true);
  };

  const handleModalSubmit = useCallback(async (comment) => {
    setModalShow(false);
    if (!selectedExpense) return;

    try {
      await API.post(`/expenses/${selectedExpense.id}/${action.toLowerCase()}`, { comment });
      fetchExpenses(); // Refresh the list
    } catch (err) {
      setError(`Failed to ${action.toLowerCase()} expense.`);
    }
  }, [selectedExpense, action, fetchExpenses]);

  const renderAdminView = () => (
    <Card className="shadow-sm">
      <Card.Header as="h5">Pending Expenses</Card.Header>
      <Card.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.employeeName}</td>
                  <td>${exp.amount}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.description}</td>
                  <td>
                    <Button variant="success" size="sm" className="me-2" onClick={() => handleActionClick(exp, 'APPROVE')}>
                      Approve
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleActionClick(exp, 'REJECT')}>
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderEmployeeView = () => (
    <Card className="shadow-sm">
      <Card.Header as="h5">My Expenses for {expenses.length > 0 && expenses[0] && expenses[0].employeeName}</Card.Header>
      <Card.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>${exp.amount}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.description}</td>
                  <td>
                    <Badge bg={statusBadges[exp.status]}>{exp.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div>
      {role === 'EMPLOYEE' ? renderEmployeeView() : renderAdminView()}
      {selectedExpense && (
        <ApprovalModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          onSubmit={handleModalSubmit}
          action={action}
        />
      )}
    </div>
  );
}

export default Dashboard;
