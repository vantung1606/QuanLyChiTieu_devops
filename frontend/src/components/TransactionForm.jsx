import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TransactionForm({ formData, handleInputChange, handleSubmit, categories = [] }) {
  const { t } = useTranslation();
  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>{t('Add New Transaction')}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('Title')}</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            required 
            placeholder={t('Enter title')}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('Amount')} (Min 0)</label>
            <input 
              type="text" 
              name="amount" 
              value={formData.amount ? new Intl.NumberFormat('vi-VN').format(formData.amount) : ''} 
              onChange={handleInputChange} 
              required 
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>{t('Type')}</label>
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="expense">{t('Expense')}</option>
              <option value="income">{t('Income')}</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>{t('Category')}</label>
          <select name="category" value={formData.category} onChange={handleInputChange} required>
            <option value="" disabled>{t('Select category')}</option>
            {categories.map(cat => (
              <option key={cat.id || cat.name} value={cat.name}>
                {t(cat.name) || cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>{t('Date')}</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleInputChange} 
            required
          />
        </div>
        <button type="submit" className="primary">{t('Add Transaction')}</button>
      </form>
    </div>
  );
}
