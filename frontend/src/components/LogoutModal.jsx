import React from 'react';
import { LogOut, X } from 'lucide-react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
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
          <h3>Xác nhận đăng xuất</h3>
          <p>Bạn có chắc chắn muốn rời khỏi phiên làm việc này không? Mọi thay đổi chưa lưu sẽ bị mất.</p>
        </div>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Hủy bỏ
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
