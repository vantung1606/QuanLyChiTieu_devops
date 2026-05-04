import React, { useState } from 'react';
import { 
  Plus, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, 
  TrendingUp, TrendingDown, MoreVertical, LayoutGrid 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CategoryModal from '../components/CategoryModal';

const CATEGORIES_MOCK = [
  { id: 1, name: 'Ăn uống', icon: Utensils, spent: 1240000, budget: 2000000, color: '#f59e0b', trend: -4.2 },
  { id: 2, name: 'Học tập', icon: GraduationCap, spent: 3500000, budget: 3800000, color: '#3b82f6', trend: 12.8 },
  { id: 3, name: 'Giải trí', icon: Film, spent: 450000, budget: 600000, color: '#8b5cf6', trend: -1.5 },
  { id: 4, name: 'Di chuyển', icon: Train, spent: 820000, budget: 1000000, color: '#10b981', trend: 2.1 },
  { id: 5, name: 'Nhà cửa', icon: Home, spent: 2100000, budget: 2500000, color: '#ef4444', trend: 0 },
  { id: 6, name: 'Y tế', icon: HeartPulse, spent: 150000, budget: 1000000, color: '#ec4899', trend: -10.5 },
  { id: 7, name: 'Tiện ích', icon: Zap, spent: 320000, budget: 500000, color: '#f59e0b', trend: 5.4 },
];

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const calculateProgress = (spent, budget) => {
    return Math.min(Math.round((spent / budget) * 100), 100);
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          <Header />

          <div className="page-header">
            <div>
              <h2 className="page-title">Danh mục chi tiêu</h2>
              <p className="page-subtitle">Quản lý và theo dõi chi tiêu của bạn theo từng lĩnh vực khác nhau.</p>
            </div>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Thêm danh mục mới
            </button>
          </div>

          {/* Quick Stats */}
          <div className="metrics-row" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-info">
                <span>Chi tiêu nhiều nhất tháng</span>
                <h3>Học tập</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span>Tổng danh mục</span>
                <h3>12 đang hoạt động</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <LayoutGrid size={24} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span>Trạng thái ngân sách</span>
                <h3>Đúng lộ trình</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <TrendingDown size={24} />
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="category-grid">
            {CATEGORIES_MOCK.map((cat) => {
              const IconComp = cat.icon;
              const progress = calculateProgress(cat.spent, cat.budget);
              return (
                <div key={cat.id} className="category-card">
                  <div className="category-card-header">
                    <div className="category-icon-wrapper" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      <IconComp size={24} />
                    </div>
                    <button className="action-icon"><MoreVertical size={16} /></button>
                  </div>
                  <div className="category-card-info">
                    <h3>{cat.name}</h3>
                    <span>Chi tiêu tháng này</span>
                  </div>
                  <div className="category-card-amount">
                    <h4>{formatCurrency(cat.spent)}</h4>
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${progress}%`, backgroundColor: cat.color }}
                      />
                      <span className="progress-label" style={{ color: cat.color }}>{progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="category-card create-new" onClick={() => setIsModalOpen(true)}>
              <Plus size={32} />
              <span>Tạo mới</span>
            </div>
          </div>

          {/* Budget Allocation Table */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Chi tiết phân bổ ngân sách</h3>
              <button className="btn-text">Xem tất cả báo cáo &rarr;</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>DANH MỤC</th>
                  <th>TRẠNG THÁI</th>
                  <th>NGÂN SÁCH THÁNG</th>
                  <th>ĐÃ CHI TIÊU</th>
                  <th>XU HƯỚNG</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES_MOCK.map(cat => (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ color: cat.color }}><cat.icon size={18} /></div>
                        <strong>{cat.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${cat.spent > cat.budget ? 'warning' : 'on-track'}`}>
                        {cat.spent > cat.budget ? 'Vượt hạn mức' : 'Đúng lộ trình'}
                      </span>
                    </td>
                    <td>{formatCurrency(cat.budget)}</td>
                    <td>{formatCurrency(cat.spent)}</td>
                    <td>
                      <div className={`type-cell ${cat.trend > 0 ? 'expense' : 'income'}`} style={{ border: 'none', background: 'none', padding: 0 }}>
                        {cat.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(cat.trend)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
