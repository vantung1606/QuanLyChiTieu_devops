import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, Shield, Sliders, Bell, Camera, ChevronRight, 
  Globe, Moon, DollarSign, Trash2, 
  ShieldCheck, Lock, AlertCircle, CheckCircle2, LogOut
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { QRCodeSVG } from 'qrcode.react';

import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    username: '',
    currency: 'VND',
    language: localStorage.getItem('language') || 'VI',
    darkMode: localStorage.getItem('darkMode') === 'true',
    twoFactor: false,
    emailUpdates: true,
    pushNotifs: false,
    avatar: ''
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchSessions();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success(t('Logout successful'));
    } catch (error) {
      toast.error(t('Error updating profile'));
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/users/profile', profile);
      setProfile(response.data);
      
      // Apply theme change only on save
      if (response.data.darkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
      }
      
      toast.success(t('Profile updated successfully'));
      // Force refresh header if needed, or window reload for simplicity in syncing across components
      window.location.reload(); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : t('Error updating profile'));
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const compressImage = (dataUrl, maxWidth = 150, maxHeight = 150) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality
      };
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Increased limit for raw file but we will compress anyway
        toast.error(t('Error updating profile'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result);
        setProfile({ ...profile, avatar: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    setSaving(true);
    try {
      await api.post('/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success(t('Password changed successfully'));
      setPasswords({ current: '', new: '', confirm: '' });
      setIsChangingPassword(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : t('Error updating profile'));
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleSetup2FA = async () => {
    setSaving(true);
    try {
      const response = await api.post('/users/2fa/setup');
      setTwoFactorData(response.data);
      setIsSettingUp2FA(true);
    } catch (error) {
      toast.error('Không thể khởi tạo 2FA.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm2FA = async () => {
    if (!otpCode) {
      toast.error('Vui lòng nhập mã OTP');
      return;
    }
    setSaving(true);
    try {
      await api.post('/users/2fa/confirm', { code: parseInt(otpCode) });
      toast.success(t('Security'));
      setProfile({ ...profile, twoFactor: true });
      setIsSettingUp2FA(false);
      setTwoFactorData(null);
      setOtpCode('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : 'Mã OTP không đúng');
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn tắt xác thực 2 lớp? Bảo mật tài khoản sẽ bị giảm xuống.')) return;
    setSaving(true);
    try {
      await api.post('/users/2fa/disable');
      toast.success(t('Security'));
      setProfile({ ...profile, twoFactor: false });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tắt 2FA.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="settings-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">{t('Settings')}</h2>
                <p className="page-subtitle">{t('View and manage all your financial activities')}</p>
              </div>
            </div>

            {/* Header Cards */}
            <div className="settings-header-cards">
              <div className="profile-main-card">
                <div className="profile-avatar-wrapper">
                  <img src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || profile.username || 'User')}&background=006d5b&color=fff&size=256`} alt="Avatar" />
                  <label htmlFor="avatar-upload" className="avatar-edit-overlay" style={{ cursor: 'pointer' }}>
                    <Camera size={14} />
                    <input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <div className="profile-summary">
                  <h2>{String(profile.fullName || profile.username || 'Người dùng')}</h2>
                  <p>{String(profile.email || 'Chưa cập nhật email')}</p>
                  <div className="profile-badges">
                    <span className="badge-outline premium">Premium Member</span>
                    <span className="badge-outline">@{String(profile.username || 'username')}</span>
                  </div>
                </div>
              </div>

              <div className="security-score-card">
                <div className="security-header">
                  <ShieldCheck size={20} className="text-success" />
                  <span className="security-label">Security Score: 92%</span>
                </div>
                <h3 className="security-title">Shield Protected</h3>
                <p className="security-desc">
                  Tài khoản của bạn được bảo mật bằng 2FA và các khóa phần cứng để có độ an toàn tối đa.
                </p>
              </div>
            </div>

            {/* Main Settings Content */}
            <div className="settings-grid">
              {/* Navigation Sidebar */}
              <div className="settings-nav">
                <div 
                  className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={18} />
                  {t('Profile Settings')}
                </div>
                <div 
                  className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield size={18} />
                  {t('Security')}
                </div>
                <div 
                  className={`settings-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <Sliders size={18} />
                  {t('Preferences')}
                </div>
                <div 
                  className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell size={18} />
                  {t('Notifications')}
                </div>
              </div>

              {/* Content Area */}
              <div className="settings-content">
                {/* Tab Content Rendering */}
                {activeTab === 'profile' && (
                  <div className="settings-section-card animate-in">
                    <h3>{t('Profile Settings')}</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('Full Name')}</label>
                        <input 
                          type="text" 
                          value={profile.fullName || ''} 
                          onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('Email Address')}</label>
                        <input 
                          type="email" 
                          value={profile.email || ''} 
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label>{t('Username')}</label>
                      <input type="text" value={profile.username || ''} disabled className="disabled-input" />
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="settings-section-card animate-in">
                    <h3>{t('Preferences')}</h3>
                    <div className="preferences-grid">
                      <div className="pref-item">
                        <div className="pref-header">
                          <DollarSign size={16} className="text-muted" />
                          <span className="pref-label">{t('Currency')}</span>
                        </div>
                        <select 
                          value={profile.currency || 'VND'} 
                          onChange={(e) => setProfile({...profile, currency: e.target.value})}
                        >
                          <option value="VND">VND - Đồng Việt Nam</option>
                          <option value="USD">USD - Dollars</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </div>

                      <div className="pref-item">
                        <div className="pref-header">
                          <Globe size={16} className="text-muted" />
                          <span className="pref-label">{t('Language')}</span>
                        </div>
                        <select 
                          value={profile.language || 'VI'} 
                          onChange={(e) => {
                            const newLang = e.target.value;
                            setProfile({...profile, language: newLang});
                            i18n.changeLanguage(newLang);
                            localStorage.setItem('language', newLang);
                          }}
                        >
                          <option value="VI">Tiếng Việt (VN)</option>
                          <option value="EN">English (US)</option>
                        </select>
                      </div>

                      <div className="pref-item">
                        <div className="pref-header">
                          <Moon size={16} className="text-muted" />
                          <span className="pref-label">GIAO DIỆN</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Chế độ tối</span>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={profile.darkMode || false} 
                              onChange={() => setProfile({...profile, darkMode: !profile.darkMode})} 
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="settings-section-card animate-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Bảo mật</h3>
                      <span className="badge-outline success" style={{ fontSize: '0.7rem' }}>Tài khoản an toàn</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="security-item" onClick={() => setIsChangingPassword(!isChangingPassword)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Lock size={16} className="text-muted" />
                          <span className="sec-label">Đổi mật khẩu</span>
                        </div>
                        <ChevronRight size={18} className={`text-muted transition-all ${isChangingPassword ? 'rotate-90' : ''}`} />
                      </div>

                      {isChangingPassword && (
                        <form onSubmit={handleChangePassword} style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>MẬT KHẨU HIỆN TẠI</label>
                            <input 
                              type="password" 
                              required
                              value={passwords.current}
                              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>MẬT KHẨU MỚI</label>
                            <input 
                              type="password" 
                              required
                              value={passwords.new}
                              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>XÁC NHẬN MẬT KHẨU MỚI</label>
                            <input 
                              type="password" 
                              required
                              value={passwords.confirm}
                              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            />
                          </div>
                          <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '0.5rem' }}>
                            {saving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                          </button>
                        </form>
                      )}

                      <div className="security-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ShieldCheck size={16} className="text-muted" />
                            <span className="sec-label">Xác thực 2 lớp (2FA)</span>
                          </div>
                          {profile.twoFactor ? (
                            <button className="badge-outline success" onClick={handleDisable2FA} disabled={saving} style={{ cursor: 'pointer' }}>Đã bật - Tắt</button>
                          ) : (
                            <button className="badge-outline danger" onClick={handleSetup2FA} disabled={saving} style={{ cursor: 'pointer' }}>Chưa bật - Thiết lập</button>
                          )}
                        </div>

                        {isSettingUp2FA && twoFactorData && (
                          <div className="2fa-setup-box animate-in" style={{ width: '100%', padding: '1.25rem', backgroundColor: 'var(--bg-app)', borderRadius: '0.75rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                                <ShieldCheck size={48} strokeWidth={1.5} />
                              </div>
                              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600 }}>
                                {t('Email Verification')}
                              </p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {t('A 6-digit verification code has been sent to your email. Please check your inbox (or spam) and enter the code below to activate.')}
                              </p>
                            </div>

                            <div className="form-group">
                              <label style={{ fontSize: '0.7rem' }}>{t('VERIFICATION CODE (6 DIGITS)')}</label>
                              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <input 
                                  type="text" 
                                  placeholder="000000" 
                                  maxLength={6}
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                  style={{ flex: 1, textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold', fontSize: '1.1rem' }}
                                />
                                <button className="btn-primary" onClick={handleConfirm2FA} disabled={saving}>
                                  {t('Confirm')}
                                </button>
                              </div>
                            </div>

                            <button className="btn-outline" onClick={() => { setIsSettingUp2FA(false); setTwoFactorData(null); }} style={{ width: '100%' }}>
                              {t('Cancel Setup')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Sliders size={16} className="text-muted" />
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Thiết bị đã đăng nhập</h4>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {sessions.map(session => (
                          <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-app)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '0.375rem', color: 'var(--text-main)' }}>
                                <Globe size={16} />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {session.userAgent.includes('Windows') ? 'Windows PC' : session.userAgent.includes('Mac') ? 'MacBook' : 'Thiết bị lạ'}
                                  {session.isCurrent && <span className="badge-outline success" style={{ fontSize: '0.65rem', padding: '0 0.4rem' }}>Hiện tại</span>}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {session.ipAddress} • {new Date(session.lastActive).toLocaleString('vi-VN')}
                                </div>
                              </div>
                            </div>
                            {!session.isCurrent && (
                              <button 
                                className="btn-revoke" 
                                onClick={() => handleRevokeSession(session.id)}
                              >
                                <LogOut size={14} />
                                Đăng xuất
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="settings-section-card animate-in">
                    <h3>Thông báo</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="security-item">
                        <span className="sec-label">Cập nhật qua Email</span>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={profile.emailUpdates !== false} 
                            onChange={() => setProfile({...profile, emailUpdates: !profile.emailUpdates})} 
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="security-item">
                        <span className="sec-label">Thông báo Push</span>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={profile.pushNotifs || false} 
                            onChange={() => setProfile({...profile, pushNotifs: !profile.pushNotifs})} 
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="settings-footer">
                  <button className="btn-outline" onClick={fetchProfile} disabled={saving}>{t('Cancel')}</button>
                  <button className="btn-primary" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? t('Processing...') : t('Save Changes')}
                  </button>
                </div>

                {/* Danger Zone */}
                {activeTab === 'profile' && (
                  <div className="danger-zone animate-in">
                    <div className="danger-info">
                      <h4>Vô hiệu hóa tài khoản</h4>
                      <p>Xóa vĩnh viễn dữ liệu và quyền truy cập vào tất cả các bản ghi tài chính của bạn.</p>
                    </div>
                    <button className="btn-danger">Xóa tài khoản</button>
                  </div>
                )}
              </div>
            </div>
          </div>
    </Layout>
  );
}
