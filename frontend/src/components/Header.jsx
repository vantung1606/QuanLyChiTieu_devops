import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Calendar, Menu, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

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
    <div className="top-header" style={{ height: '70px', padding: '0 2rem' }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-btn menu-toggle" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            {isReports ? t('Báo cáo tài chính') : isDashboard ? t('Tổng quan tài chính') : t('Quản lý chi tiêu')}
          </h1>
          {isReports && <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Phân tích chi chi tiết về dòng tiền của bạn.</p>}
        </div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {isReports && (
          <div className="ent-date-selectors" style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '0.75rem', padding: '0.25rem 0.5rem' }}>
            <select style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: '0.8125rem' }}>
              <option>Tháng 5</option>
            </select>
            <div style={{ width: '1px', height: '16px', background: '#cbd5e1', margin: '0 0.5rem' }}></div>
            <select style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: '0.8125rem' }}>
              <option>2026</option>
            </select>
          </div>
        )}

        <button className="icon-btn" style={{ position: 'relative' }}>
          <Bell size={20} color="#64748b" />
          <div style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }}></div>
        </button>

        {isReports && (
          <button className="ent-btn-export" style={{
            background: '#0f172a',
            color: '#fff',
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
            <Download size={16} /> {t('Xuất PDF')}
          </button>
        )}

        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>{user?.fullName || "hy"}</div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Financial Manager</div>
          </div>
          <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <img src={user?.avatar || "https://i.pravatar.cc/150?u=hy"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
