import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Sliders, Bell, Camera, ChevronRight, 
  Globe, Moon, DollarSign, Trash2, 
  ShieldCheck, Lock, AlertCircle, CheckCircle2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../api/axios';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    username: '',
    currency: 'VND',
    language: 'VI',
    darkMode: false,
    twoFactor: false,
    emailUpdates: true,
    pushNotifs: false
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
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

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.put('/users/profile', profile);
      setProfile(response.data);
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data || 'Có lỗi xảy ra khi cập nhật hồ sơ' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }

    setSaving(true);
    try {
      await api.post('/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setIsChangingPassword(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data || 'Mật khẩu hiện tại không chính xác' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          <Header />
          
          <div className="settings-container">
            <div className="page-header">
              <div>
                <h2 className="page-title">Cài đặt</h2>
                <p className="page-subtitle">Quản lý hồ sơ, bảo mật và tùy chọn ứng dụng của bạn.</p>
              </div>
            </div>

            {/* Header Cards */}
            <div className="settings-header-cards">
              <div className="profile-main-card">
                <div className="profile-avatar-wrapper">
                  <img src={`https://ui-avatars.com/api/?name=${profile.fullName || profile.username}&background=006d5b&color=fff`} alt="Avatar" />
                  <div className="avatar-edit-overlay">
                    <Camera size={14} />
                  </div>
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
                  Hồ sơ
                </div>
                <div 
                  className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield size={18} />
                  Bảo mật
                </div>
                <div 
                  className={`settings-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <Sliders size={18} />
                  Tùy chọn
                </div>
                <div 
                  className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell size={18} />
                  Thông báo
                </div>
              </div>

              {/* Content Area */}
              <div className="settings-content">
                {message.text && (
                  <div className={`alert-box ${message.type === 'success' ? 'success' : 'error'}`} style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#065f46' : '#991b1b',
                    border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {typeof message.text === 'string' ? message.text : JSON.stringify(message.text)}
                  </div>
                )}

                {/* Profile Information Section */}
                <div className="settings-section-card">
                  <h3>Thông tin hồ sơ</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>HỌ VÀ TÊN</label>
                      <input 
                        type="text" 
                        value={profile.fullName || ''} 
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>ĐỊA CHỈ EMAIL</label>
                      <input 
                        type="email" 
                        value={profile.email || ''} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>TÊN ĐĂNG NHẬP (KHÔNG THỂ THAY ĐỔI)</label>
                    <input type="text" value={profile.username || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="settings-section-card">
                  <h3>Tùy chọn</h3>
                  <div className="preferences-grid">
                    <div className="pref-item">
                      <div className="pref-header">
                        <DollarSign size={16} className="text-muted" />
                        <span className="pref-label">TIỀN TỆ</span>
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
                        <span className="pref-label">NGÔN NGỮ</span>
                      </div>
                      <select 
                        value={profile.language || 'VI'} 
                        onChange={(e) => setProfile({...profile, language: e.target.value})}
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

                {/* Security & Alerts row */}
                <div className="form-row">
                  <div className="settings-section-card" style={{ flex: 1 }}>
                    <h3>Bảo mật</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="security-item" onClick={() => setIsChangingPassword(!isChangingPassword)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Lock size={16} className="text-muted" />
                          <span className="sec-label">Đổi mật khẩu</span>
                        </div>
                        <ChevronRight size={18} className={`text-muted transition-all ${isChangingPassword ? 'rotate-90' : ''}`} />
                      </div>

                      {isChangingPassword && (
                        <form onSubmit={handleChangePassword} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
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

                      <div className="security-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <ShieldCheck size={16} className="text-muted" />
                          <span className="sec-label">Xác thực 2 lớp</span>
                        </div>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={profile.twoFactor || false} 
                            onChange={() => setProfile({...profile, twoFactor: !profile.twoFactor})} 
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="settings-section-card" style={{ flex: 1 }}>
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
                </div>

                {/* Footer Buttons */}
                <div className="settings-footer">
                  <button className="btn-outline" onClick={fetchProfile} disabled={saving}>Hủy thay đổi</button>
                  <button className="btn-primary" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu tất cả'}
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="danger-zone">
                  <div className="danger-info">
                    <h4>Vô hiệu hóa tài khoản</h4>
                    <p>Xóa vĩnh viễn dữ liệu và quyền truy cập vào tất cả các bản ghi tài chính của bạn.</p>
                  </div>
                  <button className="btn-danger">Xóa tài khoản</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
