import React from 'react';
import { Filter, Search, ChevronRight, ChevronLeft } from 'lucide-react';

export default function TransactionList({ transactions, formatCurrency, handleDelete }) {
  
  const getCategoryBadgeClass = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('lương')) return 'badge-luong';
    if (cat.includes('ăn uống')) return 'badge-an-uong';
    if (cat.includes('học tập')) return 'badge-hoc-tap';
    if (cat.includes('di chuyển')) return 'badge-di-chuyen';
    return 'badge-default';
  };

  return (
    <div className="card">
      <h3>
        Danh sách giao dịch
        <div className="table-actions">
          <button className="table-icon-btn"><Filter size={16} /></button>
          <button className="table-icon-btn"><Search size={16} /></button>
        </div>
      </h3>

      {transactions.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Chưa có giao dịch nào.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>NGÀY</th>
                <th>TÊN KHOẢN CHI</th>
                <th>DANH MỤC</th>
                <th style={{ textAlign: 'right' }}>SỐ TIỀN</th>
                <th style={{ textAlign: 'right' }}>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(t.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ fontWeight: 500 }}>{t.title}</td>
                  <td>
                    <span className={`category-badge ${getCategoryBadgeClass(t.category)}`}>
                      {t.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span className="action-edit" onClick={() => handleDelete(t.id)}>
                        Sửa <ChevronRight size={14} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span>Hiển thị {transactions.length} trong số {transactions.length} giao dịch</span>
            <div className="page-controls">
              <button className="page-btn"><ChevronLeft size={16} /></button>
              <button className="page-btn"><ChevronRight size={16} /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
