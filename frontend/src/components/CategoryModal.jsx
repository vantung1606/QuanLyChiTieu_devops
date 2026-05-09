import React, { useState } from 'react';
import { X, Utensils, GraduationCap, Film, Train, Home, HeartPulse, Zap, Briefcase, ShoppingBag, Plane, Car, Dog, LayoutGrid, Dumbbell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

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
  const { t } = useTranslation();
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
      await api.post('/categories', {
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
      alert(error.response?.data?.message || t('Error creating category'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>{t('Add category')}</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('Category name')}</label>
            <input 
              type="text" 
              placeholder={t('Example: Dining, Travel...')} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>{t('Select icon')}</label>
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
            <label>{t('Select main color')}</label>
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
            <label>{t('Monthly spending limit')}</label>
            <div className="input-prefix">
              <span className="prefix">₫</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary w-full" style={{ padding: '0.875rem' }} disabled={loading}>
              {loading ? t('Creating...') : t('Create Category')}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              {t('Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
