import React, { useState, useEffect } from 'react';
import { Plus, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TransactionModal from '../components/TransactionModal';

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const transRes = await api.get('/transactions');
      setTransactions(transRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount' && value < 0) return;
    setFormData({ ...formData, [name]: value });
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
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('Are you sure delete transaction') || "Bạn có chắc chắn muốn xóa giao dịch này?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
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
              <h2 className="page-title">{t('Transactions')}</h2>
              <p className="page-subtitle">{t('View and manage all your financial activities')}</p>
            </div>
            <div className="page-actions">
              <button className="btn-outline">
                <Calendar size={16} /> {t('Last 30 Days')}
              </button>
              <button className="btn-outline">
                <Filter size={16} /> {t('All Categories')}
              </button>
              <span style={{flex: 1}}></span>
              <button className="btn-outline">
                <Download size={16} /> {t('Download CSV')}
              </button>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> {t('Add category')}
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
                {transactions.length === 0 ? (
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
                <span>{t('Showing')} 1 {t('of')} {transactions.length} {t('transactions_count')}</span>
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
        />
      </div>
    </div>
  );
}
