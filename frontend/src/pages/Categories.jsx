import React, { useState, useEffect } from 'react';
import { 
  Plus, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, 
  TrendingUp, TrendingDown, MoreVertical, LayoutGrid, Briefcase, ShoppingBag, Plane, Car, Dog, Dumbbell, Trash2
} from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CategoryModal from '../components/CategoryModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ICON_MAP = {
  Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, 
  Briefcase, ShoppingBag, Plane, Car, Dog, Dumbbell, LayoutGrid
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchCategories();
    
    // Close menu when clicking outside
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
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

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
    setActiveMenu(null);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setDeleteLoading(true);
    try {
      await api.delete(`/categories/${categoryToDelete.id}`);
      fetchCategories();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Không thể xóa danh mục. Vui lòng thử lại!");
    } finally {
      setDeleteLoading(false);
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
    return [...categories].sort((a, b) => b.spent - a.spent)[0]?.name || "N/A";
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
                  <div className="category-card-header" style={{ position: 'relative' }}>
                    <div className="category-icon-wrapper" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      <IconComp size={24} />
                    </div>
                    <button 
                      className="action-icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === cat.id ? null : cat.id);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {activeMenu === cat.id && (
                      <div className="dropdown-menu">
                        <button 
                          className="dropdown-item danger" 
                          onClick={() => handleDelete(cat)}
                        >
                          <Trash2 size={14} /> Xóa danh mục
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="category-card-info" onClick={() => setActiveMenu(null)}>
                    <h3>{cat.name}</h3>
                    <span>Chi tiêu tháng này</span>
                  </div>
                  <div className="category-card-amount" onClick={() => setActiveMenu(null)}>
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
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Chi tiết phân bổ ngân sách</h3>
              <button className="btn-text-premium">
                Xem báo cáo chi tiết <Plus size={14} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>DANH MỤC</th>
                    <th>TRẠNG THÁI</th>
                    <th>NGÂN SÁCH THÁNG</th>
                    <th>ĐÃ CHI TIÊU</th>
                    <th>TIẾN ĐỘ</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chưa có danh mục nào được tạo</td></tr>
                  ) : (
                    categories.map(cat => {
                      const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
                      const progress = calculateProgress(cat.spent, cat.budget);
                      const isOverBudget = cat.spent > cat.budget;
                      
                      return (
                        <tr key={cat.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '10px', 
                                backgroundColor: `${cat.color}15`, 
                                color: cat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <IconComp size={18} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{cat.name}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{cat.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${isOverBudget ? 'warning' : 'on-track'}`} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                              {isOverBudget ? 'Vượt hạn mức' : 'Đúng lộ trình'}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{formatCurrency(cat.budget)}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: isOverBudget ? 'var(--danger)' : 'inherit' }}>
                              {formatCurrency(cat.spent)}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                                <span style={{ color: cat.color }}>{progress}%</span>
                                <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(cat.budget - cat.spent)} còn lại</span>
                              </div>
                              <div className="mini-progress-container">
                                <div 
                                  className="mini-progress-bar" 
                                  style={{ width: `${progress}%`, backgroundColor: cat.color }}
                                />
                              </div>
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
        </div>

        <CategoryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          refresh={fetchCategories}
        />

        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={`Xóa danh mục "${categoryToDelete?.name}"?`}
          message="Hành động này không thể hoàn tác. Các giao dịch liên quan sẽ không còn thuộc danh mục này."
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
