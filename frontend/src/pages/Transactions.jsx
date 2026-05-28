import React, { useState, useEffect } from 'react';
import { Plus, Download, Calendar, Search, ArrowUpRight, ArrowDownRight, Edit2, Trash2, ListFilter, TrendingUp, Target, PieChart, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Layout from '../components/Layout';
import TransactionModal from '../components/TransactionModal';
import { useToast } from '../context/ToastContext';

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '', days: null });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        _t: Date.now()
      };
      if (filters.type) params.type = filters.type;
      if (filters.days) params.days = filters.days;
      if (filters.category) params.category = filters.category;
      if (searchTerm) params.keyword = searchTerm;

      const [transRes, catRes] = await Promise.all([
        api.get('/transactions', { params }),
        api.get('/categories')
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(t('Error fetching data') || "Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'amount') {
      value = value.replace(/\D/g, '');
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.days) params.days = filters.days;
      if (filters.category) params.category = filters.category;

      const response = await api.get('/transactions/export', {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error(t("Error exporting data") || "Lỗi khi xuất dữ liệu.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date.includes('T') ? formData.date : `${formData.date}T00:00:00`
      };

      if (isEditing) {
        await api.put(`/transactions/${editId}`, data);
        toast.success(t("Transaction updated successfully"));
      } else {
        await api.post('/transactions', data);
        toast.success(t("Transaction added successfully"));
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(t("Error saving transaction"));
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      amount: item.amount.toString(),
      type: item.type,
      category: item.category,
      date: item.date.split('T')[0]
    });
    setEditId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = async (id) => {
    toast.confirm(
      t('Delete confirmation'),
      t('Are you sure delete transaction'),
      async () => {
        try {
          await api.delete(`/transactions/${id}`);
          fetchData();
          toast.success(t("Transaction deleted successfully"));
        } catch (error) {
          console.error("Error deleting transaction:", error);
          toast.error(t("Error deleting transaction"));
        }
      }
    );
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const getCategoryBadgeClass = (category) => {
    if (!category) return 'badge-default';
    const cat = category.toLowerCase();
    if (cat.includes('lương') || cat.includes('income')) return 'badge-luong';
    if (cat.includes('ăn uống') || cat.includes('food')) return 'badge-an-uong';
    if (cat.includes('học tập') || cat.includes('education')) return 'badge-hoc-tap';
    if (cat.includes('di chuyển') || cat.includes('travel')) return 'badge-di-chuyen';
    if (cat.includes('phần mềm') || cat.includes('software')) return 'badge-di-chuyen';
    return 'badge-default';
  };

  const calculateMonthlySpending = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  };



  return (
    <Layout>
      <div className="enterprise-container">
        <div className="enterprise-header">
          <div className="enterprise-header-left">
            <h1>{t('Transactions')}</h1>
            <p>{t('Manage Transactions Desc')}</p>
          </div>
          <div className="enterprise-header-actions">
            <button className="btn-enterprise-outline" onClick={handleExport}>
              <Download size={18} /> {t('Download CSV')}
            </button>
            <button className="btn-enterprise-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> {t('Add Transaction')}
            </button>
          </div>
        </div>

        <div className="enterprise-filter-bar">
          <div className="enterprise-search-wrapper">
            <Search className="enterprise-search-icon" size={18} />
            <input
              type="text"
              placeholder={t('Search transactions...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="enterprise-select"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">{t('All')}</option>
            <option value="income">{t('Income')}</option>
            <option value="expense">{t('Expense')}</option>
          </select>

          <select
            className="enterprise-select"
            value={filters.days || ''}
            onChange={(e) => setFilters({ ...filters, days: e.target.value ? parseInt(e.target.value) : null })}
          >
            <option value="">{t('All Time')}</option>
            <option value="7">{t('Last 7 Days')}</option>
            <option value="30">{t('Last 30 Days')}</option>
            <option value="90">{t('Last 90 Days')}</option>
          </select>

          <select
            className="enterprise-select"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">{t('All Categories')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{t(cat.name) || cat.name}</option>
            ))}
          </select>

          <button className="enterprise-filter-toggle">
            <ListFilter size={18} />
          </button>
        </div>

        <div className="enterprise-table-card">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>{t('DATE_CELL')}</th>
                <th>{t('TITLE_CELL')}</th>
                <th>{t('CATEGORY')}</th>
                <th>{t('Type')}</th>
                <th style={{ textAlign: 'right' }}>{t('AMOUNT')}</th>
                <th style={{ textAlign: 'center' }}>{t('ACTION')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner"></div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>{t('No transactions found')}</td>
                </tr>
              ) : (
                transactions
                  .map(item => (
                    <tr key={item.id}>
                      <td data-label={t('DATE_CELL')} className="td-date">
                        {new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td data-label={t('TITLE_CELL')} className="td-title" style={{ fontWeight: 600 }}>{item.title}</td>
                      <td data-label={t('CATEGORY')} className="td-category">
                        <span className={`enterprise-badge-category ${getCategoryBadgeClass(item.category)}`}>
                          {t(item.category) || item.category}
                        </span>
                      </td>
                      <td data-label={t('Type')} className="td-type">
                        <div className="enterprise-type-label" style={{ color: item.type === 'income' ? '#10b981' : '#ef4444' }}>
                          {item.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {item.type === 'income' ? t('Income') : t('Expense')}
                        </div>
                      </td>
                      <td data-label={t('AMOUNT')} className="td-amount" style={{ textAlign: 'right' }} className={`enterprise-amount ${item.type}`}>
                        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                      </td>
                      <td data-label={t('ACTION')} className="td-actions">
                        <div className="action-cells">
                          <button className="action-icon" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                          <button className="action-icon danger" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>

          <div className="enterprise-table-footer">
            <span>{t('Showing')} {transactions.length} {t('transactions_count')}</span>
          </div>
        </div>

        <div className="enterprise-bottom-grid">
          <div className="enterprise-summary-card primary">
            <TrendingUp size={24} style={{ marginBottom: '1rem' }} />
            <h3>{t('Quick Stats')}</h3>
            <p>{t('Spending Increase Msg')}</p>
            <div className="enterprise-balance-large">{formatCurrency(calculateMonthlySpending())}</div>
          </div>



          <div className="enterprise-summary-card">
            <PieChart size={24} color="#3b82f6" style={{ marginBottom: '1rem' }} />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>{t('View Report')}</p>
              <a href="/reports" className="enterprise-report-link">
                {t('Go to Reports')} <ChevronRight size={14} />
              </a>
            </div>
            <div className="enterprise-fab" onClick={() => setIsModalOpen(true)}>
              <Plus size={24} />
            </div>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        categories={categories}
        isEditing={isEditing}
      />
    </Layout>
  );
}
