import React, { useState, useEffect } from 'react';
import { 
  Plus, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, 
  TrendingUp, TrendingDown, MoreVertical, LayoutGrid, Briefcase, ShoppingBag, Plane, Car, Dog, Dumbbell, Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      alert(t('Error deleting category') || "Không thể xóa danh mục. Vui lòng thử lại!");
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
    const top = [...categories].sort((a, b) => b.spent - a.spent)[0];
    return top ? (t(top.name) || top.name) : "N/A";
  };

  const getBudgetStatus = () => {
    const overBudget = categories.some(c => c.spent > c.budget);
    return overBudget ? t('Needs adjustment') : t('On track');
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          <Header />

          <div className="page-header">
            <div>
              <h2 className="page-title">{t('Categories')}</h2>
              <p className="page-subtitle">{t('Manage categories')}</p>
            </div>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> {t('Add category')}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="metrics-row" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-info">
                <span>{t('Most spent category')}</span>
                <h3>{loading ? "..." : getTopSpending()}</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span>{t('Total categories')}</span>
                <h3>{categories.length} {t('active')}</h3>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <LayoutGrid size={24} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span>{t('Budget Status')}</span>
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
                          <Trash2 size={14} /> {t('Delete category')}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="category-card-info" onClick={() => setActiveMenu(null)}>
                    <h3>{t(cat.name) || cat.name}</h3>
                    <span>{t('Spending this month')}</span>
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
              <span>{t('Create new')}</span>
            </div>
          </div>

          {/* Budget Allocation Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{t('Budget Allocation Detail')}</h3>
              <button className="btn-text-premium">
                {t('View detailed report')} <Plus size={14} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('CATEGORY')}</th>
                    <th>{t('STATUS')}</th>
                    <th>{t('MONTHLY BUDGET')}</th>
                    <th>{t('SPENT')}</th>
                    <th>{t('PROGRESS')}</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>{t('No categories created yet')}</td></tr>
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
                                <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{t(cat.name) || cat.name}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{cat.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${isOverBudget ? 'warning' : 'on-track'}`} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                              {isOverBudget ? t('Over budget') : t('On track')}
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
                                <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(cat.budget - cat.spent)} {t('remaining')}</span>
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
          title={t('Delete category confirm', { name: categoryToDelete?.name })}
          message={t('Delete message')}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
