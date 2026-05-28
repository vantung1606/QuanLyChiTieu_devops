import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, HelpCircle } from 'lucide-react';
import api from '../api/axios';
import '../auth.css';

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  React.useEffect(() => {
    setUsername('');
    setPassword('');
    setError('');
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError(t('Please enter full information'));
      return;
    }

    setLoading(true);
    setError('');
    setIsShaking(false);

    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      saveAuthData(response.data);
      navigate('/');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAuthData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('darkMode', data.darkMode);
    localStorage.setItem('currency', data.currency || 'VND');
    localStorage.setItem('language', data.language || 'VI');

    // Áp dụng giao diện ngay lập tức
    if (data.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleError = (err) => {
    const data = err.response?.data;
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      setError(firstError);
    } else {
      setError(data?.message || t('Login failed'));
    }
    
    setIsShaking(true);
    
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
      passwordInputRef.current.select();
    }
    
    setTimeout(() => setIsShaking(false), 500);
  };

  // Hỗ trợ nhấn Enter để đăng nhập
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-header">
        <h2>ExpenseTracker</h2>
        <HelpCircle size={20} color="var(--text-muted)" />
      </div>

      <div className="auth-content">
        <div className={`auth-card ${isShaking ? 'shake' : ''}`}>
          <div className="auth-title">
            <h3>{t('Welcome Back')}</h3>
            <p>{t('Manage finances with precision')}</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

            <form 
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
                <>
                  <div className="form-group">
                    <label htmlFor="username-input">{t('Username')}</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="icon" />
                      <input 
                        id="username-input"
                        name="username"
                        type="text" 
                        placeholder="admin" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password-input">
                      {t('Password')}
                      <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#006d5b', textDecoration: 'none', fontWeight: 600 }}>{t('Forgot password?')}</Link>
                    </label>
                    <div className="input-with-icon">
                      <Lock size={18} className="icon" />
                      <input 
                        id="password-input"
                        name="password"
                        ref={passwordInputRef}
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <div className="checkbox-group">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">{t('Remember for 30 days')}</label>
                  </div>

                  <button 
                    type="submit" 
                    className="auth-btn" 
                    disabled={loading}
                  >
                    {loading ? t('Processing...') : t('Login')}
                  </button>
                </>
            </form>

          <div className="auth-divider">{t('OR CONTINUE WITH')}</div>

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
            {t("Don't have an account?")} <Link to="/register">{t('Create account')}</Link>
          </div>
        </div>
      </div>

      <div className="auth-layout-footer">
        © 2024 ExpenseTracker. All rights reserved. Precise Finance for Professionals.
      </div>
    </div>
  );
}
