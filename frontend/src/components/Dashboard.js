import React, { useEffect, useState } from 'react';
import API from '../services/api';

function Dashboard({ role }) {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses based on role
  const fetchExpenses = async () => {
    try {
      const endpoint = role === 'EMPLOYEE' ? '/expenses/me' : '/expenses/pending';
      const res = await API.get(endpoint);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [role]);

  // Handle Approve/Reject
  const handleApproval = async (expenseId, action) => {
    const comment = prompt(`Enter comment for ${action}:`);
    if (comment === null) return;

    try {
      await API.post(`/expenses/${expenseId}/${action.toLowerCase()}`, { comment });
      alert(`Expense ${action}ed successfully!`);
      fetchExpenses(); // refresh list
    } catch (err) {
      alert('Approval failed');
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h4>Dashboard ({role})</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Status</th>
            {role !== 'EMPLOYEE' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.employeeName}</td>
              <td>{exp.amount}</td>
              <td>{exp.date}</td>
              <td>{exp.description}</td>
              <td>{exp.status}</td>
              {role !== 'EMPLOYEE' && (
                <td>
                  {exp.status === 'PENDING' && (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleApproval(exp.id, 'APPROVE')}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleApproval(exp.id, 'REJECT')}>Reject</button>
                    </>
                  )}
                  {exp.status !== 'PENDING' && <span>N/A</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
