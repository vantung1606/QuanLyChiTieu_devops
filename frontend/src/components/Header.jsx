import React from 'react';
import { PlusSquare, Bell } from 'lucide-react';

export default function Header() {
  return (
    <div className="top-header">
      <div className="header-left">
        <h1>Quản lý chi tiêu</h1>
        <div className="status-badge">
          <div className="status-dot"></div>
          Trạng thái: Đã kết nối
        </div>
      </div>
      <div className="header-right">
        <button className="icon-btn">
          <PlusSquare size={24} />
        </button>
        <button className="icon-btn" style={{ position: 'relative' }}>
          <Bell size={24} />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-main)' }}></div>
        </button>
        <div className="avatar">
          {/* Using a placeholder avatar or just a colored div */}
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
}
