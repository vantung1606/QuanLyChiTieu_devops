import React from 'react';
import { X } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, formData, handleInputChange, handleSubmit, categories = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Thêm giao dịch mới</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tiêu đề</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder="Ví dụ: Tiền nhà hàng tháng" 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số tiền</label>
              <div className="input-prefix">
                <span className="prefix">đ</span>
                <input 
                  type="text" 
                  name="amount" 
                  value={formData.amount ? new Intl.NumberFormat('vi-VN').format(formData.amount) : ''} 
                  onChange={handleInputChange} 
                  placeholder="0" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Loại</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="expense">Chi tiêu</option>
                <option value="income">Thu nhập</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Danh mục</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">Chọn danh mục</option>
              {categories.map(cat => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ngày</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary w-full" style={{ marginTop: '1.5rem', padding: '0.875rem' }}>
            Thêm giao dịch
          </button>
          
          <button type="button" className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
}
