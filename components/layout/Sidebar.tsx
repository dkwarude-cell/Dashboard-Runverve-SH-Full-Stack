import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import {
  LayoutDashboard,
  Users,
  Clock,
  BarChart3,
  Cpu,
  MessageSquare,
  HelpCircle,
  Building2,
  Sparkles,
  Settings,
} from 'lucide-react-native';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { useClients } from '@/hooks/useClients';
import type { AppSection } from '@/types';

interface SidebarProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  onClose?: () => void;
}

interface NavItemConfig {
  key: AppSection;
  label: string;
  icon: any;
  badge?: string;
}

const mainNav: NavItemConfig[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'sessions', label: 'Sessions', icon: Clock },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'device', label: 'Device Controls', icon: Cpu },
];

const commNav: NavItemConfig[] = [
  { key: 'communications', label: 'Communications', icon: MessageSquare, badge: 'NEW' },
  { key: 'queries', label: 'Query Management', icon: HelpCircle, badge: 'NEW' },
];

const aiNav: NavItemConfig[] = [
  { key: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
];

const adminNav: NavItemConfig[] = [
  { key: 'company', label: 'Company Dashboard', icon: Building2, badge: 'NEW' },
  { key: 'settings', label: 'Settings', icon: Settings },
];

function SidebarItem({
  item,
  active,
  onPress,
}: {
  item: NavItemConfig;
  active: boolean;
  onPress: () => void;
}) {
  const Icon = item.icon;
  return (
    <TouchableOpacity
      style={[styles.navItem, active && styles.navItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon size={20} color={active ? '#ffffff' : '#64748b'} />
      <Text style={[styles.navText, active && styles.navTextActive]} numberOfLines={1}>
        {item.label}
      </Text>
      {item.badge && (
        <Badge text={item.badge} variant="accent" size="sm" />
      )}
    </TouchableOpacity>
  );
}

export function Sidebar({ activeSection, onSectionChange, onClose }: SidebarProps) {
  const { signOut } = useAuth();
  const { clients } = useClients();
  const activeClientCount = clients.filter(c => c.status === 'Active').length;

  const handleNavPress = (section: AppSection) => {
    onSectionChange(section);
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Main Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAIN</Text>
          {mainNav.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              active={activeSection === item.key}
              onPress={() => handleNavPress(item.key)}
            />
          ))}
        </View>

        {/* Communication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMMUNICATION</Text>
          {commNav.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              active={activeSection === item.key}
              onPress={() => handleNavPress(item.key)}
            />
          ))}
        </View>

        {/* AI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI & INSIGHTS</Text>
          {aiNav.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              active={activeSection === item.key}
              onPress={() => handleNavPress(item.key)}
            />
          ))}
        </View>

        {/* Administration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADMINISTRATION</Text>
          {adminNav.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              active={activeSection === item.key}
              onPress={() => handleNavPress(item.key)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.activeClients}>
          <Text style={styles.activeClientsLabel}>Active Clients</Text>
          <Text style={styles.activeClientsValue}>{activeClientCount || clients.length || '—'}</Text>
          <Text style={styles.activeClientsChange}>{clients.length > 0 ? `${clients.length} total registered` : 'Loading...'}</Text>
        </View>
        <Button
          title="Sign Out"
          variant="outline"
          size="sm"
          onPress={signOut}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    width: 256,
    ...(Platform.OS === 'web'
      ? { position: 'sticky' as any, top: 57, height: 'calc(100vh - 57px)' as any }
      : {}),
  },
  scrollArea: {
    flex: 1,
    paddingTop: 8,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 2,
    gap: 12,
  },
  navItemActive: {
    backgroundColor: '#d4183d',
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  navTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  activeClients: {
    backgroundColor: '#d4183d',
    borderRadius: 10,
    padding: 14,
  },
  activeClientsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  activeClientsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 2,
  },
  activeClientsChange: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
