import React from 'react';
import { LogOut, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-icon">
          <div className="icon-wrapper">
            <LogOut size={32} />
          </div>
        </div>
        
        <div className="modal-content">
          <h3>{t('Confirm Logout')}</h3>
          <p>{t('Are you sure leave session message')}</p>
        </div>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            {t('Cancel')}
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            {t('Logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
