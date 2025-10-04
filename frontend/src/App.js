import React, { useState } from 'react';
import Login from './components/Login';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import { setAuth } from './services/api';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (username, password, userRole) => {
    setAuth(username, password);
    setAuthUser(username);
    setRole(userRole);
  };

  if (!authUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="container mt-3">
      <h2 className="text-center">Expense Management</h2>
      {role === 'EMPLOYEE' && <ExpenseForm />}
      <Dashboard role={role} />
    </div>
  );
}

export default App;
