import React from 'react';
<<<<<<< HEAD
import { Bell, Settings, Search } from 'lucide-react';
=======
import { PlusSquare, Bell } from 'lucide-react';
>>>>>>> develop

export default function Header() {
  return (
    <div className="top-header">
      <div className="header-left">
<<<<<<< HEAD
        <h1>ExpensePro</h1>
      </div>
      
      <div className="header-center">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Tìm kiếm giao dịch..." />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn" style={{ position: 'relative' }}>
          <Bell size={20} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-main)' }}></div>
        </button>
        <button className="icon-btn">
          <Settings size={20} />
        </button>
        <div className="avatar">
=======
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
>>>>>>> develop
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
}
