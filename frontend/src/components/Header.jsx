import React, { useState, useEffect } from 'react';
import { Settings, Calendar, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import NotificationBell from './NotificationBell';

export default function Header({ onMenuClick }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

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

  return (
    <div className="top-header">
      <div className="header-left">
        <button className="icon-btn menu-toggle" onClick={onMenuClick} style={{ marginRight: '1rem' }}>
          <Menu size={24} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tổng quan tài chính</h1>
        <div className="date-picker-trigger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '2rem', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <span>Tháng 10, 2023</span>
          <Calendar size={14} />
        </div>
      </div>
      
      <div className="header-right">
        <NotificationBell />

        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.fullName || "Alex Nguyen"}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Financial Manager</div>
          </div>
          <div className="avatar" style={{ width: '40px', height: '40px', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || user?.username || 'User'}&background=006d5b&color=fff`} 
              alt="User Avatar" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
