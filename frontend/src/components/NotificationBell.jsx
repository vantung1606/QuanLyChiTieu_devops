import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { IoNotificationsOutline } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const NotificationBell = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async (showToast = false) => {
    try {
      const response = await axios.get('/notifications');
      const newNotifications = response.data;
      const newUnreadCount = newNotifications.filter(n => !n.isRead).length;
      
      // Nếu có thông báo mới (chưa đọc) thì hiện toast
      if (showToast && newUnreadCount > unreadCount) {
        const latestNotif = newNotifications.find(n => !n.isRead);
        if (latestNotif) {
          toast(latestNotif.message, {
            icon: '🔔',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }
      }
      
      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications(false);
    // Polling every 15 seconds for faster updates
    const interval = setInterval(() => fetchNotifications(true), 15000);
    return () => clearInterval(interval);
  }, [unreadCount]); // Re-run when unreadCount changes to keep ref fresh

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'BUDGET_EXCEEDED': return '#ef4444'; // Đỏ
      case 'BUDGET_WARNING': return '#f59e0b';  // Vàng/Cam
      case 'RECURRING_PAID': return '#10b981'; // Xanh lá
      default: return '#3b82f6';
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <IoNotificationsOutline size={28} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>{t('Notifications')}</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>{t('Mark all as read')}</button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">{t('No notifications')}</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                >
                  {!n.isRead && (
                    <div 
                      className="notification-unread-dot" 
                      style={{ backgroundColor: getIconColor(n.type) }}
                    ></div>
                  )}
                  <div className="notification-content" style={{ opacity: n.isRead ? 0.6 : 1 }}>
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                    <span className="notification-time">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-bell-container {
          position: relative;
        }
        .notification-icon {
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          position: relative;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .notification-icon:hover {
          transform: scale(1.1);
          color: var(--primary-color);
        }
        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border: 2px solid var(--bg-card);
        }
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 320px;
          background: var(--bg-card);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid var(--border-color);
          z-index: 1000;
          margin-top: 10px;
          overflow: hidden;
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .notification-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-sidebar);
        }
        .notification-header h3 {
          font-size: 14px;
          margin: 0;
          font-weight: 600;
        }
        .notification-header button {
          background: none;
          border: none;
          color: var(--primary-color);
          font-size: 12px;
          cursor: pointer;
          padding: 0;
        }
        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }
        .notification-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .notification-item:hover {
          background: rgba(0,0,0,0.02);
        }
        .notification-item.unread {
          background: rgba(59, 130, 246, 0.05);
        }
        .notification-unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
        }
        .notification-content h4 {
          font-size: 13px;
          margin: 0 0 4px 0;
          font-weight: 600;
        }
        .notification-content p {
          font-size: 12px;
          margin: 0 0 6px 0;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .notification-time {
          font-size: 10px;
          color: #94a3b8;
        }
        .no-notifications {
          padding: 30px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
        }

        @media (max-width: 480px) {
          .notification-dropdown {
            position: fixed;
            top: 75px;
            left: 20px;
            right: 20px;
            width: auto;
            margin-top: 0;
            border-radius: 12px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          }
          
          .notification-list {
            max-height: 50vh;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
