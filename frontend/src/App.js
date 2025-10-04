import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { logoutUser } from './services/api';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubmitExpensePage from './pages/SubmitExpensePage';
import HistoryPage from './pages/HistoryPage';
import ApprovalPage from './pages/ApprovalPage';
import NotFoundPage from './pages/NotFoundPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setUser({ role });
    } else if (location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const handleLogin = (role) => {
    setUser({ role });
    navigate('/');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MainLayout role={user.role} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<DashboardPage role={user.role} />} />
          <Route path="/submit" element={<SubmitExpensePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/approvals" element={<ApprovalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;