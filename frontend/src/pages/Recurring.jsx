import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, Clock, MoreVertical, Trash2, CheckCircle, AlertCircle, PlayCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import RecurringModal from '../components/RecurringModal';
import Layout from '../components/Layout';

import { useToast } from '../context/ToastContext';

export default function Recurring() {
  const { t } = useTranslation();
  const toast = useToast();
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRecurring();
  }, []);

  const fetchRecurring = async () => {
    try {
      const res = await api.get('/recurring');
      setRecurring(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recurring:", error);
      setLoading(false);
    }
  };

  const handleTriggerNow = async () => {
    try {
      await api.post('/recurring/process');
      fetchRecurring();
      toast.success(t('Manual processing activated'));
    } catch (error) {
      console.error("Error triggering processing:", error);
      toast.error("Không thể kích hoạt xử lý.");
    }
  };

  const handleDelete = async (id) => {
    toast.confirm(
      "Xác nhận xóa", 
      "Bạn có chắc muốn xóa giao dịch định kỳ này?", 
      async () => {
        try {
          await api.delete(`/recurring/${id}`);
          fetchRecurring();
          toast.success(t('Recurring transaction deleted'));
        } catch (error) {
          console.error("Error deleting recurring:", error);
          toast.error("Lỗi khi xóa giao dịch.");
        }
      }
    );
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  return (
    <Layout>
          <div className="page-header">
            <div>
              <h2 className="page-title">Giao dịch định kỳ</h2>
              <p className="page-subtitle">Tự động hóa các khoản chi cố định hàng tháng</p>
            </div>
            <div className="page-actions">
              <button className="btn-outline" onClick={handleTriggerNow}>
                <PlayCircle size={16} /> Chạy ngay
              </button>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> Thêm định kỳ
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>TIÊU ĐỀ</th>
                  <th>SỐ TIỀN</th>
                  <th>TẦN SUẤT</th>
                  <th>NGÀY TIẾP THEO</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '3rem'}}>Đang tải...</td></tr>
                ) : recurring.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chưa có giao dịch định kỳ nào.</td></tr>
                ) : (
                  recurring.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
                      </td>
                      <td style={{ color: item.type === 'expense' ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                        {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
                      </td>
                      <td>
                        <span className="badge-outline" style={{ textTransform: 'capitalize' }}>
                          {item.frequency.toLowerCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} className="text-muted" />
                          {new Date(item.nextExecutionDate).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td>
                        {item.active ? (
                          <span className="status-badge on-track" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'fit-content' }}>
                            <CheckCircle size={12} /> Đang chạy
                          </span>
                        ) : (
                          <span className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'fit-content', background: '#f1f5f9', color: '#64748b' }}>
                            <AlertCircle size={12} /> Đã dừng
                          </span>
                        )}
                      </td>
                      <td>
                        <button className="action-icon danger" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        <RecurringModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          refresh={fetchRecurring}
        />
    </Layout>
  );
}
