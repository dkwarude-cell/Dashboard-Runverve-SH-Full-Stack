import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Redirect, Slot, useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useResponsive } from '@/hooks/useResponsive';
import type { AppSection } from '@/types';

const SECTION_TO_ROUTE: Record<AppSection, string> = {
  dashboard: '/(app)',
  clients: '/(app)/clients',
  sessions: '/(app)/sessions',
  analytics: '/(app)/analytics',
  device: '/(app)/device',
  communications: '/(app)/communications',
  queries: '/(app)/queries',
  company: '/(app)/company',
  'ai-assistant': '/(app)/ai-assistant',
  settings: '/(app)/settings',
};

const ROUTE_TO_SECTION: Record<string, AppSection> = {
  '': 'dashboard',
  'index': 'dashboard',
  'clients': 'clients',
  'sessions': 'sessions',
  'analytics': 'analytics',
  'device': 'device',
  'communications': 'communications',
  'queries': 'queries',
  'company': 'company',
  'ai-assistant': 'ai-assistant',
  'settings': 'settings',
};

export default function AppLayout() {
  const { user, loading } = useAuth();
  const { isDesktop } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSection = useMemo<AppSection>(() => {
    const segment = pathname.replace(/^\/(app\/?)?/, '').split('/')[0] || '';
    return ROUTE_TO_SECTION[segment] || 'dashboard';
  }, [pathname]);

  const handleSectionChange = useCallback(
    (section: AppSection) => {
      router.push(SECTION_TO_ROUTE[section] as any);
      setSidebarOpen(false);
    },
    [router]
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#d4183d" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />

      <View style={styles.body}>
        {/* Desktop Sidebar - always visible */}
        {isDesktop && (
          <View style={styles.sidebarDesktop}>
            <Sidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </View>
        )}

        {/* Mobile Sidebar - overlay */}
        {!isDesktop && sidebarOpen && (
          <>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setSidebarOpen(false)}
            />
            <View style={styles.sidebarMobile}>
              <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                onClose={() => setSidebarOpen(false)}
              />
            </View>
          </>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarDesktop: {
    width: 260,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    ...(Platform.OS === 'web'
      ? { position: 'sticky' as any, top: 0, height: '100vh' as any }
      : {}),
  },
  sidebarMobile: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    zIndex: 50,
    backgroundColor: '#ffffff',
    ...(Platform.OS === 'web'
      ? { boxShadow: '4px 0 24px rgba(0,0,0,0.15)' as any }
      : { elevation: 10 }),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 40,
  },
  mainContent: {
    flex: 1,
  },
});
