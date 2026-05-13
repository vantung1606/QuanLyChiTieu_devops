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
          {isReports && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t('Detailed analysis of flow')}</p>}
        </div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {isReports && (
          <div className="ent-date-selectors" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-app)', borderRadius: '0.75rem', padding: '0.25rem 0.5rem' }}>
            <select style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
              <option>{t('Last 30 Days')}</option>
            </select>
          </div>
        )}

        <NotificationBell />

        {isReports && (
          <button className="ent-btn-export" style={{
            background: 'var(--text-main)',
            color: 'var(--bg-main)',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.625rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}>
            <Download size={16} /> {t('Export PDF')}
          </button>
        )}

        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
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
