import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const transRes = await axios.get(`${API_URL}/transactions`);
      setTransactions(transRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      try {
        await axios.delete(`${API_URL}/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(val)) + ' đ';
  };

  const getCategoryBadgeClass = (category) => {
    if (!category) return 'badge-default';
    const cat = category.toLowerCase();
    if (cat.includes('lương') || cat.includes('income')) return 'badge-luong';
    if (cat.includes('ăn uống') || cat.includes('food')) return 'badge-an-uong';
    if (cat.includes('học tập') || cat.includes('education')) return 'badge-hoc-tap';
    if (cat.includes('di chuyển') || cat.includes('travel')) return 'badge-di-chuyen';
    if (cat.includes('phần mềm') || cat.includes('software')) return 'badge-di-chuyen';
    return 'badge-default';
  };

  // Mock sub-titles for demo based on image
  const getSubTitle = (title) => {
    if (title.toLowerCase().includes('aws')) return "Đăng ký hàng tháng";
    if (title.toLowerCase().includes('thưởng')) return "Thưởng hiệu suất";
    if (title.toLowerCase().includes('cà phê')) return "Họp nhóm buổi sáng";
    return "";
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          <Header />
          
          <div className="page-header">
            <div>
              <h2 className="page-title">Giao dịch</h2>
              <p className="page-subtitle">Xem và quản lý tất cả các hoạt động tài chính của bạn tại một nơi.</p>
            </div>
            <div className="page-actions">
              <button className="btn-outline">
                <Calendar size={16} /> 30 Ngày qua
              </button>
              <button className="btn-outline">
                <Filter size={16} /> Tất cả danh mục
              </button>
              <span style={{flex: 1}}></span>
              <button className="btn-outline">
                <Download size={16} /> Tải CSV
              </button>
              <button className="btn-primary">
                <Plus size={16} /> Thêm giao dịch mới
              </button>
            </div>
          </div>

          <div className="card table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NGÀY</th>
                  <th>TIÊU ĐỀ</th>
                  <th>DANH MỤC</th>
                  <th>LOẠI</th>
                  <th style={{ textAlign: 'right' }}>SỐ TIỀN</th>
                  <th style={{ textAlign: 'center' }}>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>Chưa có giao dịch nào</td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id}>
                      <td className="date-cell">
                        {new Date(t.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <div className="title-cell">
                          <strong>{t.title}</strong>
                          <span>{getSubTitle(t.title) || t.category}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`category-badge ${getCategoryBadgeClass(t.category)}`}>
                          {t.category}
                        </span>
                      </td>
                      <td>
                        <div className={`type-cell ${t.type}`}>
                          {t.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {t.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`amount ${t.type}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      <td>
                        <div className="action-cells">
                          <button className="action-icon" title="Sửa"><Edit2 size={16} /></button>
                          <button className="action-icon danger" title="Xóa" onClick={() => handleDelete(t.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {transactions.length > 0 && (
              <div className="pagination-footer">
                <span>Đang xem 1 đến {transactions.length} trong {transactions.length} giao dịch</span>
                <div className="pagination-buttons">
                  <button className="btn-page disabled">Trước</button>
                  <button className="btn-page active">Tiếp</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
