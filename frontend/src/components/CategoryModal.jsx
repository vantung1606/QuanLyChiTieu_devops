import React, { useState } from 'react';
import { X, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, Briefcase, ShoppingBag, Plane, Car, Dog, LayoutGrid, Dumbbell } from 'lucide-react';

const ICONS = [
  { id: 'food', icon: Utensils },
  { id: 'education', icon: GraduationCap },
  { id: 'entertainment', icon: Film },
  { id: 'transport', icon: Train },
  { id: 'housing', icon: Home },
  { id: 'health', icon: HeartPulse },
  { id: 'utilities', icon: Zap },
  { id: 'work', icon: Briefcase },
  { id: 'shopping', icon: ShoppingBag },
  { id: 'travel', icon: Plane },
  { id: 'car', icon: Car },
  { id: 'pets', icon: Dog },
  { id: 'gym', icon: Dumbbell },
  { id: 'other', icon: LayoutGrid },
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

export default function CategoryModal({ isOpen, onClose }) {
  const [selectedIcon, setSelectedIcon] = useState('food');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Thêm danh mục mới</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="form-group">
            <label>Tên danh mục</label>
            <input type="text" placeholder="Ví dụ: Ăn uống, Du lịch..." required />
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
              <input type="number" placeholder="0.00" />
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Tạo danh mục</button>
          </div>
        </form>
      </div>
    </div>
  );
}
