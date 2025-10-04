import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navbar';
import { setAuth, clearAuth } from './services/api';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (username, password, userRole) => {
    setAuth(username, password);
    setAuthUser(username);
    setRole(userRole);
  };

  const handleLogout = () => {
    clearAuth();
    setAuthUser(null);
    setRole(null);
  };

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
