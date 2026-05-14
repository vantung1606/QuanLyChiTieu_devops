import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TransactionModal({ isOpen, onClose, formData, handleInputChange, handleSubmit, categories = [], isEditing = false }) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{isEditing ? t('Edit') : t('Add New Transaction')}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('TITLE_CELL')}</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder={t('Enter title')} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('AMOUNT')}</label>
              <div className="input-prefix">
                <span className="prefix">đ</span>
                <input 
                  type="text" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleInputChange} 
                  placeholder="0" 
                  required 
                />
              </div>
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
            <label>{t('CATEGORY')}</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">{t('Select category')}</option>
              {categories.map(cat => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('DATE_CELL')}</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary w-full" style={{ marginTop: '1.5rem', padding: '0.875rem' }}>
            {isEditing ? t('Save Changes') : t('Add Transaction')}
          </button>
          
          <button type="button" className="btn-cancel" onClick={onClose}>
            {t('Cancel')}
          </button>
        </form>
      </div>
    </div>
  );
}
