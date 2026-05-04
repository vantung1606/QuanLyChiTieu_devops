import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpCircle, Mail, Lock } from 'lucide-react';
import api from '../api/axios';
import '../auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
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

      // Lưu token và thông tin người dùng
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      // Chuyển hướng đến dashboard
      navigate('/');
    } catch (err) {
      // Khi lỗi, giữ nguyên username và password để người dùng sửa
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
      setIsShaking(true);
      
      // Tự động focus và bôi đen mật khẩu cũ
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
        passwordInputRef.current.select();
      }
      
      // Tắt hiệu ứng rung
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  // Hỗ trợ nhấn Enter để đăng nhập
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-layout" onKeyDown={handleKeyDown}>
      <div className="auth-header">
        <h2>ExpenseTracker</h2>
        <HelpCircle size={20} color="var(--text-muted)" />
      </div>

      <div className="auth-content">
        <div className={`auth-card ${isShaking ? 'shake' : ''}`}>
          <div className="auth-title">
            <h3>Chào mừng trở lại</h3>
            <p>Quản lý tài chính với độ chính xác và rõ ràng.</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <div className="auth-form">
            <div className="form-group">
              <label>Username hoặc Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="icon" />
                <input 
                  type="text" 
                  placeholder="admin hoặc email@company.com" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Mật khẩu
                <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Quên mật khẩu?</a>
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="icon" />
                <input 
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
              <label htmlFor="remember">Ghi nhớ trong 30 ngày</label>
            </div>

            <button 
              type="button" 
              className="auth-btn" 
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>

          <div className="auth-divider">HOẶC TIẾP TỤC VỚI</div>

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
            Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
          </div>
        </div>
      </div>

      <div className="auth-layout-footer">
        © 2024 ExpenseTracker. All rights reserved. Precise Finance for Professionals.
      </div>
    </div>
  );
}
