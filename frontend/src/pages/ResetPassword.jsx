/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSubmitted(true);
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = typeof errorData === 'object' ? (errorData.message || JSON.stringify(errorData)) : errorData;
      setError(errorMessage || 'Mã token không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header" style={{ textAlign: 'center' }}>
            <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h2>Yêu cầu không hợp lệ</h2>
            <p>Mã đặt lại mật khẩu bị thiếu hoặc không chính xác.</p>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#ecfdf5', 
              color: '#10b981', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2>Thành công!</h2>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
              Mật khẩu của bạn đã được đặt lại. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <Link to="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đặt lại mật khẩu</h2>
          <p>Tạo mật khẩu mới cho tài khoản của bạn.</p>
        </div>

        {error && (
          <div className="alert-box error" style={{ 
            padding: '0.75rem', 
            backgroundColor: '#fef2f2', 
            color: '#991b1b', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>MẬT KHẨU MỚI</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={18} style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8' 
              }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required
                style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  color: '#94a3b8', 
                  cursor: 'pointer' 
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>XÁC NHẬN MẬT KHẨU</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={18} style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8' 
              }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required
                style={{ paddingLeft: '3rem' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ 
            width: '100%', 
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
