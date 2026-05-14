import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  BarChart2, 
  Settings, 
  LogOut, 
  Clock,
  X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  const handleLogoutClick = () => {
    toast.confirm(
      t("Confirm Logout") || "Xác nhận đăng xuất",
      t("Are you sure you want to logout?") || "Bạn có chắc chắn muốn đăng xuất không?",
      async () => {
        try {
          await api.post('/auth/logout');
          localStorage.removeItem('token');
          navigate('/login');
          toast.success(t("Logged out successfully") || "Đã đăng xuất thành công!");
        } catch (error) {
          console.error("Error logging out:", error);
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    );
  };

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <LayoutDashboard size={24} />
        </div>
        <h2>Finance Pro <span>ENTERPRISE</span></h2>
        <button className="sidebar-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="sidebar-nav">
        <Link to="/" className={isActive('/')} onClick={onClose}>
          <LayoutDashboard size={20} />
          {t('Dashboard')}
        </Link>
        <Link to="/transactions" className={isActive('/transactions')} onClick={onClose}>
          <Receipt size={20} />
          {t('Transactions')}
        </Link>
        <Link to="/budgets" className={isActive('/budgets')} onClick={onClose}>
          <Tags size={20} />
          {t('Categories')}
        </Link>
        <Link to="/reports" className={isActive('/reports')} onClick={onClose}>
          <BarChart2 size={20} />
          {t('Reports')}
        </Link>
        <Link to="/recurring" className={isActive('/recurring')} onClick={onClose}>
          <Clock size={20} />
          {t('Recurring') || 'Định kỳ'}
        </Link>
        <Link to="/settings" className={isActive('/settings')} onClick={onClose}>
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
          className="nav-item logout-btn logout-btn-sidebar" 
          style={{ 
            background: 'none', 
            border: 'none', 
            width: '100%', 
            textAlign: 'left',
            cursor: 'pointer',
            padding: '12px 16px',
            font: 'inherit'
          }}
        >
          <LogOut size={20} />
          {t('Logout')}
        </button>
      </div>
    </>
  );
}
