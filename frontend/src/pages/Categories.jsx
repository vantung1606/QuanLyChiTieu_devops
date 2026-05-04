import React, { useState, useEffect } from 'react';
import { 
  Plus, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, 
  TrendingUp, TrendingDown, MoreVertical, LayoutGrid, Briefcase, ShoppingBag, Plane, Car, Dog, Dumbbell 
} from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CategoryModal from '../components/CategoryModal';

const ICON_MAP = {
  Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, 
  Briefcase, ShoppingBag, Plane, Car, Dog, Dumbbell, LayoutGrid
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const calculateProgress = (spent, budget) => {
    if (!budget) return 0;
    return Math.min(Math.round((spent / budget) * 100), 100);
  };

  const getTopSpending = () => {
    if (categories.length === 0) return "N/A";
    return [...categories].sort((a, b) => b.spent - a.spent)[0].name;
  };

  const getBudgetStatus = () => {
    const overBudget = categories.some(c => c.spent > c.budget);
    return overBudget ? "Cần điều chỉnh" : "Đúng lộ trình";
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
                <h3>{loading ? "..." : getTopSpending()}</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span>Tổng danh mục</span>
                <h3>{categories.length} đang hoạt động</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <LayoutGrid size={24} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span>Trạng thái ngân sách</span>
                <h3>{loading ? "..." : getBudgetStatus()}</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <TrendingDown size={24} />
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="category-grid">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
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
                {categories.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Chưa có danh mục nào</td></tr>
                ) : (
                  categories.map(cat => {
                    const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
                    return (
                      <tr key={cat.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ color: cat.color }}><IconComp size={18} /></div>
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
                          <div className={`type-cell ${cat.spent > cat.budget ? 'expense' : 'income'}`} style={{ border: 'none', background: 'none', padding: 0 }}>
                            {cat.spent > cat.budget ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {cat.spent > 0 ? Math.round((cat.spent/cat.budget)*100) : 0}%
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CategoryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          refresh={fetchCategories}
        />
      </div>
    </div>
  );
}
