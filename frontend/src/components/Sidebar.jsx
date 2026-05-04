import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Tags, BarChart2, HelpCircle, LogOut, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? "nav-item active" : "nav-item";
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      // Redirect to login
      navigate('/login');
    }
  };

  return (
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
          onClick={handleLogout} 
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
  );
}
