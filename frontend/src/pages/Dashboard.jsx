import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Landmark, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import TransactionForm from '../components/TransactionForm';
import FinancialTip from '../components/FinancialTip';
import TransactionList from '../components/TransactionList';

import { useToast } from '../context/ToastContext';

function Dashboard() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, summaryRes, catRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/summary'),
        api.get('/categories')
      ]);
      setTransactions(transRes.data);
      setSummary(summaryRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'amount') {
      // Loại bỏ tất cả ký tự không phải số
      value = value.replace(/\D/g, '');
    }
    
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
      fetchData();
      toast.success(t("Transaction added successfully") || "Đã thêm giao dịch thành công!");
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(t("Error saving transaction") || "Lỗi khi lưu giao dịch.");
    }
  };

  const handleDelete = async (id) => {
    toast.confirm(
      t("Delete confirmation") || "Xác nhận xóa",
      t("Are you sure delete transaction") || "Bạn có chắc chắn muốn xóa giao dịch này?",
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
    const locale = i18n.language === 'EN' ? 'en-US' : 'vi-VN';
    const currency = i18n.language === 'EN' ? 'USD' : 'VND';
    // However, if we want to keep it as VND but format differently:
    const formatted = new Intl.NumberFormat(locale).format(val);
    return i18n.language === 'EN' ? `$${formatted}` : `${formatted} đ`;
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          <Header />
          
          <div className="metrics-row">
            <StatCard 
              title={t('Total Income')} 
              amount={`+${formatCurrency(summary.totalIncome)}`} 
              type="income" 
              icon={TrendingUp} 
            />
            <StatCard 
              title={t('Total Expense')} 
              amount={`-${formatCurrency(summary.totalExpense)}`} 
              type="expense" 
              icon={TrendingDown} 
            />
            <StatCard 
              title={t('Balance')} 
              amount={formatCurrency(summary.balance)} 
              type="balance" 
              icon={Landmark} 
            />
          </div>

          <div className="dashboard-grid">
            <div className="left-col">
              <TransactionForm 
                formData={formData} 
                handleInputChange={handleInputChange} 
                handleSubmit={handleSubmit} 
                categories={categories}
              />
              <FinancialTip />
            </div>
            <div className="right-col">
              <TransactionList 
                transactions={transactions} 
                formatCurrency={formatCurrency} 
                handleDelete={handleDelete} 
              />
            </div>
          </div>
        </div>

        <button className="fab">
          <Plus size={24} />
        </button>

        <div className="status-bar">
          <div className="sys-ops">
            {t('ENVIRONMENT')}: PRODUCTION &nbsp;&nbsp; {t('CONTAINER')}: {t('RUNNING')} &nbsp;&nbsp; {t('VERSION')}: V2.4.12
          </div>
          <div className="sys-ops">
            <div className="dot"></div>
            {t('SYSTEM OPERATIONAL')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
