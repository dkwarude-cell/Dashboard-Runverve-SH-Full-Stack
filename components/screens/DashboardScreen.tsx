import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Users, Activity, TrendingUp, Clock, ChevronDown } from 'lucide-react-native';
import { SmartHealLogo } from '@/components/ui/SmartHealLogo';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BarChart } from '@/components/charts/BarChart';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/lib/auth';
import { useResponsive } from '@/hooks/useResponsive';

const DEMO_SCHEDULE = [
  { name: 'Priya Sharma', type: 'ITT Therapy', time: '10:00 AM', color: '#d4183d' },
  { name: 'Arjun Patel', type: 'Recovery Session', time: '11:30 AM', color: '#d4183d' },
  { name: 'Ananya Iyer', type: 'Assessment', time: '02:00 PM', color: '#d4183d' },
  { name: 'Vikram Reddy', type: 'ITT Therapy', time: '03:30 PM', color: '#d4183d' },
];

const DEMO_CHART_DATA = [
  { label: 'Mon', values: [{ value: 24, color: '#d4183d' }, { value: 20, color: '#10b981' }] },
  { label: 'Tue', values: [{ value: 28, color: '#d4183d' }, { value: 22, color: '#10b981' }] },
  { label: 'Wed', values: [{ value: 32, color: '#d4183d' }, { value: 30, color: '#10b981' }] },
  { label: 'Thu', values: [{ value: 26, color: '#d4183d' }, { value: 24, color: '#10b981' }] },
  { label: 'Fri', values: [{ value: 30, color: '#d4183d' }, { value: 28, color: '#10b981' }] },
  { label: 'Sat', values: [{ value: 18, color: '#d4183d' }, { value: 14, color: '#10b981' }] },
  { label: 'Sun', values: [{ value: 15, color: '#d4183d' }, { value: 12, color: '#10b981' }] },
];

