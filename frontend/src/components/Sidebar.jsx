import React from 'react';
import { LayoutDashboard, Receipt, Tags, BarChart2 } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Finance Pro</h2>
        <p>Tài khoản Doanh nghiệp</p>
      </div>
      <div className="sidebar-nav">
        <a href="#" className="nav-item active">
          <LayoutDashboard size={20} />
          Tổng quan
        </a>
        <a href="#" className="nav-item">
          <Receipt size={20} />
          Giao dịch
        </a>
        <a href="#" className="nav-item">
          <Tags size={20} />
          Danh mục
        </a>
        <a href="#" className="nav-item">
          <BarChart2 size={20} />
          Báo cáo
        </a>
      </div>
      <div className="sidebar-footer">
        <div style={{ width: 16, height: 16, border: '1px solid currentColor', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 8, height: 8, backgroundColor: 'currentColor', borderRadius: 2 }}></div>
        </div>
        Môi trường: Production
      </div>
    </div>
  );
}
