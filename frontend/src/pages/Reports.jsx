import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, PieChart, 
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  ShoppingBag, Car, Home, Coffee, Info, Lightbulb
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/reports/financial-performance');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner" style={{ padding: '2rem' }}>
          <Header />
          
          {loading ? (
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
              Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.
            </div>
          ) : (
            <>
              <div className="reports-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', marginTop: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Báo cáo tài chính</h1>
          <p style={{ color: '#64748b' }}>Phân tích chi tiết về dòng tiền và chi tiêu của bạn.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="date-picker-mock" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.625rem 1rem', 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#475569'
          }}>
            <Calendar size={18} />
            <span>01 Th10, 2023 - 31 Th10, 2023</span>
          </div>
          <button className="btn-export" style={{ 
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
          }}>
            <Download size={18} /> Xuất PDF
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard label="Tỷ lệ tiết kiệm" value={data.savingsRate + "%"} change="+2.1%" color="#10b981" />
        <StatCard label="Hạng mục chi tiêu lớn nhất" value={data.topSpendingCategory} subValue={data.topSpendingAmount.toLocaleString() + " VNĐ"} icon={<ShoppingBag size={20} />} color="#ef4444" />
        <StatCard label="Dòng tiền thuần" value={data.netCashFlow.toLocaleString() + " VNĐ"} change="+4.2k" color="#3b82f6" />
        <StatCard label="Thuế ước tính" value={data.taxLiabilityEst.toLocaleString() + " VNĐ"} badge="Q4 PROJECTION" color="#64748b" />
      </div>

      {/* Main Charts Area */}
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>Thu nhập vs. Chi phí</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Biến động dòng tiền 30 ngày qua</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0f172a' }}></div>
                <span>Thu nhập</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e2e8f0' }}></div>
                <span>Chi phí</span>
              </div>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.incomeVsExpenses} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="income" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="expenses" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem' }}>Chi tiêu theo hạng mục</h3>
          <div style={{ height: '220px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={data.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>${(data.topSpendingAmount / 1000).toFixed(0)}k</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tổng cộng</div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            {data.categoryBreakdown.slice(0, 3).map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: cat.color || COLORS[idx % COLORS.length] }}></div>
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{cat.percentage.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>Chi tiêu lớn nhất</h3>
            <button style={{ fontSize: '0.875rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>Xem tất cả</button>
          </div>
          <div className="outflows-list">
            {data.topOutflows.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: idx === data.topOutflows.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#64748b' }}>
                    <ShoppingBag size={20} style={{ margin: 'auto' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category} • Hàng tháng</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  -{item.amount.toLocaleString()} VNĐ
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>AI Financial Insight</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
            {data.aiInsight}
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
            }}>Xác nhận kế hoạch</button>
            <button style={{ 
              padding: '0.625rem 1.25rem', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}>Chi tiết</button>
          </div>
        </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, change, badge, icon, color }) {
  return (
    <div className="stat-card" style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fff', 
      borderRadius: '1rem', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        {icon && <div style={{ color: color }}>{icon}</div>}
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{value}</div>
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
      {subValue && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{subValue} tháng này</div>}
      {badge && (
        <span style={{ 
          fontSize: '0.625rem', 
          fontWeight: 700, 
          padding: '0.25rem 0.5rem', 
          backgroundColor: '#f1f5f9', 
          color: '#64748b', 
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>{badge}</span>
      )}
    </div>
  );
}
