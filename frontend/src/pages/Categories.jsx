import React, { useState, useEffect } from 'react';
import {
  Plus, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap,
  TrendingUp, TrendingDown, MoreVertical, LayoutGrid, Briefcase, ShoppingBag, Plane, Car, Dog, Dumbbell, Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Layout from '../components/Layout';
import CategoryModal from '../components/CategoryModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ICON_MAP = {
  Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap,
  Briefcase, ShoppingBag, Plane, Car, Dog, Dumbbell, LayoutGrid
};

import { useToast } from '../context/ToastContext';

export default function Categories() {
  const { t } = useTranslation();
  const toast = useToast();
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
      toast.success(t('Category deleted successfully'));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(t('Error deleting category'));
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
    <Layout>
      <div className="enterprise-container budgets-page-active">
        <div className="enterprise-header">
          <div className="enterprise-header-left">
            <h1>{t('Categories')}</h1>
            <p>{t('Manage categories')}</p>
          </div>
          <div className="enterprise-header-actions">
            <button className="btn-enterprise-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> {t('Add category')}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="enterprise-bottom-grid" style={{ marginBottom: '2rem' }}>
          <div className="enterprise-summary-card">
            <TrendingUp size={24} color="#3b82f6" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '0.875rem', color: 'var(--ent-text-muted)' }}>{t('Most spent category')}</h3>
            <div className="enterprise-balance-large" style={{ fontSize: '1.5rem' }}>{loading ? "..." : getTopSpending()}</div>
          </div>
          <div className="enterprise-summary-card">
            <LayoutGrid size={24} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '0.875rem', color: 'var(--ent-text-muted)' }}>{t('Total categories')}</h3>
            <div className="enterprise-balance-large" style={{ fontSize: '1.5rem' }}>{categories.length} {t('active')}</div>
          </div>
          <div className="enterprise-summary-card">
            <TrendingDown size={24} color="#f59e0b" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '0.875rem', color: 'var(--ent-text-muted)' }}>{t('Budget Status')}</h3>
            <div className="enterprise-balance-large" style={{ fontSize: '1.5rem' }}>{loading ? "..." : getBudgetStatus()}</div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="category-grid" style={{ marginBottom: '2rem' }}>
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
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress > 90 ? 'var(--danger)' : progress > 70 ? '#f59e0b' : cat.color
                      }}
                    />
                    <span className="progress-label" style={{ color: progress > 90 ? 'var(--danger)' : progress > 70 ? '#f59e0b' : cat.color }}>{progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="category-card create-new" onClick={() => setIsModalOpen(true)} style={{ minHeight: '140px' }}>
            <Plus size={24} />
            <span style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{t('Create new')}</span>
          </div>
        </div>

        {/* Budget Allocation Table */}
        <div className="enterprise-table-card">
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ent-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--ent-text-main)' }}>{t('Budget Allocation Detail')}</h3>
          </div>
          <table className="enterprise-table">
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
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--ent-text-muted)' }}>{t('No categories created yet')}</td></tr>
              ) : (
                categories.map(cat => {
                  const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
                  const progress = calculateProgress(cat.spent, cat.budget);
                  const isOverBudget = cat.spent > cat.budget;

                  return (
                    <tr key={cat.id}>
                      <td data-label={t('CATEGORY')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
                          <div className="cat-name-info" style={{ textAlign: 'right' }}>
                            <div className="cat-primary-name" style={{ fontWeight: 800, color: 'var(--ent-text-main)', fontSize: '1rem' }}>{cat.name}</div>
                            <div className="cat-secondary-id" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{cat.id}</div>
                          </div>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: `${cat.color}15`,
                            color: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <IconComp size={18} />
                          </div>
                        </div>
                      </td>
                      <td data-label={t('STATUS')}>
                        <span className={`enterprise-badge-category ${isOverBudget ? 'badge-an-uong' : 'badge-luong'}`} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                          {isOverBudget ? t('Over budget') : t('On track')}
                        </span>
                      </td>
                      <td data-label={t('MONTHLY BUDGET')}>
                        <strong style={{ color: 'var(--ent-text-main)', fontWeight: 700 }}>{formatCurrency(cat.budget)}</strong>
                      </td>
                      <td data-label={t('SPENT')}>
                        <strong style={{ fontWeight: 900, color: isOverBudget ? 'var(--danger)' : 'var(--ent-text-main)', fontSize: '1.1rem' }}>
                          {formatCurrency(cat.spent)}
                        </strong>
                      </td>
                      <td data-label={t('PROGRESS')}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                            <span style={{ color: cat.color, fontWeight: 800 }}>{progress}%</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{formatCurrency(cat.budget - cat.spent)} {t('remaining')}</span>
                          </div>
                          <div className="mini-progress-container" style={{ background: 'var(--bg-app)', height: '6px', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <div
                              className="mini-progress-bar"
                              style={{
                                height: '100%',
                                width: `${progress}%`,
                                backgroundColor: progress > 90 ? '#ef4444' : progress > 70 ? '#f59e0b' : cat.color
                              }}
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
    </Layout>
  );
}
