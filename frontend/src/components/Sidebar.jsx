import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  BarChart2, 
  Settings, 
  LogOut, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  const handleLogoutClick = () => {
    toast.confirm(
      t("Logout confirmation") || "Xác nhận đăng xuất",
      t("Are you sure you want to logout?") || "Bạn có chắc chắn muốn đăng xuất không?",
      async () => {
        try {
          await api.post('/users/logout');
          localStorage.removeItem('token');
          navigate('/login');
          toast.success(t("Logged out successfully") || "Đã đăng xuất thành công!");
        } catch (error) {
          console.error("Error logging out:", error);
          // Still logout locally if API fails
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    );
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <LayoutDashboard size={24} />
          </div>
          <h2>Finance Pro <span>ENTERPRISE</span></h2>
        </div>
        <div className="sidebar-nav">
          <Link to="/" className={isActive('/')}>
            <LayoutDashboard size={20} />
            {t('Dashboard')}
          </Link>
          <Link to="/transactions" className={isActive('/transactions')}>
            <Receipt size={20} />
            {t('Transactions')}
          </Link>
          <Link to="/budgets" className={isActive('/budgets')}>
            <Tags size={20} />
            {t('Categories')}
          </Link>
          <Link to="/reports" className={isActive('/reports')}>
            <BarChart2 size={20} />
            {t('Reports')}
          </Link>
          <Link to="/recurring" className={isActive('/recurring')}>
            <Clock size={20} />
            {t('Recurring') || 'Định kỳ'}
          </Link>
          <Link to="/settings" className={isActive('/settings')}>
            <Settings size={20} />
            {t('Settings')}
          </Link>
        </div>
        
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <h4>Upgrade plan for <span>Advanced Insights</span></h4>
            <p>Mở khóa các tính năng dự báo AI và báo cáo chuyên sâu.</p>
            <button className="btn-upgrade">Upgrade Now</button>
          </div>
          <button 
            onClick={handleLogoutClick} 
            className="nav-item logout-btn" 
            style={{ 
              background: 'none', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left',
              cursor: 'pointer',
              padding: '12px 16px',
              color: 'inherit',
              font: 'inherit'
            }}
          >
            <LogOut size={20} />
            {t('Logout')}
          </button>
        </div>
      </div>
    </>
  );
}
