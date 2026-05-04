import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Search, Banknote, AlertTriangle, Cpu } from 'lucide-react';
import axios from 'axios';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Lương đã về',
    message: 'Lương tháng này của bạn đã được chuyển vào tài khoản ****4590 thành công.',
    time: '2 giờ trước',
    type: 'success',
    icon: Banknote,
    unread: true
  },
  {
    id: 2,
    title: 'Sắp chạm hạn mức Ăn uống',
    message: 'Bạn đã chi tiêu vượt quá 95% hạn mức hàng tháng cho mục ăn uống.',
    time: '5 giờ trước',
    type: 'warning',
    icon: AlertTriangle,
    unread: true
  },
  {
    id: 3,
    title: 'Lịch bảo trì hệ thống',
    message: 'Hệ thống sẽ bảo trì vào Chủ Nhật lúc 02:00 sáng. Dịch vụ có thể bị gián đoạn.',
    time: 'Hôm qua',
    type: 'info',
    icon: Cpu,
    unread: false
  }
];

export default function Header() {
  const [showNotifs, setShowNotifs] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user header:", error);
      }
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIconColor = (type) => {
    switch(type) {
      case 'success': return { bg: '#e6f4ea', color: '#0d652d' };
      case 'warning': return { bg: '#fff4e5', color: '#b26a00' };
      case 'info': return { bg: '#f1f5f9', color: '#475569' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div className="top-header">
      <div className="header-left">
        <h1>ExpensePro</h1>
      </div>
      
      <div className="header-center">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Tìm kiếm tài khoản, báo cáo..." />
        </div>
      </div>

      <div className="header-right">
        <div className="notification-wrapper" ref={dropdownRef}>
          <button 
            className={`icon-btn ${showNotifs ? 'active' : ''}`} 
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={20} />
            <div style={{ 
              position: 'absolute', 
              top: -2, 
              right: -2, 
              width: 8, 
              height: 8, 
              backgroundColor: '#ef4444', 
              borderRadius: '50%', 
              border: '2px solid var(--bg-main)' 
            }}></div>
          </button>

          {showNotifs && (
            <div className="notifications-dropdown">
              <div className="notif-header">
                <h3>Thông báo</h3>
                <button className="mark-read">Đánh dấu đã đọc</button>
              </div>
              <div className="notif-list">
                {NOTIFICATIONS.map((notif) => {
                  const IconComp = notif.icon;
                  const colors = getIconColor(notif.type);
                  return (
                    <div key={notif.id} className="notif-item">
                      <div className="notif-icon-wrapper" style={{ backgroundColor: colors.bg, color: colors.color }}>
                        <IconComp size={20} />
                      </div>
                      <div className="notif-content">
                        <h4>
                          {notif.title}
                          {notif.unread && <div className="unread-dot"></div>}
                        </h4>
                        <p>{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="notif-footer">
                <button className="view-all-btn">Xem tất cả</button>
              </div>
            </div>
          )}
        </div>

        <button className="icon-btn">
          <Settings size={20} />
        </button>
        <div className="header-user">
          <span className="user-name">{user?.fullName || user?.username || 'Người dùng'}</span>
          <div className="avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.username || 'User'}&background=006d5b&color=fff`} 
              alt="User Avatar" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
