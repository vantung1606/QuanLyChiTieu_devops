import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, Clock, Repeat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

import { useToast } from '../context/ToastContext';

export default function RecurringModal({ isOpen, onClose, refresh }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: res.data[0].name }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        startDate: formData.startDate + "T00:00:00",
        endDate: formData.endDate ? formData.endDate + "T23:59:59" : null,
        nextExecutionDate: formData.startDate + "T00:00:00"
      };
      
      await api.post('/recurring', payload);
      refresh();
      onClose();
      // Reset form
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: categories.length > 0 ? categories[0].name : '',
        frequency: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      toast.success("Đã tạo giao dịch định kỳ thành công!");
    } catch (error) {
      console.error("Error creating recurring transaction:", error);
      toast.error("Có lỗi xảy ra khi tạo giao dịch định kỳ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Thêm giao dịch định kỳ</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>TÊN GIAO DỊCH</label>
            <div className="input-prefix">
              <input 
                type="text" 
                placeholder="Ví dụ: Tiền nhà, Netflix..." 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SỐ TIỀN</label>
              <div className="input-prefix">
                <span className="prefix">₫</span>
                <input 
                  type="text" 
                  placeholder="0" 
                  value={formData.amount ? new Intl.NumberFormat('vi-VN').format(formData.amount) : ''}
                  onChange={(e) => setFormData({...formData, amount: e.target.value.replace(/\D/g, '')})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>LOẠI</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense">Khoản chi (Expense)</option>
                <option value="income">Thu nhập (Income)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>DANH MỤC</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>TẦN SUẤT</label>
              <select 
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              >
                <option value="DAILY">Hàng ngày</option>
                <option value="WEEKLY">Hàng tuần</option>
                <option value="MONTHLY">Hàng tháng</option>
                <option value="YEARLY">Hàng năm</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>NGÀY BẮT ĐẦU</label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>NGÀY KẾT THÚC (TÙY CHỌN)</label>
              <input 
                type="date" 
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary w-full" style={{ padding: '0.875rem' }} disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo giao dịch định kỳ'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
