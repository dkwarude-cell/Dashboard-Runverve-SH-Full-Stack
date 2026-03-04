import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { SmartHealLogo } from '@/components/ui/SmartHealLogo';
import { useAuth } from '@/lib/auth';
import { useResponsive } from '@/hooks/useResponsive';

interface HeaderProps {
  onMenuPress?: () => void;
}

export function Header({ onMenuPress }: HeaderProps) {
  const { profile, user } = useAuth();
  const { isMobile } = useResponsive();
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
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color="#64748b" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

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
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d4183d',
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
