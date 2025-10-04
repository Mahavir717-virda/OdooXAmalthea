import React, { useState } from 'react';
import { Bell, Check, X, Clock, DollarSign } from 'lucide-react';
import { Notification } from '../../types';
import { mockNotifications } from '../../services/api';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      userId: '1',
      type: 'expense_submitted',
      title: 'New Expense Submitted',
      message: 'John Doe submitted a new expense for $250.00',
      isRead: false,
      relatedExpenseId: '1',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      userId: '1',
      type: 'expense_approved',
      title: 'Expense Approved',
      message: 'Your expense for $150.00 has been approved',
      isRead: false,
      relatedExpenseId: '2',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expense_approved':
        return <Check className="text-green-400" size={20} />;
      case 'expense_rejected':
        return <X className="text-red-400" size={20} />;
      case 'approval_required':
        return <Clock className="text-yellow-400" size={20} />;
      case 'expense_submitted':
        return <DollarSign className="text-blue-400" size={20} />;
      default:
        return <Bell className="text-gray-400" size={20} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'expense_approved':
        return 'border-green-700 bg-green-900/20';
      case 'expense_rejected':
        return 'border-red-700 bg-red-900/20';
      case 'approval_required':
        return 'border-yellow-700 bg-yellow-900/20';
      default:
        return 'border-blue-700 bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full border border-red-500">
              {unreadCount} New
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors border-2 border-gray-600"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border-2 border-gray-700 p-12 text-center">
            <Bell className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg">No notifications yet</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-gray-800 rounded-lg border-2 ${
                notification.isRead ? 'border-gray-700' : getNotificationColor(notification.type)
              } p-6 transition-all ${notification.isRead ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors border border-gray-600"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors border border-red-500"
                        title="Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-2">{notification.message}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
