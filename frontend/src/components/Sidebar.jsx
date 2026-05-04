import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Tags, BarChart2, HelpCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "nav-item active" : "nav-item";
  };
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Finance Pro</h2>
        <p>Tài khoản Doanh nghiệp</p>
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
        <Link to="/categories" className={isActive('/categories')}>
          <Tags size={20} />
          Danh mục
        </Link>
        <Link to="/reports" className={isActive('/reports')}>
          <BarChart2 size={20} />
          Báo cáo
        </Link>
      </div>
      
      <div className="sidebar-bottom">
        <Link to="/help" className="nav-item">
          <HelpCircle size={20} />
          Trung tâm trợ giúp
        </Link>
        <Link to="/logout" className="nav-item">
          <LogOut size={20} />
          Đăng xuất
        </Link>
      </div>
    </div>
  );
}
