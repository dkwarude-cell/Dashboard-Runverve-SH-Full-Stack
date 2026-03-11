import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: Date;
  action?: string;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Session Completed',
    message: 'Priya Sharma completed her Ultrasound Therapy session with 85% progress.',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    action: 'sessions',
  },
  {
    id: 'n2',
    title: 'Device Alert',
    message: 'SmartHeal Pro X2 battery critically low (15%). Please charge device.',
    type: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    action: 'device',
  },
  {
    id: 'n3',
    title: 'Critical Support Ticket',
    message: 'Device firmware update failed on Neuro N2. Assigned to Tech Support.',
    type: 'error',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    action: 'queries',
  },
  {
    id: 'n4',
    title: 'New Client Added',
    message: 'Karthik Rao has been registered and assigned to Sports Medicine program.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    action: 'clients',
  },
  {
    id: 'n5',
    title: 'Adherence Alert',
    message: 'Kavya Menon has missed 3 consecutive sessions. Consider follow-up.',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    action: 'clients',
  },
  {
    id: 'n6',
    title: 'Weekly Report Ready',
    message: 'Your weekly clinic performance report is ready for review.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    action: 'analytics',
  },
  {
    id: 'n7',
    title: 'Session Reminder',
    message: 'Arjun Patel has a Neurostimulation session scheduled at 11:30 AM today.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    action: 'sessions',
  },
  {
    id: 'n8',
    title: 'Insurance Approval',
    message: 'Vikram Reddy\'s extended therapy plan has been approved by insurance.',
    type: 'success',
    read: true,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    action: 'queries',
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    addNotification,
  };
}
