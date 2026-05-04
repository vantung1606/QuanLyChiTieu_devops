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
        <h2>Equinox Finance</h2>
        <p>Management Portal</p>
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
          Ngân sách
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
          Help Center
        </Link>
        <Link to="/logout" className="nav-item">
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </div>
  );
}
