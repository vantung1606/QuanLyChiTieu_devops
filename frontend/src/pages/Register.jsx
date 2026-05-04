import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpCircle, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import '../auth.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp!');
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        fullName,
        username,
        email,
        password
      });

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
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
            <h3>Tạo tài khoản</h3>
            <p>Công cụ tối ưu cho hành trình tài chính của bạn.</p>
          </div>

          {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <div className="input-with-icon">
                <User size={18} className="icon" />
                <input 
                  type="text" 
                  placeholder="Van Tung" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Username</label>
              <div className="input-with-icon">
                <User size={18} className="icon" style={{ opacity: 0.5 }} />
                <input 
                  type="text" 
                  placeholder="tung123" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="icon" />
                <input 
                  type="email" 
                  placeholder="tung@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
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

            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <div className="input-with-icon">
                <ShieldCheck size={18} className="icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Tôi đồng ý với <a href="#" style={{color: 'var(--text-main)', fontWeight: 600}}>Điều khoản dịch vụ</a> và <a href="#" style={{color: 'var(--text-main)', fontWeight: 600}}>Chính sách bảo mật</a>.
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="auth-divider">HOẶC ĐĂNG KÝ VỚI</div>

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
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </div>
      </div>

      <div className="auth-layout-footer">
        © 2024 ExpenseTracker. All rights reserved. Precise Finance for Professionals.
      </div>
    </div>
  );
}
