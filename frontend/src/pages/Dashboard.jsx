import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Landmark, Plus, Calendar, Search, Filter, ShoppingBag, Car, Home, Coffee, Info, Lightbulb, Wallet, CheckCircle2, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

import Layout from '../components/Layout';
import { useToast } from '../context/ToastContext';

// Mock data for charts
const BALANCE_DATA = [
  { name: '1', val: 65 },
  { name: '2', val: 58 },
  { name: '3', val: 72 },
  { name: '4', val: 68 },
  { name: '5', val: 85 },
  { name: '6', val: 76.5 },
];

const CASH_FLOW_DATA = [
  { name: 'T5', income: 80, expense: 45 },
  { name: 'T6', income: 95, expense: 50 },
  { name: 'T7', income: 85, expense: 60 },
  { name: 'T8', income: 110, expense: 40 },
  { name: 'T9', income: 100, expense: 55 },
  { name: 'T10', income: 125, expense: 48 },
];

const SPENDING_BY_CAT = [
  { name: 'Ăn uống & Cà phê', amount: 12600000, percentage: 35, color: '#3b82f6' },
  { name: 'Nhà cửa & Tiện ích', amount: 15000000, percentage: 28, color: '#10b981' },
  { name: 'Di chuyển', amount: 4200000, percentage: 12, color: '#f59e0b' },
  { name: 'Giải trí', amount: 2100000, percentage: 9, color: '#ef4444' },
];

