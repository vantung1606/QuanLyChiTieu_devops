import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Landmark, Plus } from 'lucide-react';
import api from '../api/axios';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import TransactionForm from '../components/TransactionForm';
import FinancialTip from '../components/FinancialTip';
import TransactionList from '../components/TransactionList';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
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
      const [transRes, summaryRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/summary')
      ]);
      setTransactions(transRes.data);
      setSummary(summaryRes.data);
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
      fetchData();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error saving transaction. Please check your data.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const formatCurrency = (val) => {
    const formatted = new Intl.NumberFormat('vi-VN').format(val);
    return (val < 0 ? formatted : formatted) + ' đ';
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          <Header />
          
          <div className="metrics-row">
            <StatCard 
              title="Tổng Thu" 
              amount={`+${formatCurrency(summary.totalIncome)}`} 
              type="income" 
              icon={TrendingUp} 
            />
            <StatCard 
              title="Tổng Chi" 
              amount={`-${formatCurrency(summary.totalExpense)}`} 
              type="expense" 
              icon={TrendingDown} 
            />
            <StatCard 
              title="Số Dư" 
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
            MÔI TRƯỜNG: PRODUCTION &nbsp;&nbsp; CONTAINER: ĐANG CHẠY &nbsp;&nbsp; PHIÊN BẢN: V2.4.12
          </div>
          <div className="sys-ops">
            <div className="dot"></div>
            HỆ THỐNG HOẠT ĐỘNG TỐT
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
