import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, 
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  ShoppingBag, Car, Home, Coffee, Info, Lightbulb
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Layout from '../components/Layout';

import { useToast } from '../context/ToastContext';

export default function Reports() {
  const { t } = useTranslation();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/financial-performance', {
        params: {
          month: selectedMonth,
          year: selectedYear
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error("Không thể tải dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await api.get('/reports/export/pdf', {
        params: {
          month: selectedMonth,
          year: selectedYear
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial_report_${selectedYear}_${selectedMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t('Download successful'));
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error("Không thể tải báo cáo. Vui lòng thử lại sau.");
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Layout>
      {loading && !data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ height: '40px', width: '200px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height: '120px', backgroundColor: '#e2e8f0', borderRadius: '1rem', animation: 'pulse 1.5s infinite' }}></div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div style={{ height: '350px', backgroundColor: '#e2e8f0', borderRadius: '1rem', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '350px', backgroundColor: '#e2e8f0', borderRadius: '1rem', animation: 'pulse 1.5s infinite' }}></div>
          </div>
        </div>
      ) : !data ? (
        <div className="error-state" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '1rem' }}>
          {t('Cannot load report data')}
        </div>
      ) : (
        <>
          <div className="reports-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', marginTop: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('Financial Report')}</h1>
              <p style={{ color: 'var(--text-muted)' }}>{t('Detailed analysis of flow')}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="date-picker-actual" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.5rem 0.75rem', 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border)', 
                borderRadius: '0.5rem'
              }}>
                <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  style={{ border: 'none', background: 'none', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
                >
                  {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                </select>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  style={{ border: 'none', background: 'none', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button 
                className="btn-export" 
                onClick={handleExportPDF}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.625rem 1.25rem', 
                  backgroundColor: '#0f172a', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Download size={18} /> {t('Export PDF')}
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <StatCard label={t('Savings Rate')} value={(data?.savingsRate || 0) + "%"} change="+2.1%" color="#10b981" />
            <StatCard label={t('Top Spending Category')} value={t(data?.topSpendingCategory) || data?.topSpendingCategory || t('None')} subValue={(data?.topSpendingAmount || 0).toLocaleString() + " VNĐ"} icon={<ShoppingBag size={20} />} color="#ef4444" />
            <StatCard label={t('Net Cash Flow')} value={(data?.netCashFlow || 0).toLocaleString() + " VNĐ"} change="+4.2k" color="#3b82f6" />
            <StatCard label={t('Estimated Tax')} value={(data?.taxLiabilityEst || 0).toLocaleString() + " VNĐ"} badge="Q4 PROJECTION" color="#64748b" />
          </div>

          {/* Main Charts Area */}
          <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{t('Income vs Expenses')}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('Cash flow fluctuation last 30 days')}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0f172a' }}></div>
                    <span style={{color: 'var(--text-main)'}}>{t('Income')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e2e8f0' }}></div>
                    <span style={{color: 'var(--text-main)'}}>{t('Expense')}</span>
                  </div>
                </div>
              </div>
              <div style={{ height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.incomeVsExpenses || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                      cursor={{ fill: 'var(--bg-app)' }}
                    />
                    <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>{t('Spending by Category')}</h3>
              <div style={{ height: '220px', minHeight: '220px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.categoryBreakdown || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(data?.categoryBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>VNĐ {(data?.topSpendingAmount || 0).toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('Total')}</div>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                {(data?.categoryBreakdown || []).slice(0, 3).map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: cat.color || COLORS[idx % COLORS.length] }}></div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t(cat.name) || cat.name}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{(cat.percentage || 0).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Area */}
          <div className="dashboard-grid">
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{t('Top Outflows')}</h3>
                <button style={{ fontSize: '0.875rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>{t('View All')}</button>
              </div>
              <div className="outflows-list">
                {(data?.topOutflows || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: idx === (data?.topOutflows || []).length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <ShoppingBag size={20} style={{ margin: 'auto' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t(item.category) || item.category} • {t('Monthly')}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      -{(item.amount || 0).toLocaleString()} VNĐ
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card ai-insight-card" style={{ 
              padding: '2rem', 
              backgroundColor: '#0f172a', 
              borderRadius: '1rem', 
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <Lightbulb size={24} className="text-yellow-400" color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>{t('AI Financial Insight')}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
                {data?.aiInsight}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ 
                  padding: '0.625rem 1.25rem', 
                  backgroundColor: '#fff', 
                  color: '#0f172a', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>{t('Confirm Plan')}</button>
                <button style={{ 
                  padding: '0.625rem 1.25rem', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>{t('Details')}</button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

function StatCard({ label, value, subValue, change, badge, icon, color }) {
  const { t } = useTranslation();
  return (
    <div className="stat-card" style={{ 
      padding: '1.5rem', 
      backgroundColor: 'var(--bg-card)', 
      borderRadius: '1rem', 
      border: '1px solid var(--border)',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    }}>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        {icon && <div style={{ color: color }}>{icon}</div>}
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{value}</div>
        {change && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            color: color === '#ef4444' ? '#ef4444' : '#10b981' 
          }}>
            {color === '#ef4444' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {change}
          </div>
        )}
      </div>
      {subValue && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subValue} {t('Spending this month')}</div>}
      {badge && (
        <span style={{ 
          fontSize: '0.625rem', 
          fontWeight: 700, 
          padding: '0.25rem 0.5rem', 
          backgroundColor: 'var(--bg-app)', 
          color: 'var(--text-muted)', 
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>{badge}</span>
      )}
    </div>
  );
}
