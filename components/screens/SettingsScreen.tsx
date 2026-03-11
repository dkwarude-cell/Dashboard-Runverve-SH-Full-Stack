import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  HelpCircle,
  ChevronRight,
  Moon,
  Volume2,
  Mail,
  Smartphone,
} from 'lucide-react-native';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useResponsive } from '@/hooks/useResponsive';

interface SettingItemProps {
  icon: any;
  iconColor: string;
  label: string;
  description?: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}

function SettingItem({
  icon: Icon,
  iconColor,
  label,
  description,
  value,
  hasToggle,
  toggleValue,
  onToggle,
  onPress,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={hasToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
        <Icon size={18} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDesc}>{description}</Text>}
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#d1d5db', true: '#d4183d' }}
          thumbColor="#fff"
        />
      ) : value ? (
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>{value}</Text>
          <ChevronRight size={16} color="#9ca3af" />
        </View>
      ) : (
        <ChevronRight size={16} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { profile, user, signOut } = useAuth();
  const { isMobile, isDesktop } = useResponsive();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [deviceAlerts, setDeviceAlerts] = useState(true);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || user?.email || 'user@smartheal.io';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Settings</Text>
      <Text style={styles.pageSubtitle}>Manage your account preferences and app configuration</Text>

      <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
        {/* Profile Section */}
        <Card>
          <CardHeader title="Profile" />
          <View style={styles.profileSection}>
            <Avatar name={displayName} size={64} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{displayEmail}</Text>
              <Badge
                text={profile?.role || 'admin'}
                variant="accent"
                size="sm"
              />
            </View>
          </View>
          <View style={styles.profileActions}>
            <Button title="Edit Profile" variant="outline" size="sm" onPress={() => {}} />
            <Button title="Change Password" variant="outline" size="sm" onPress={() => {}} />
          </View>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader title="Notifications" />
          <SettingItem
            icon={Mail}
            iconColor="#3b82f6"
            label="Email Notifications"
            description="Receive updates via email"
            hasToggle
            toggleValue={emailNotifications}
            onToggle={setEmailNotifications}
          />
          <SettingItem
            icon={Smartphone}
            iconColor="#10b981"
            label="Push Notifications"
            description="Mobile push alerts"
            hasToggle
            toggleValue={pushNotifications}
            onToggle={setPushNotifications}
          />
          <SettingItem
            icon={Volume2}
            iconColor="#8b5cf6"
            label="Sound Effects"
            description="Play sounds for notifications"
            hasToggle
            toggleValue={soundEnabled}
            onToggle={setSoundEnabled}
          />
          <SettingItem
            icon={Bell}
            iconColor="#f59e0b"
            label="Session Reminders"
            description="Remind before sessions start"
            hasToggle
            toggleValue={sessionReminders}
            onToggle={setSessionReminders}
          />
          <SettingItem
            icon={Bell}
            iconColor="#ef4444"
            label="Device Alerts"
            description="Low battery and connectivity alerts"
            hasToggle
            toggleValue={deviceAlerts}
            onToggle={setDeviceAlerts}
          />
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader title="Appearance" />
          <SettingItem
            icon={Moon}
            iconColor="#6366f1"
            label="Dark Mode"
            description="Toggle dark theme"
            hasToggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
          />
          <SettingItem
            icon={Palette}
            iconColor="#d4183d"
            label="Accent Color"
            value="Red"
          />
          <SettingItem
            icon={Globe}
            iconColor="#06b6d4"
            label="Language"
            value="English"
          />
        </Card>

        {/* Data & Privacy Section */}
        <Card>
          <CardHeader title="Data & Privacy" />
          <SettingItem
            icon={Download}
            iconColor="#10b981"
            label="Export Data"
            description="Download your data as CSV"
          />
          <SettingItem
            icon={Shield}
            iconColor="#3b82f6"
            label="Privacy Policy"
          />
          <SettingItem
            icon={HelpCircle}
            iconColor="#8b5cf6"
            label="Help & Support"
          />
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader title="Account" />
          <View style={styles.accountActions}>
            <Button
              title="Sign Out"
              variant="outline"
              onPress={signOut}
              fullWidth
            />
            <Button
              title="Delete Account"
              variant="destructive"
              onPress={() => {}}
              fullWidth
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    paddingTop: 0,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingTop: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  settingDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingValue: {
    fontSize: 13,
    color: '#6b7280',
  },
  accountActions: {
    padding: 16,
    gap: 12,
  },
});
