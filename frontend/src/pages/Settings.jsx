import React, { useState } from 'react';
import { 
  User, Shield, Sliders, Bell, Camera, ChevronRight, 
  Globe, Moon, DollarSign, Trash2, 
  ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

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
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
                  <div className="avatar-edit-overlay">
                    <Camera size={14} />
                  </div>
                </div>
                <div className="profile-summary">
                  <h2>Johnathan Doe</h2>
                  <p>john.doe@example.com</p>
                  <div className="profile-badges">
                    <span className="badge-outline premium">Premium Member</span>
                    <span className="badge-outline">Pro Workspace</span>
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
                {/* Profile Information Section */}
                <div className="settings-section-card">
                  <h3>Thông tin hồ sơ</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>HỌ VÀ TÊN</label>
                      <input type="text" defaultValue="Johnathan Doe" />
                    </div>
                    <div className="form-group">
                      <label>ĐỊA CHỈ EMAIL</label>
                      <input type="email" defaultValue="john.doe@example.com" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>GIỚI THIỆU BẢN THÂN</label>
                    <textarea 
                      className="w-full"
                      rows="4" 
                      placeholder="Nói gì đó về bạn..."
                      defaultValue="Quản lý tài chính cá nhân chuyên nghiệp, tập trung vào thị trường công nghệ mới nổi và tăng trưởng tài sản bền vững."
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '0.5rem', 
                        border: '1px solid var(--border)',
                        fontSize: '0.875rem',
                        resize: 'none'
                      }}
                    />
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
                      <select defaultValue="VND">
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
                      <select defaultValue="VI">
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
                          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
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
                      <div className="security-item">
                        <span className="sec-label">Đổi mật khẩu</span>
                        <ChevronRight size={18} className="text-muted" />
                      </div>
                      <div className="security-item">
                        <span className="sec-label">Xác thực 2 lớp</span>
                        <label className="switch">
                          <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
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
                          <input type="checkbox" checked={emailUpdates} onChange={() => setEmailUpdates(!emailUpdates)} />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="security-item">
                        <span className="sec-label">Thông báo Push</span>
                        <label className="switch">
                          <input type="checkbox" checked={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="settings-footer">
                  <button className="btn-outline">Hủy thay đổi</button>
                  <button className="btn-primary">Lưu tất cả</button>
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
