import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import '../auth.css';

export default function Register() {
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

          <form className="auth-form">
            <div className="form-group">
              <label>Họ và tên</label>
              <div className="input-with-icon">
                <User size={18} className="icon" />
                <input type="text" placeholder="John Doe" required />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="icon" />
                <input type="email" placeholder="john@company.com" required />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-with-icon">
                <Lock size={18} className="icon" />
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <div className="input-with-icon">
                <ShieldCheck size={18} className="icon" />
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Tôi đồng ý với <a href="#" style={{color: 'var(--text-main)', fontWeight: 600}}>Điều khoản dịch vụ</a> và <a href="#" style={{color: 'var(--text-main)', fontWeight: 600}}>Chính sách bảo mật</a>.
              </label>
            </div>

            <button type="submit" className="auth-btn">Tạo tài khoản</button>
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
