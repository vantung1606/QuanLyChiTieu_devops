import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpCircle, Mail, Lock } from 'lucide-react';
import api from '../api/axios';
import '../auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
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
            <h3>Chào mừng trở lại</h3>
            <p>Quản lý tài chính với độ chính xác và rõ ràng.</p>
          </div>

          {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username hoặc Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="icon" />
                <input 
                  type="text" 
                  placeholder="admin hoặc email@company.com" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Mật khẩu
                <a href="#" className="forgot-link">Quên mật khẩu?</a>
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ghi nhớ trong 30 ngày</label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="auth-divider">HOẶC TIẾP TỤC VỚI</div>

          <div className="social-buttons">
            <button type="button" className="social-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google" />
              Google
            </button>
            <button type="button" className="social-btn">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" width="18" alt="GitHub" />
              GitHub
            </button>
          </div>

          <div className="auth-footer">
            Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>Tài khoản mẫu (Test):</p>
            <p>User: <span style={{ color: '#60a5fa' }}>admin</span></p>
            <p>Pass: <span style={{ color: '#60a5fa' }}>password123</span></p>
          </div>
        </div>
      </div>

      <div className="auth-layout-footer">
        © 2024 ExpenseTracker. All rights reserved. Precise Finance for Professionals.
      </div>
    </div>
  );
}
