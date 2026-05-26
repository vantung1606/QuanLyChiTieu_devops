import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpCircle, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import '../auth.css';

import { useToast } from '../context/ToastContext';

export default function Register() {
  const { t } = useTranslation();
  const toast = useToast();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setFullName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  }, []);

  const handleRegister = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError(t('Please enter full information'));
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('Invalid email format'));
      return;
    }

    // Kiểm tra độ dài mật khẩu (Ít nhất 6 ký tự)
    if (password.length < 6) {
      setError(t('Password must be at least 6 characters'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('Password confirmation does not match'));
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        fullName,
        username,
        email,
        password
      });

      // Redirect to login with success state
      toast.success(t('Registration successful', { name: fullName }));
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        setError(firstError);
      } else {
        setError(data?.message || t('Registration failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-header">
        <h2>ExpenseTracker</h2>
        <HelpCircle size={20} color="var(--text-muted)" />
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-title">
            <h3>{t('Create account')}</h3>
            <p>{t('Ultimate tool for your financial journey')}</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form 
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <div className="form-group">
              <label htmlFor="fullname-input">{t('Full Name')}</label>
              <div className="input-with-icon">
                <User size={18} className="icon" />
                <input 
                  id="fullname-input"
                  name="fullName"
                  type="text" 
                  placeholder="Van Tung" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username-input">{t('Username')}</label>
              <div className="input-with-icon">
                <User size={18} className="icon" style={{ opacity: 0.5 }} />
                <input 
                  id="username-input"
                  name="username"
                  type="text" 
                  placeholder="tung123" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email-input">{t('Email Address')}</label>
              <div className="input-with-icon">
                <Mail size={18} className="icon" />
                <input 
                  id="email-input"
                  name="email"
                  type="email" 
                  placeholder="tung@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password-input">{t('Password')}</label>
              <div className="input-with-icon">
                <Lock size={18} className="icon" />
                <input 
                  id="password-input"
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password-input">{t('Confirm Password')}</label>
              <div className="input-with-icon">
                <ShieldCheck size={18} className="icon" />
                <input 
                  id="confirm-password-input"
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-btn" 
              disabled={loading}
            >
              {loading ? t('Creating account...') : t('Create account')}
            </button>
          </form>

          <div className="auth-divider">{t('OR REGISTER WITH')}</div>

          <div className="social-buttons">
            <button type="button" className="social-btn" onClick={(e) => e.preventDefault()}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google" />
              Google
            </button>
            <button type="button" className="social-btn" onClick={(e) => e.preventDefault()}>
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" width="18" alt="GitHub" />
              GitHub
            </button>
          </div>

          <div className="auth-footer">
            {t('Already have an account?')} <Link to="/login">{t('Login')}</Link>
          </div>
        </div>
      </div>

      <div className="auth-layout-footer">
        © 2024 ExpenseTracker. All rights reserved. Precise Finance for Professionals.
      </div>
    </div>
  );
}
