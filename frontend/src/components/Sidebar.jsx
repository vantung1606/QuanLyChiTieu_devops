import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Tags, BarChart2, HelpCircle, LogOut, Settings } from 'lucide-react';
import LogoutModal from './LogoutModal';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "nav-item active" : "nav-item";
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Equinox Finance</h2>
          <p>Cổng quản lý tài chính</p>
        </div>
        <div className="sidebar-nav">
          <Link to="/" className={isActive('/')}>
            <LayoutDashboard size={20} />
            Tổng quan
          </Link>
          <Link to="/transactions" className={isActive('/transactions')}>
            <Receipt size={20} />
            Giao dịch
          </Link>
          <Link to="/budgets" className={isActive('/budgets')}>
            <Tags size={20} />
            Danh mục
          </Link>
          <Link to="/reports" className={isActive('/reports')}>
            <BarChart2 size={20} />
            Báo cáo
          </Link>
          <Link to="/settings" className={isActive('/settings')}>
            <Settings size={20} />
            Cài đặt
          </Link>
        </div>
        
        <div className="sidebar-bottom">
          <Link to="/help" className="nav-item">
            <HelpCircle size={20} />
            Trung tâm trợ giúp
          </Link>
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
            Đăng xuất
          </button>
        </div>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </>
  );
}