function Dashboard() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [balanceTrend, setBalanceTrend] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [spendingByCat, setSpendingByCat] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({ totalBudget: 0, totalSpent: 0 });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', days: null });
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      const transParams = {
        keyword: searchTerm,
        type: filters.type,
        category: filters.category,
        days: filters.days
      };

      const [transRes, summaryRes, catRes, reportRes] = await Promise.all([
        api.get('/transactions', { params: transParams }),
        api.get('/summary'),
        api.get('/categories'),
        api.get('/reports/financial-performance')
      ]);
      
      setTransactions(transRes.data.slice(0, 5));
      setSummary(summaryRes.data);
      setCategories(catRes.data);
      setReport(reportRes.data);

      // Process Balance Trend from report
      let currentBal = summaryRes.data?.balance || 0;
      const historyPoints = [...(reportRes.data?.incomeVsExpenses || [])].reverse();
      const trend = [];
      
      // Calculate historical balance points (going backwards)
      let tempBal = currentBal;
      historyPoints.forEach((point, idx) => {
        trend.unshift({ name: point.date, val: tempBal });
        tempBal -= (point.income - point.expenses);
      });
      setBalanceTrend(trend.slice(-10)); // Last 10 points for smoother chart

      // Process Cash Flow (group by month if many points, but report gives daily)
      const cashFlow = (reportRes.data?.incomeVsExpenses || []).slice(-7).map(p => {
        // Handle different date formats like "May 11" or "2024-05-11"
        const dateParts = p.date ? p.date.split(' ') : [];
        const name = dateParts.length > 1 ? dateParts[1] : (p.date || '');
        
        return {
          name: name, 
          income: (p.income || 0) / 1000, 
          expense: (p.expenses || 0) / 1000
        };
      });
      setCashFlowData(cashFlow);

      setSpendingByCat(reportRes.data?.categoryBreakdown || []);

      // Calculate total budget and spent from categories
      const totalBud = catRes.data.reduce((sum, cat) => sum + (cat.budget || 0), 0);
      const totalSp = catRes.data.reduce((sum, cat) => sum + (cat.spent || 0), 0);
      setBudgetSummary({ totalBudget: totalBud, totalSpent: totalSp });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Effect for searching and filtering
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);

  const fetchTransactions = async () => {
    setIsSearching(true);
    try {
      const params = {
        keyword: searchTerm,
        type: filters.type,
        category: filters.category,
        days: filters.days
      };
      const res = await api.get('/transactions', { params });
      setTransactions(res.data.slice(0, 10)); // Show more if searching/filtering
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'amount') {
      // Remove non-digits
      const rawValue = value.replace(/\D/g, '');
      // Format with dots
      value = rawValue ? new Intl.NumberFormat('vi-VN').format(rawValue) : '';
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề giao dịch");
      return;
    }
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ (> 0)");
      return;
    }
    if (!formData.category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    try {
      // Get numeric value by removing dots
      const numericAmount = parseFloat(formData.amount.replace(/\./g, ''));
      
      await api.post('/transactions', {
        ...formData,
        amount: numericAmount,
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
      toast.success(t("Transaction added successfully"));
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.errors 
        ? Object.values(error.response.data.errors).join(", ") 
        : t("Error saving transaction");
      toast.error(errorMsg);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + " đ";
  };

  return (
    <Layout>
      <div className="dashboard-grid">
        {/* Row 1: Balance & Budget */}
        <div className="premium-card balance-card">
          <div>
            <div className="card-label">Số dư hiện tại</div>
            <div className="balance-amount">{formatCurrency(summary.balance)}</div>
            <div className="balance-trend">
              {report?.savingsRate > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{report?.savingsRate}% tỷ lệ tiết kiệm tháng này</span>
            </div>
          </div>
          <div style={{ height: '100px', minHeight: '100px', width: '100%', marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTrend}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card budget-card">
          <div className="budget-header">
            <span className="budget-label">{t('Spending Budget')}</span>
            <span className="budget-month">{new Date().toLocaleString('default', { month: 'long' }).toUpperCase()}</span>
          </div>
          <div className="budget-value">{formatCurrency(budgetSummary.totalSpent)}</div>
          <div className="budget-status">
            {t('Spent')} <span>{budgetSummary.totalBudget > 0 ? Math.round((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100) : 0}%</span> {t('of limit')}
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${budgetSummary.totalBudget > 0 ? Math.min((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100, 100) : 0}%` }}></div>
          </div>
          <div className="budget-limits">
            <span>0 đ</span>
            <span>{formatCurrency(budgetSummary.totalBudget)}</span>
          </div>
          <button className="btn-detail" onClick={() => navigate('/budgets')}>{t('View budget details')}</button>
        </div>

        {/* Row 2: Recent Transactions & Add/Cashflow */}
        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{t('Recent Transactions')}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('Updated 2 minutes ago')}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
              <div className="search-bar" style={{ maxWidth: '200px' }}>
                <Search size={14} className="search-icon" />
                <input 
                  type="text" 
                  placeholder={t('Search...')} 
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.5rem 0.5rem 2rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className={`icon-btn ${showFilterOptions ? 'active' : ''}`} 
                style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px', 
                  padding: '0.5rem',
                  backgroundColor: showFilterOptions ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  color: showFilterOptions ? 'var(--primary)' : 'inherit'
                }}
                onClick={() => setShowFilterOptions(!showFilterOptions)}
              >
                <Filter size={16} />
              </button>

              {showFilterOptions && (
                <div className="filter-dropdown premium-card" style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  zIndex: 100, 
                  marginTop: '0.5rem',
                  padding: '1rem',
                  minWidth: '240px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('Transaction Type')}</label>
                    <select 
                      className="form-control" 
                      style={{ width: '100%', fontSize: '0.8125rem' }}
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                      <option value="">{t('All')}</option>
                      <option value="income">{t('Income')}</option>
                      <option value="expense">{t('Expense')}</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('Category')}</label>
                    <select 
                      className="form-control" 
                      style={{ width: '100%', fontSize: '0.8125rem' }}
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                    >
                      <option value="">{t('All')}</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      className="btn-detail" 
                      style={{ width: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        setFilters({ type: '', category: '', days: null });
                        setSearchTerm('');
                      }}
                    >
                      {t('Clear filters')}
                    </button>
                    <button 
                      className="btn-primary" 
                      style={{ width: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => setShowFilterOptions(false)}
                    >
                      {t('Close')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="transactions-list">
            {isSearching ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="loading-spinner"></div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Đang tìm kiếm...</p>
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((t, idx) => (
                <div key={t.id || idx} className="transaction-item-premium">
                  <div className="trans-info-group">
                    <div className="trans-icon-box" style={{ backgroundColor: t.type === 'income' ? '#e6f4ea' : '#f1f5f9', color: t.type === 'income' ? '#0d652d' : '#475569' }}>
                      {t.type === 'income' ? <TrendingUp size={20} /> : <ShoppingBag size={20} />}
                    </div>
                    <div className="trans-details">
                      <h4>{t.title}</h4>
                      <p>{t.category} • {new Date(t.date).toLocaleDateString(i18n.language === 'EN' ? 'en-US' : 'vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="trans-method">
                    <Wallet size={14} />
                    <span>{idx % 2 === 0 ? 'Thẻ Visa' : 'Tiền mặt'}</span>
                  </div>
                  <div className="trans-status success">Thành công</div>
                  <div className={`trans-amount ${t.type === 'income' ? 'income' : 'expense'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.875rem' }}>Không tìm thấy giao dịch nào khớp với yêu cầu.</p>
                {(searchTerm || filters.type || filters.category) && (
                  <button 
                    className="btn-detail" 
                    style={{ marginTop: '1rem', width: 'auto' }}
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ type: '', category: '', days: null });
                    }}
                  >
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button 
              onClick={() => navigate('/transactions')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Xem tất cả lịch sử giao dịch
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="premium-card add-transaction-card" style={{ padding: '1.5rem' }}>
            <h3 className="card-title">{t('Add Transaction')}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t('Title').toUpperCase()}</label>
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder={t('Enter title')} style={{ padding: '0.625rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t('Amount').toUpperCase()}</label>
                  <input name="amount" value={formData.amount} onChange={handleInputChange} placeholder="0 đ" style={{ padding: '0.625rem' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t('Type').toUpperCase()}</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} style={{ padding: '0.625rem' }}>
                    <option value="expense">{t('Expense')}</option>
                    <option value="income">{t('Income')}</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t('Category').toUpperCase()}</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={{ padding: '0.625rem' }}>
                    <option value="">{t('Select category')}</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t('Date').toUpperCase()}</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} style={{ padding: '0.625rem' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#0f172a' }}>
                <Plus size={18} /> {t('Save Changes')}
              </button>
            </form>
          </div>

          <div className="premium-card cash-flow-card">
            <div className="card-title">{t('Cash flow fluctuation last 30 days')}</div>
            <div className="trend-label">Net: {formatCurrency(report?.netCashFlow || 0)}</div>
            <div style={{ height: '180px', minHeight: '180px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <Bar dataKey="income" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => formatCurrency(value * 1000)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.65rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span>{t('Income')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <span>{t('Expense')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Spending Analysis */}
        <div className="premium-card analysis-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{t('Spending by Category')}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('Budget Allocation Detail')}</p>
            </div>
            <button className="btn-detail" onClick={() => navigate('/reports')} style={{ width: 'auto', padding: '0.5rem 1rem' }}>{t('View All')}</button>
          </div>

          <div className="spending-analysis-grid">
            <div className="category-stats-list">
              {spendingByCat.length > 0 ? spendingByCat.map((cat, idx) => (
                <div key={idx} className="cat-stat-item">
                  <div className="cat-stat-header">
                    <span>{cat.name}</span>
                    <span>{formatCurrency(cat.value)} ({Math.round(cat.percentage)}%)</span>
                  </div>
                  <div className="cat-stat-bar-bg">
                    <div className="cat-stat-bar-fill" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}></div>
                  </div>
                </div>
              )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('No transactions yet')}</div>}
            </div>

            <div className="analysis-insights">
              <div className="insight-box">
                <div className="insight-item">
                  <div className="insight-icon">
                    <Lightbulb size={18} className="text-success" color="#f59e0b" />
                  </div>
                  <div className="insight-details">
                    <h5>AI Financial Insight</h5>
                    <p>{report?.aiInsight || "Bắt đầu thêm giao dịch để nhận được các gợi ý quản lý tài chính thông minh từ AI."}</p>
                  </div>
                </div>
              </div>

              <div className="projection-box">
                <div className="projection-label">{t('MONTHLY BUDGET')}</div>
                <div className="projection-value">
                  {t('Estimated Spending')}: {formatCurrency(
                    budgetSummary.totalSpent > 0 
                    ? (budgetSummary.totalSpent / new Date().getDate()) * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
                    : 0
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </Layout>
  );
}

export default Dashboard;
