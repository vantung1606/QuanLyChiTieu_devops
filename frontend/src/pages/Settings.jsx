/* eslint-disable no-unused-vars */
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
  
  const handleDeleteAccount = async () => {
    if (!window.confirm(t('Are you sure you want to delete your account? This action cannot be undone.'))) return;
    
    setSaving(true);
    try {
      await api.delete('/users/profile');
      toast.success(t('Account deleted successfully'));
      
      // Logout
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('darkMode');
      localStorage.removeItem('language');
      
      window.location.href = '/login';
    } catch (error) {
      toast.error(t('Error deleting account'));
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
                  <h2>{String(profile.fullName || profile.username || t('User'))}</h2>
                  <p>{String(profile.email || t('Email Not Updated'))}</p>
                  <div className="profile-badges">
                    <span className="badge-outline premium">Premium Member</span>
                    <span className="badge-outline">@{String(profile.username || 'username')}</span>
                  </div>
                </div>
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
                          <span className="pref-label">{t('INTERFACE')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t('Dark Mode')}</span>
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



                {activeTab === 'notifications' && (
                  <div className="settings-section-card animate-in">
                    <h3>{t('Notifications')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="security-item">
                        <span className="sec-label">{t('Email Updates')}</span>
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
                        <span className="sec-label">{t('Push Notifications')}</span>
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
                      <h4>{t('Disable Account')}</h4>
                      <p>{t('Delete Account Desc')}</p>
                    </div>
                    <button 
                      className="btn-danger" 
                      onClick={handleDeleteAccount}
                      disabled={saving}
                    >
                      {saving ? t('Processing...') : t('Delete Account')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
    </Layout>
  );
}
