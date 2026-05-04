import React from 'react';

export default function TransactionForm({ formData, handleInputChange, handleSubmit }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Thêm giao dịch mới</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tiêu đề</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            required 
            placeholder="Nhập tiêu đề..."
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Số tiền (Min 0)</label>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleInputChange} 
              required 
              min="0" 
              step="1000"
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Loại</label>
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="expense">Chi tiêu</option>
              <option value="income">Thu nhập</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Danh mục</label>
          {/* using select as in image or input? Image has a select looking dropdown for Ăn uống. Let's make it a select or input with datalist. For simplicity, we use the original input, or change to select for matching the image. The image shows "Ăn uống" with a dropdown chevron. Let's use a select for categories or just keep it simple text input to avoid breaking backend expectations. Actually, original code has input type text. Let's use select with options. */}
          <select name="category" value={formData.category} onChange={handleInputChange} required>
            <option value="" disabled>Chọn danh mục</option>
            <option value="Ăn uống">Ăn uống</option>
            <option value="Lương">Lương</option>
            <option value="Học tập">Học tập</option>
            <option value="Di chuyển">Di chuyển</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="form-group">
          <label>Ngày thực hiện</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleInputChange} 
            required
          />
        </div>
        <button type="submit" className="primary">Thêm giao dịch</button>
      </form>
    </div>
  );
}
