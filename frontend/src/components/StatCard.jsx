import React from 'react';

export default function StatCard({ title, amount, type, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-title">{title}</div>
        <div className={`stat-value ${type}`}>{amount}</div>
      </div>
      <div className={`stat-icon ${type}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}
