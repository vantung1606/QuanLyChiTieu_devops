import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
            <AlertTriangle size={20} /> {t('Delete confirmation')}
          </h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
          <button 
            className="btn-cancel" 
            style={{ flex: 1, margin: 0 }} 
            onClick={onClose}
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button 
            className="btn-danger" 
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              backgroundColor: 'var(--danger)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }} 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}
