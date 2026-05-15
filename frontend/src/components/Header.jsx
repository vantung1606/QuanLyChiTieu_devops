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
    <div className="top-header">
      <div className="header-left">
        <button className="icon-btn menu-toggle" onClick={onMenuClick}>
          <Menu size={28} />
        </button>
        <div>
          <h1>
            {isReports ? t('Financial Report') : isDashboard ? t('Dashboard') : t('Finance Portal')}
          </h1>
        </div>
      </div>

      <div className="header-right">
        <NotificationBell />

        <div className="header-user">
          <div className="user-text">
            <div className="user-name">{user?.fullName || "hy"}</div>
            <div className="user-role">Financial Manager</div>
          </div>
          <div className="avatar">
            <img src={user?.avatar || "https://i.pravatar.cc/150?u=hy"} alt="Avatar" />
          </div>
        </div>
      </div>
    </div>
  );
}
