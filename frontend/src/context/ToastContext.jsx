/* eslint-disable react-hooks/exhaustive-deps, react-hooks/preserve-manual-memoization, react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setConfirm({ title, message, onConfirm });
  }, []);

  const closeConfirm = () => setConfirm(null);

  const handleConfirm = () => {
    if (confirm?.onConfirm) confirm.onConfirm();
    closeConfirm();
  };

  return (
    <ToastContext.Provider value={{ addToast, showConfirm }}>
      {children}
      
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <div className="modal-overlay">
          <div className="modal-card confirm-modal">
            <div className="modal-header">
              <h3>{confirm.title}</h3>
              <button className="close-btn" onClick={closeConfirm}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem 0' }}>
              <p>{confirm.message}</p>
            </div>
            <div className="modal-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-outline" onClick={closeConfirm}>{t('Cancel') || 'Hủy'}</button>
              <button className="btn-primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleConfirm}>{t('Confirm') || 'Xác nhận'}</button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return {
    success: (msg) => context.addToast(msg, 'success'),
    error: (msg) => context.addToast(msg, 'error'),
    info: (msg) => context.addToast(msg, 'info'),
    confirm: (title, msg, onConfirm) => context.showConfirm(title, msg, onConfirm)
  };
};
