import React from 'react';
import { Filter, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TransactionList({ transactions, formatCurrency, handleDelete }) {
  const { t, i18n } = useTranslation();
  
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
        {t('Recent Transactions')}
        <div className="table-actions">
          <button className="table-icon-btn"><Filter size={16} /></button>
          <button className="table-icon-btn"><Search size={16} /></button>
        </div>
      </h3>

      {transactions.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t('No transactions yet')}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>{t('DATE')}</th>
                <th>{t('TITLE')}</th>
                <th>{t('CATEGORY')}</th>
                <th style={{ textAlign: 'right' }}>{t('AMOUNT')}</th>
                <th style={{ textAlign: 'right' }}>{t('ACTION')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(item => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(item.date).toLocaleDateString(i18n.language === 'EN' ? 'en-US' : 'vi-VN')}
                  </td>
                  <td style={{ fontWeight: 500 }}>{item.title}</td>
                  <td>
                    <span className={`category-badge ${getCategoryBadgeClass(item.category)}`}>
                      {t(item.category) || item.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`amount ${item.type}`}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span className="action-edit" onClick={() => handleDelete(item.id)}>
                        {t('Edit')} <ChevronRight size={14} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span>{t('Showing')} {transactions.length} {t('of')} {transactions.length} {t('transactions_count')}</span>
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