export default function DashboardScreen() {
  const { stats, monthlyData, recentClients, todaysSchedule, loading, refresh } =
    useDashboard();
  const { profile, user } = useAuth();
  const { isMobile, isDesktop } = useResponsive();
  const [refreshing, setRefreshing] = React.useState(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Dr. Verma';

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d4183d" />
      </View>
    );
  }

  const chartData =
    monthlyData.length > 0
      ? monthlyData.map((d) => ({
          label: d.month,
          values: [
            { value: d.scheduled, color: '#d4183d' },
            { value: d.completed, color: '#10b981' },
          ],
        }))
      : DEMO_CHART_DATA;

  const schedule = todaysSchedule.length > 0 ? todaysSchedule : DEMO_SCHEDULE;
  const displayStats = {
    total_clients: stats.total_clients || 127,
    active_sessions: stats.active_sessions || 43,
    completion_rate: stats.completion_rate || 78,
    total_devices: stats.total_devices || 89,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeLeft}>
          <SmartHealLogo size={52} />
          <View style={styles.welcomeTextArea}>
            <Text style={styles.welcomeTitle}>Welcome back, {displayName}</Text>
            <Text style={styles.welcomeSubtitle}>
              You have {schedule.length} sessions scheduled today
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewScheduleBtn}>
          <Text style={styles.viewScheduleBtnText}>View Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={StyleSheet.flatten([styles.statsGrid, isMobile ? styles.statsGridMobile : undefined])}>
        <StatCard
          title="Total Clients"
          value={displayStats.total_clients}
          trend="+12%"
          icon={<Users size={22} color="#d4183d" />}
          iconBgColor="#fef2f2"
        />
        <StatCard
          title="Active Sessions"
          value={displayStats.active_sessions}
          trend="+8%"
          icon={<Activity size={22} color="#10b981" />}
          iconBgColor="#dcfce7"
        />
        <StatCard
          title="Avg. Progress"
          value={`${displayStats.completion_rate}%`}
          trend="+5%"
          icon={<TrendingUp size={22} color="#f59e0b" />}
          iconBgColor="#fef3c7"
        />
        <StatCard
          title="This Week"
          value={`${displayStats.total_devices}h`}
          trend="+15%"
          icon={<Clock size={22} color="#d4183d" />}
          iconBgColor="#fef2f2"
        />
      </View>

      {/* Charts & Schedule Row */}
      <View style={StyleSheet.flatten([styles.row, isMobile ? styles.rowMobile : undefined])}>
        {/* Client Activity Chart */}
        <Card style={StyleSheet.flatten([styles.chartCard, isMobile ? styles.chartCardMobile : undefined])}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Client Activity</Text>
              <Text style={styles.chartSubtitle}>Session completion trends</Text>
            </View>
            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>Last 7 days</Text>
              <ChevronDown size={14} color="#64748b" />
            </TouchableOpacity>
          </View>
          <BarChart
            data={chartData}
            height={240}
            legend={[
              { label: 'Total Sessions', color: '#d4183d' },
              { label: 'Completed', color: '#10b981' },
            ]}
          />
        </Card>

        {/* Today's Schedule */}
        <Card style={StyleSheet.flatten([styles.scheduleCard, isMobile ? styles.scheduleCardMobile : undefined])}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Today's Schedule</Text>
            <Text style={styles.scheduleCount}>{schedule.length} sessions</Text>
          </View>
          {schedule.map((session: any, idx: number) => (
            <View key={idx} style={styles.scheduleItem}>
              <Avatar
                name={session.name || session.therapy_type || 'S'}
                size={36}
                color="#d4183d"
              />
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleName}>{session.name || 'Client'}</Text>
                <Text style={styles.scheduleType}>
                  {session.type || session.therapy_type}
                </Text>
                <View style={styles.scheduleTimeRow}>
                  <Clock size={12} color="#94a3b8" />
                  <Text style={styles.scheduleTimeText}>
                    {session.time}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* Recent Clients Table */}
      <Card style={styles.tableCard}>
        <CardHeader title="Recent Clients" subtitle="Latest client activity" />
        {recentClients.length === 0 ? (
          <Text style={styles.emptyText}>No clients yet</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: 200 }]}>Client</Text>
                <Text style={[styles.tableHeaderCell, { width: 120 }]}>Profile</Text>
                <Text style={[styles.tableHeaderCell, { width: 150 }]}>Progress</Text>
                <Text style={[styles.tableHeaderCell, { width: 120 }]}>Last Active</Text>
                <Text style={[styles.tableHeaderCell, { width: 100 }]}>Status</Text>
              </View>
              {/* Rows */}
              {recentClients.map((client, idx) => (
                <View key={client.id || idx} style={styles.tableRow}>
                  <View style={{ width: 200, flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 10 }}>
                    <Avatar name={client.name} size={32} color={client.avatar_color} />
                    <View>
                      <Text style={styles.clientName}>{client.name}</Text>
                      <Text style={styles.clientEmail}>{client.email}</Text>
                    </View>
                  </View>
                  <Text style={[styles.tableCellText, { width: 120 }]}>{client.profile_type}</Text>
                  <View style={{ width: 150, paddingVertical: 10 }}>
                    <ProgressBar progress={client.progress} height={6} />
                    <Text style={styles.progressText}>{client.progress}%</Text>
                  </View>
                  <Text style={[styles.tableCellText, { width: 120 }]}>{client.last_active}</Text>
                  <View style={{ width: 100, paddingVertical: 10 }}>
                    <Badge
                      text={client.status}
                      variant={client.status === 'Active' ? 'success' : 'warning'}
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </Card>
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
    gap: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Welcome Banner - red gradient style
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d4183d',
    borderRadius: 16,
    padding: 24,
    paddingVertical: 28,
  },
  welcomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },

  welcomeTextArea: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  viewScheduleBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  viewScheduleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4183d',
  },
  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsGridMobile: {
    flexWrap: 'wrap',
  },
  // Row
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  rowMobile: {
    flexDirection: 'column',
  },
  // Chart
  chartCard: {
    flex: 2,
    padding: 20,
  },
  chartCardMobile: {
    flex: undefined,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#030213',
    marginBottom: 2,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownText: {
    fontSize: 13,
    color: '#64748b',
  },
  // Schedule
  scheduleCard: {
    flex: 1,
    padding: 20,
  },
  scheduleCardMobile: {
    flex: undefined,
  },
  scheduleHeader: {
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#030213',
  },
  scheduleCount: {
    fontSize: 13,
    color: '#d4183d',
    marginTop: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
  },
  scheduleType: {
    fontSize: 12,
    color: '#d4183d',
    marginTop: 1,
  },
  scheduleTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  scheduleTimeText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 20,
  },
  // Table
  tableCard: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  tableCellText: {
    fontSize: 14,
    color: '#374151',
    paddingVertical: 10,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
  },
  clientEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
