import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';

export default function Header() {
  return (
    <div className="top-header">
      <div className="header-left">
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
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
}
