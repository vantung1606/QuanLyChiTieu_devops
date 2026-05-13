import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Calendar, Menu, Download, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import NotificationBell from './NotificationBell';

export default function Header({ onMenuClick }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const isReports = location.pathname === '/reports';
  const isDashboard = location.pathname === '/';

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
    <div className="top-header" style={{ height: '70px', padding: '0 2rem', borderBottom: '1px solid var(--border)' }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-btn menu-toggle" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {isReports ? t('Financial Report') : isDashboard ? t('Dashboard') : t('Finance Portal')}
          </h1>
        </div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <NotificationBell />

        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.fullName || "hy"}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Financial Manager</div>
          </div>
          <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <img src={user?.avatar || "https://i.pravatar.cc/150?u=hy"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
