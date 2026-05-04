import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function App() {
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
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/summary`)
      ]);
      setTransactions(transRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative amount at UI level
    if (name === 'amount' && value < 0) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/transactions`, {
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
        await axios.delete(`${API_URL}/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Expense Tracker</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your finances with style</p>
      </header>

      <div className="dashboard-grid">
        <div className="card summary-card">
          <div className="summary-label"><TrendingUp size={16} inline /> Total Income</div>
          <div className="summary-value income">{formatCurrency(summary.totalIncome)}</div>
        </div>
        <div className="card summary-card">
          <div className="summary-label"><TrendingDown size={16} inline /> Total Expense</div>
          <div className="summary-value expense">{formatCurrency(summary.totalExpense)}</div>
        </div>
        <div className="card summary-card">
          <div className="summary-label"><Wallet size={16} inline /> Current Balance</div>
          <div className="summary-value balance">{formatCurrency(summary.balance)}</div>
        </div>
      </div>

      <div className="main-content">
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} /> Add New Transaction
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" name="title" value={formData.title} 
                onChange={handleInputChange} required placeholder="e.g. Salary, Rent, Grocery"
              />
            </div>
            <div className="form-group">
              <label>Amount (VND)</label>
              <input 
                type="number" name="amount" value={formData.amount} 
                onChange={handleInputChange} required min="0" step="1000"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <input 
                type="text" name="category" value={formData.category} 
                onChange={handleInputChange} required placeholder="e.g. Food, Transport, Work"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" name="date" value={formData.date} 
                onChange={handleInputChange} required
              />
            </div>
            <button type="submit">Add Transaction</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} /> Recent Activities
          </h3>
          <div className="transaction-list">
            {transactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No transactions yet.</p>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="transaction-item">
                  <div className="item-info">
                    <h4>{t.title}</h4>
                    <p>{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className={`item-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
