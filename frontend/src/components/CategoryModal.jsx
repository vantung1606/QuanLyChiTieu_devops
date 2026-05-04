import React, { useState } from 'react';
import axios from 'axios';
import { X, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, Briefcase, ShoppingBag, Plane, Car, Dog, LayoutGrid, Dumbbell } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const ICONS = [
  { id: 'Utensils', icon: Utensils },
  { id: 'GraduationCap', icon: GraduationCap },
  { id: 'Film', icon: Film },
  { id: 'Train', icon: Train },
  { id: 'Home', icon: Home },
  { id: 'HeartPulse', icon: HeartPulse },
  { id: 'Zap', icon: Zap },
  { id: 'Briefcase', icon: Briefcase },
  { id: 'ShoppingBag', icon: ShoppingBag },
  { id: 'Plane', icon: Plane },
  { id: 'Car', icon: Car },
  { id: 'Dog', icon: Dog },
  { id: 'Dumbbell', icon: Dumbbell },
  { id: 'LayoutGrid', icon: LayoutGrid },
];

const COLORS = [
  '#0f172a', // Dark
  '#006d5b', // Green
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#64748b', // Slate
];

export default function CategoryModal({ isOpen, onClose, refresh }) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Utensils');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/categories`, {
        name,
        icon: selectedIcon,
        color: selectedColor,
        budget: parseFloat(budget) || 0
      });
      setName('');
      setBudget('');
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Thêm danh mục mới</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên danh mục</label>
            <input 
              type="text" 
              placeholder="Ví dụ: Ăn uống, Du lịch..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Chọn biểu tượng</label>
            <div className="picker-grid">
              {ICONS.map((item) => {
                const IconComp = item.icon;
                return (
                  <div 
                    key={item.id} 
                    className={`icon-option ${selectedIcon === item.id ? 'active' : ''}`}
                    onClick={() => setSelectedIcon(item.id)}
                  >
                    <IconComp size={20} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Chọn màu chủ đạo</label>
            <div className="color-picker">
              {COLORS.map((color) => (
                <div 
                  key={color} 
                  className={`color-option ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Hạn mức chi tiêu hàng tháng</label>
            <div className="amount-input-wrapper">
              <span className="currency-prefix">₫</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

