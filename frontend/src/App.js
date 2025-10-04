import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navbar'; // Import Navbar
import { setAuth } from './services/api';

function App() {
  const [authUser, setAuthUser] = useState(localStorage.getItem('username'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = useCallback((username, password, userRole) => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    localStorage.setItem('role', userRole);
    setAuth(username, password);
    setAuthUser(username);
    setRole(userRole);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
    setAuth(null, null);
    setAuthUser(null);
    setRole(null);
  }, []);

  return (
    <Router>
      {authUser && <Navigation onLogout={handleLogout} />}
      <div className="container mt-3">
        <Routes>
          <Route path="/login" element={!authUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route 
            path="/" 
            element={authUser ? (
              <div>
                {role === 'EMPLOYEE' && <ExpenseForm />}
                <Dashboard role={role} />
              </div>
            ) : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
