import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { SmartHealLogo } from '@/components/ui/SmartHealLogo';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { useAuth } from '@/lib/auth';
import { useResponsive } from '@/hooks/useResponsive';
import { useNotifications } from '@/hooks/useNotifications';

interface HeaderProps {
  onMenuPress?: () => void;
}

export function Header({ onMenuPress }: HeaderProps) {
  const { profile, user } = useAuth();
  const { isMobile } = useResponsive();
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Dr. Smith';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {isMobile && (
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Menu size={24} color="#030213" />
          </TouchableOpacity>
        )}
        <View style={styles.logo}>
          <SmartHealLogo size={32} />
          <View>
            <Text style={styles.brandName}>SmartHeal</Text>
            <Text style={styles.brandSub}>Medical Dashboard</Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.notificationWrapper}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} color="#64748b" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDismiss={dismissNotification}
            />
          )}
        </View>

        <View style={styles.userSection}>
          <Avatar name={displayName} size={34} color="#d4183d" />
          {!isMobile && (
            <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    ...(Platform.OS === 'web' ? { position: 'sticky' as any, top: 0, zIndex: 50 } : {}),
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 4,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#030213',
    lineHeight: 20,
  },
  brandSub: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#d4183d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
  },
});
