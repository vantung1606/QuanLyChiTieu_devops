import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Search, Banknote, AlertTriangle, Cpu, Calendar, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Salary received',
    message: 'Your salary for this month has been credited successfully.',
    time: '2h ago',
    type: 'success',
    icon: Banknote,
    unread: true
  },
  {
    id: 2,
    title: 'Budget Alert',
    message: 'You have spent 95% of your dining budget.',
    time: '5h ago',
    type: 'warning',
    icon: AlertTriangle,
    unread: true
  }
];

export default function Header() {
  const { t } = useTranslation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

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
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tổng quan tài chính</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '2rem', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <span>Tháng 10, 2023</span>
          <Calendar size={14} />
        </div>
      </div>
      
      <div className="header-right">
        <div className="notification-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            className={`icon-btn ${showNotifs ? 'active' : ''}`} 
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={20} />
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: 6, 
              height: 6, 
              backgroundColor: '#ef4444', 
              borderRadius: '50%', 
              border: '1.5px solid white' 
            }}></div>
          </button>

          {showNotifs && (
            <div className="notifications-dropdown">
              <div className="notif-header">
                <h3>{t('Notifications')}</h3>
                <button className="mark-read">{t('Mark as read')}</button>
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
                          {t(notif.title)}
                          {notif.unread && <div className="unread-dot"></div>}
                        </h4>
                        <p>{t(notif.message)}</p>
                        <span className="notif-time">{t(notif.time)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="notif-footer">
                <button className="view-all-btn">{t('View All')}</button>
              </div>
            </div>
          )}
        </div>

        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.fullName || "Alex Nguyen"}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Financial Manager</div>
          </div>
          <div className="avatar" style={{ width: '40px', height: '40px', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <img 
              src={user?.avatar || "https://i.pravatar.cc/150?u=alex"} 
              alt="User Avatar" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
