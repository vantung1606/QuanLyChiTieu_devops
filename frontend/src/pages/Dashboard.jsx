import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Landmark, Plus, Calendar, Search, Filter, ShoppingBag, Car, Home, Coffee, Info, Lightbulb, Wallet, CheckCircle2, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
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
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [balanceTrend, setBalanceTrend] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [spendingByCat, setSpendingByCat] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      const [transRes, summaryRes, catRes, reportRes] = await Promise.all([
        api.get('/transactions'),
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
      const cashFlow = (reportRes.data?.incomeVsExpenses || []).slice(-7).map(p => ({
        name: p.date ? p.date.split(' ')[1] : '', 
        income: (p.income || 0) / 1000, 
        expense: (p.expenses || 0) / 1000
      }));
      setCashFlowData(cashFlow);

      setSpendingByCat(reportRes.data?.categoryBreakdown || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'amount') value = value.replace(/\D/g, '');
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
      toast.success("Đã thêm giao dịch thành công!");
    } catch (error) {
      toast.error("Lỗi khi lưu giao dịch.");
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + " đ";
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner" style={{ padding: '2rem' }}>
          <Header />
          
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
              <div style={{ height: '100px', width: '100%', marginTop: 'auto' }}>
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
                <span className="budget-label">Ngân sách chi tiêu</span>
                <span className="budget-month">THÁNG 10</span>
              </div>
              <div className="budget-value">{formatCurrency(48500000)}</div>
              <div className="budget-status">Đã tiêu <span>82%</span> hạn mức</div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '82%' }}></div>
              </div>
              <div className="budget-limits">
                <span>0 đ</span>
                <span>60,000,000 đ</span>
              </div>
              <button className="btn-detail">Xem chi tiết hạn mức</button>
            </div>

            {/* Row 2: Recent Transactions & Add/Cashflow */}
            <div className="premium-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Giao dịch gần đây</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cập nhật 2 phút trước</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div className="search-bar" style={{ maxWidth: '200px' }}>
                    <Search size={14} className="search-icon" />
                    <input type="text" placeholder="Tìm kiếm..." style={{ fontSize: '0.75rem', padding: '0.5rem 0.5rem 0.5rem 2rem' }} />
                  </div>
                  <button className="icon-btn" style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem' }}>
                    <Filter size={16} />
                  </button>
                </div>
              </div>
              
              <div className="transactions-list">
                {transactions.map((t, idx) => (
                  <div key={t.id || idx} className="transaction-item-premium">
                    <div className="trans-info-group">
                      <div className="trans-icon-box" style={{ backgroundColor: t.type === 'income' ? '#e6f4ea' : '#f1f5f9', color: t.type === 'income' ? '#0d652d' : '#475569' }}>
                        {t.type === 'income' ? <TrendingUp size={20} /> : <ShoppingBag size={20} />}
                      </div>
                      <div className="trans-details">
                        <h4>{t.title}</h4>
                        <p>{t.category} • {new Date(t.date).toLocaleDateString('vi-VN')}</p>
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
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>Xem tất cả lịch sử giao dịch</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="premium-card add-transaction-card" style={{ padding: '1.5rem' }}>
                <h3 className="card-title">Thêm giao dịch</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>TIÊU ĐỀ</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Ví dụ: Ăn trưa..." style={{ padding: '0.625rem' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>SỐ TIỀN</label>
                      <input name="amount" value={formData.amount} onChange={handleInputChange} placeholder="0 đ" style={{ padding: '0.625rem' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>LOẠI</label>
                      <select name="type" value={formData.type} onChange={handleInputChange} style={{ padding: '0.625rem' }}>
                        <option value="expense">Chi tiêu</option>
                        <option value="income">Thu nhập</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>DANH MỤC</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} style={{ padding: '0.625rem' }}>
                      <option value="">Chọn danh mục</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#0f172a' }}>
                    <Plus size={18} /> Lưu giao dịch
                  </button>
                </form>
              </div>

              <div className="premium-card cash-flow-card">
                <div className="card-title">Dòng tiền 7 ngày qua</div>
                <div className="trend-label">Net: {formatCurrency(report?.netCashFlow || 0)}</div>
                <div style={{ height: '180px', width: '100%' }}>
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
                    <span>Thu nhập</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                    <span>Chi tiêu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Spending Analysis */}
            <div className="premium-card" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Phân tích chi tiêu</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phân bổ chi phí theo danh mục tháng này</p>
                </div>
                <button className="btn-detail" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Chi tiết báo cáo</button>
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
                  )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Chưa có dữ liệu chi tiêu tháng này.</div>}
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
                    <div className="projection-label">DỰ BÁO CUỐI THÁNG</div>
                    <div className="projection-value">Dự kiến chi tiêu: {formatCurrency(52400000)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="fab">
          <Plus size={24} />
        </button>

        <div className="status-bar">
          <div className="sys-ops">
            ENV: PRODUCTION &nbsp;&nbsp; STATUS: STABLE &nbsp;&nbsp; VERSION: V2.4.12
          </div>
          <div className="sys-ops">
            <div className="dot"></div>
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
