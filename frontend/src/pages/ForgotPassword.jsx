import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = typeof errorData === 'object' ? (errorData.message || JSON.stringify(errorData)) : errorData;
      setError(errorMessage || 'Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

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
            <h2>Đã gửi yêu cầu!</h2>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>.
            </p>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <Link to="/login" className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/login" className="back-link" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: '#64748b', 
          textDecoration: 'none',
          fontSize: '0.875rem',
          marginBottom: '2rem'
        }}>
          <ArrowLeft size={16} /> Quay lại đăng nhập
        </Link>

        <div className="auth-header">
          <h2>Quên mật khẩu?</h2>
          <p>Nhập email của bạn và chúng tôi sẽ gửi mã đặt lại mật khẩu cho bạn.</p>
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
            <label>EMAIL</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Mail className="input-icon" size={18} style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8' 
              }} />
              <input 
                type="email" 
                placeholder="email@example.com"
                required
                style={{ paddingLeft: '3rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ 
            width: '100%', 
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {loading ? 'Đang gửi...' : (
              <>
                Gửi yêu cầu <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
