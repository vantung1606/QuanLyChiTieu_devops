import React, { useState, useEffect } from 'react';
import { Plus, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
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

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        _t: Date.now()
      };
      if (filters.type) params.type = filters.type;
      if (filters.days) params.days = filters.days;
      if (filters.category) params.category = filters.category;

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
      // Loại bỏ tất cả ký tự không phải số (ví dụ: dấu chấm, dấu phẩy, chữ cái)
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
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        date: `${formData.date}T00:00:00`
      });
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsModalOpen(false);
      fetchData();
      toast.success(t("Transaction added successfully") || "Đã thêm giao dịch thành công!");
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(t("Error saving transaction") || "Lỗi khi lưu giao dịch.");
    }
  };

  const handleDelete = async (id) => {
    toast.confirm(
      t('Delete confirmation') || "Xác nhận xóa",
      t('Are you sure delete transaction') || "Bạn có chắc chắn muốn xóa giao dịch này?",
      async () => {
        try {
          await api.delete(`/transactions/${id}`);
          fetchData();
          toast.success(t("Transaction deleted") || "Đã xóa giao dịch.");
        } catch (error) {
          console.error("Error deleting transaction:", error);
          toast.error(t("Error deleting transaction") || "Lỗi khi xóa giao dịch.");
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

  const getSubTitle = (title) => {
    if (title.toLowerCase().includes('aws')) return t('Monthly subscription');
    if (title.toLowerCase().includes('thưởng')) return t('Performance bonus');
    if (title.toLowerCase().includes('cà phê')) return t('Morning meeting');
    return "";
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          <Header />
          
          <div className="page-header">
            <div>
              <h2 className="page-title">{t('Transactions')} {filters.category && ` - ${t(filters.category) || filters.category}`}</h2>
              <p className="page-subtitle">{t('View and manage all your financial activities')}</p>
            </div>
            <div className="page-actions">
              <select 
                className="btn-outline" 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">{t('All Types') || 'Tất cả loại'}</option>
                <option value="income">{t('Income')}</option>
                <option value="expense">{t('Expense')}</option>
              </select>

              <select 
                className="btn-outline" 
                value={filters.days || ''} 
                onChange={(e) => setFilters({...filters, days: e.target.value ? parseInt(e.target.value) : null})}
                style={{ appearance: 'none', paddingRight: '2rem' }}
              >
                <option value="">{t('All Time')}</option>
                <option value="7">{t('Last 7 Days')}</option>
                <option value="30">{t('Last 30 Days')}</option>
                <option value="90">{t('Last 90 Days')}</option>
              </select>

              <select 
                className="btn-outline" 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                style={{ appearance: 'none', paddingRight: '2rem' }}
              >
                <option value="">{t('All Categories')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{t(cat.name) || cat.name}</option>
                ))}
              </select>

              <span style={{flex: 1}}></span>
              <button className="btn-outline" onClick={handleExport}>
                <Download size={16} /> {t('Download CSV')}
              </button>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> {t('Add transaction')}
              </button>
            </div>
          </div>

          <div className="card table-card">
            <table className="data-table">
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
                      <p style={{ marginTop: '1rem', color: '#64748b' }}>{t('Loading transactions...') || "Đang tải giao dịch..."}</p>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>{t('No transactions yet')}</td>
                  </tr>
                ) : (
                  transactions.map(item => (
                    <tr key={item.id}>
                      <td className="date-cell">
                        {new Date(item.date).toLocaleDateString(i18n.language === 'EN' ? 'en-US' : 'vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <div className="title-cell">
                          <strong>{item.title}</strong>
                          <span>{getSubTitle(item.title) || (t(item.category) || item.category)}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`category-badge ${getCategoryBadgeClass(item.category)}`}>
                          {t(item.category) || item.category}
                        </span>
                      </td>
                      <td>
                        <div className={`type-cell ${item.type}`}>
                          {item.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {item.type === 'income' ? t('Income') : t('Expense')}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`amount ${item.type}`}>
                          {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                        </span>
                      </td>
                      <td>
                        <div className="action-cells">
                          <button className="action-icon" title={t('Edit')}><Edit2 size={16} /></button>
                          <button className="action-icon danger" title={t('Logout')} onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {transactions.length > 0 && (
              <div className="pagination-footer">
                <span>{t('Showing')} {transactions.length} {t('of')} {transactions.length} {t('transactions_count')}</span>
                <div className="pagination-buttons">
                  <button className="btn-page disabled">{t('Previous')}</button>
                  <button className="btn-page active">{t('Next')}</button>
                </div>
              </div>
            )}
          </div>

        </div>

        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          categories={categories}
        />
      </div>
    </div>
  );
}
