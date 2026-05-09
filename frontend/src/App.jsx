import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Reports from './pages/Reports';
import Recurring from './pages/Recurring';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Apply dark mode theme if enabled
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/recurring" element={<ProtectedRoute><Recurring /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
