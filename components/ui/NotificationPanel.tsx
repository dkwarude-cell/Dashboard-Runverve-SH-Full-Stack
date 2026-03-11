import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  X,
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react-native';
import type { Notification } from '@/hooks/useNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
}

function getTypeIcon(type: Notification['type']) {
  switch (type) {
    case 'success': return CheckCircle;
    case 'warning': return AlertTriangle;
    case 'error': return AlertCircle;
    default: return Info;
  }
}

function getTypeColor(type: Notification['type']) {
  switch (type) {
    case 'success': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'error': return '#ef4444';
    default: return '#3b82f6';
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
}

export function NotificationPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
}: NotificationPanelProps) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bell size={18} color="#111827" />
          <Text style={styles.headerTitle}>Notifications</Text>
          {unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unread}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          {unread > 0 && (
            <TouchableOpacity onPress={onMarkAllAsRead} style={styles.markAllButton}>
              <CheckCheck size={14} color="#d4183d" />
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={32} color="#d1d5db" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        ) : (
          notifications.map(notification => {
            const TypeIcon = getTypeIcon(notification.type);
            const typeColor = getTypeColor(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[styles.notificationItem, !notification.read && styles.unreadItem]}
                onPress={() => onMarkAsRead(notification.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.typeIcon, { backgroundColor: `${typeColor}15` }]}>
                  <TypeIcon size={16} color={typeColor} />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>
                      {notification.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onDismiss(notification.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Trash2 size={12} color="#d1d5db" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {formatTimeAgo(notification.timestamp)}
                  </Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 380,
    maxHeight: 500,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 20px 60px rgba(0,0,0,0.15)' as any }
      : { elevation: 20 }),
    zIndex: 100,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  unreadBadge: {
    backgroundColor: '#d4183d',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  markAllText: {
    fontSize: 12,
    color: '#d4183d',
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    maxHeight: 440,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
    gap: 12,
    alignItems: 'flex-start',
  },
  unreadItem: {
    backgroundColor: '#fef2f2',
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  notificationMessage: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d4183d',
    marginTop: 6,
  },
});
