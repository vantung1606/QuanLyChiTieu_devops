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
          <h3>{isEditing ? t('Edit transaction') || 'Chỉnh sửa giao dịch' : t('Add new transaction') || 'Thêm giao dịch mới'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('TITLE_CELL') || 'Tiêu đề'}</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder={t('Example: Monthly rent') || "Ví dụ: Tiền nhà hàng tháng"} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('AMOUNT') || 'Số tiền'}</label>
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
              <label>{t('Type') || 'Loại'}</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="expense">{t('Expense') || 'Chi tiêu'}</option>
                <option value="income">{t('Income') || 'Thu nhập'}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{t('CATEGORY') || 'Danh mục'}</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">{t('Select Category') || 'Chọn danh mục'}</option>
              {categories.map(cat => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('DATE_CELL') || 'Ngày'}</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary w-full" style={{ marginTop: '1.5rem', padding: '0.875rem' }}>
            {isEditing ? t('Update transaction') || 'Cập nhật giao dịch' : t('Add transaction') || 'Thêm giao dịch'}
          </button>
          
          <button type="button" className="btn-cancel" onClick={onClose}>
            {t('Cancel') || 'Hủy'}
          </button>
        </form>
      </div>
    </div>
  );
}
