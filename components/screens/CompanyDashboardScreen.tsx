import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Users,
  UserCheck,
  PhoneCall,
  HelpCircle,
  Download,
  TrendingUp,
  Star,
  Clock,
  ChevronDown,
  Activity,
  Video,
  MessageCircle,
} from 'lucide-react-native';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { SmartHealLogo } from '@/components/ui/SmartHealLogo';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { useDashboard } from '@/hooks/useDashboard';
import { useResponsive } from '@/hooks/useResponsive';

// Demo data
const DEMO_USAGE_TRENDS = [
  { label: 'Mon', values: [{ value: 120, color: '#3b82f6', label: 'Sessions' }, { value: 80, color: '#10b981', label: 'Queries' }] },
  { label: 'Tue', values: [{ value: 150, color: '#3b82f6', label: 'Sessions' }, { value: 90, color: '#10b981', label: 'Queries' }] },
  { label: 'Wed', values: [{ value: 180, color: '#3b82f6', label: 'Sessions' }, { value: 70, color: '#10b981', label: 'Queries' }] },
  { label: 'Thu', values: [{ value: 160, color: '#3b82f6', label: 'Sessions' }, { value: 100, color: '#10b981', label: 'Queries' }] },
  { label: 'Fri', values: [{ value: 200, color: '#3b82f6', label: 'Sessions' }, { value: 85, color: '#10b981', label: 'Queries' }] },
  { label: 'Sat', values: [{ value: 130, color: '#3b82f6', label: 'Sessions' }, { value: 60, color: '#10b981', label: 'Queries' }] },
  { label: 'Sun', values: [{ value: 100, color: '#3b82f6', label: 'Sessions' }, { value: 50, color: '#10b981', label: 'Queries' }] },
];

const DEMO_COMM_METHODS = [
  { label: 'Video Calls', value: 45, color: '#3b82f6' },
  { label: 'Voice Calls', value: 30, color: '#10b981' },
  { label: 'Chat', value: 25, color: '#f59e0b' },
];

const DEMO_QUERY_CATS = [
  { label: 'Technical', values: [{ value: 35, color: '#3b82f6' }] },
  { label: 'Billing', values: [{ value: 20, color: '#f59e0b' }] },
  { label: 'Therapy', values: [{ value: 28, color: '#10b981' }] },
  { label: 'Device', values: [{ value: 17, color: '#8b5cf6' }] },
];

const DEMO_ACTIVITY = [
  { name: 'Dr. Sarah Johnson', action: 'Completed session with client Mike Chen', time: '2 min ago', type: 'session' },
  { name: 'Dr. James Wilson', action: 'Started video call with Emma Davis', time: '5 min ago', type: 'video' },
  { name: 'Dr. Lisa Anderson', action: 'Resolved query #Q004', time: '12 min ago', type: 'query' },
  { name: 'Dr. Robert Taylor', action: 'Updated treatment protocol for Mark Lee', time: '18 min ago', type: 'session' },
  { name: 'Dr. Emily Brown', action: 'Sent message to Sarah Williams', time: '25 min ago', type: 'message' },
];

const DEMO_DOCTORS = [
  { name: 'Dr. Sarah Johnson', clients: 28, sessions: 142, queries: 15, calls: 32, response: '2.3h', satisfaction: 4.9 },
  { name: 'Dr. James Wilson', clients: 24, sessions: 118, queries: 12, calls: 28, response: '2.8h', satisfaction: 4.7 },
  { name: 'Dr. Lisa Anderson', clients: 22, sessions: 105, queries: 18, calls: 25, response: '1.9h', satisfaction: 4.8 },
  { name: 'Dr. Robert Taylor', clients: 19, sessions: 98, queries: 10, calls: 20, response: '3.1h', satisfaction: 4.6 },
  { name: 'Dr. Emily Brown', clients: 17, sessions: 89, queries: 8, calls: 18, response: '2.5h', satisfaction: 4.8 },
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'video': return <Video size={14} color="#3b82f6" />;
    case 'query': return <HelpCircle size={14} color="#f59e0b" />;
    case 'message': return <MessageCircle size={14} color="#10b981" />;
    default: return <Activity size={14} color="#d4183d" />;
  }
}

function getActivityBadge(type: string) {
  switch (type) {
    case 'video': return { label: 'Video', variant: 'info' as const };
    case 'query': return { label: 'Query', variant: 'warning' as const };
    case 'message': return { label: 'Message', variant: 'success' as const };
    default: return { label: 'Session', variant: 'destructive' as const };
  }
}

export default function CompanyDashboardScreen() {
  const { stats, monthlyData, loading, refresh } = useDashboard();
  const { isMobile } = useResponsive();
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Red Banner Header */}
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <View style={styles.bannerTitleRow}>
            <SmartHealLogo size={32} />
            <View>
              <Text style={styles.bannerTitle}>Company Dashboard</Text>
              <Text style={styles.bannerSubtitle}>
                Centralized monitoring and analytics for SmartHeal platform
              </Text>
            </View>
          </View>
          <View style={styles.bannerBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.bannerBadgeText}>Active Status: Operational</Text>
          </View>
        </View>
        <View style={styles.bannerActions}>
          <TouchableOpacity style={styles.dropdownBtn}>
            <Text style={styles.dropdownText}>This Week</Text>
            <ChevronDown size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn}>
            <Download size={14} color="#d4183d" />
            <Text style={styles.exportBtnText}>Export Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stat Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftColor: '#d4183d' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#fef2f3' }]}>
            <Users size={20} color="#d4183d" />
          </View>
          <Text style={styles.statCardValue}>{stats.total_clients || 342}</Text>
          <Text style={styles.statCardLabel}>Total Clients</Text>
          <Text style={[styles.statTrend, { color: '#10b981' }]}>↗ +12% this week</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#dcfce7' }]}>
            <UserCheck size={20} color="#10b981" />
          </View>
          <Text style={styles.statCardValue}>48</Text>
          <Text style={styles.statCardLabel}>Active Now</Text>
          <Text style={[styles.statTrend, { color: '#10b981' }]}>↗ +5% this week</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#dbeafe' }]}>
            <PhoneCall size={20} color="#3b82f6" />
          </View>
          <Text style={styles.statCardValue}>5</Text>
          <Text style={styles.statCardLabel}>Active Calls</Text>
          <Text style={[styles.statTrend, { color: '#3b82f6' }]}>2 video, 3 voice</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
          <View style={[styles.statIconCircle, { backgroundColor: '#fef3c7' }]}>
            <HelpCircle size={20} color="#f59e0b" />
          </View>
          <Text style={styles.statCardValue}>23</Text>
          <Text style={styles.statCardLabel}>Open Queries</Text>
          <Text style={[styles.statTrend, { color: '#ef4444' }]}>↗ +3 today</Text>
        </View>
      </View>

      {/* Charts Row */}
      <View style={[styles.chartsRow, isMobile && styles.chartsRowMobile]}>
        <Card style={{...styles.chartCard, ...(isMobile ? { flex: undefined } : {})}} padding={16}>
          <CardHeader title="Platform Usage Trends" />
          <LineChart
            data={DEMO_USAGE_TRENDS}
            height={200}
            legend={[
              { label: 'Sessions', color: '#3b82f6' },
              { label: 'Queries', color: '#10b981' },
            ]}
          />
        </Card>
        <Card style={{...styles.chartCardSmall, ...(isMobile ? { flex: undefined } : {})}} padding={16}>
          <CardHeader title="Communication Methods" />
          <PieChart data={DEMO_COMM_METHODS} size={160} innerRadius={0.55} />
        </Card>
        <Card style={{...styles.chartCardSmall, ...(isMobile ? { flex: undefined } : {})}} padding={16}>
          <CardHeader title="Query Categories" />
          <BarChart data={DEMO_QUERY_CATS} height={160} />
        </Card>
      </View>

      {/* Real-Time Activity + Doctor Performance */}
      <View style={[styles.twoCol, isMobile && styles.twoColMobile]}>
        {/* Activity Feed */}
        <Card style={{...styles.flex1, ...(isMobile ? { flex: undefined } : {})}} padding={16}>
          <CardHeader title="Real-Time Activity" />
          <View style={styles.activityList}>
            {DEMO_ACTIVITY.map((act, i) => {
              const badge = getActivityBadge(act.type);
              return (
                <View key={i} style={styles.activityItem}>
                  <Avatar name={act.name} size={36} color="#d4183d" />
                  <View style={styles.activityInfo}>
                    <View style={styles.activityTopRow}>
                      <Text style={styles.activityName}>{act.name}</Text>
                      <Badge text={badge.label} variant={badge.variant} />
                    </View>
                    <Text style={styles.activityAction}>{act.action}</Text>
                    <Text style={styles.activityTime}>{act.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Doctor Performance Metrics */}
        <Card style={{...styles.flex1, ...(isMobile ? { flex: undefined } : {})}} padding={16}>
          <CardHeader title="Doctor Performance Metrics" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: 160 }]}>Doctor</Text>
                <Text style={[styles.tableHeaderCell, { width: 70 }]}>Clients</Text>
                <Text style={[styles.tableHeaderCell, { width: 80 }]}>Sessions</Text>
                <Text style={[styles.tableHeaderCell, { width: 70 }]}>Queries</Text>
                <Text style={[styles.tableHeaderCell, { width: 90 }]}>Video Calls</Text>
                <Text style={[styles.tableHeaderCell, { width: 90 }]}>Avg Response</Text>
                <Text style={[styles.tableHeaderCell, { width: 90 }]}>Satisfaction</Text>
              </View>
              {DEMO_DOCTORS.map((doc, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 0 && { backgroundColor: '#f8fafc' }]}>
                  <View style={[styles.tableCellRow, { width: 160 }]}>
                    <Avatar name={doc.name} size={28} color="#d4183d" />
                    <Text style={styles.tableCellName}>{doc.name}</Text>
                  </View>
                  <Text style={[styles.tableCell, { width: 70 }]}>{doc.clients}</Text>
                  <Text style={[styles.tableCell, { width: 80 }]}>{doc.sessions}</Text>
                  <Text style={[styles.tableCell, { width: 70 }]}>{doc.queries}</Text>
                  <Text style={[styles.tableCell, { width: 90 }]}>{doc.calls}</Text>
                  <Text style={[styles.tableCell, { width: 90 }]}>{doc.response}</Text>
                  <View style={[styles.tableCellRow, { width: 90 }]}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.tableCell}>{doc.satisfaction}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>
      </View>

      {/* Insight Cards */}
      <View style={[styles.insightRow, isMobile && styles.insightRowMobile]}>
        <Card style={{...styles.insightCard, borderTopColor: '#d4183d'}} padding={16}>
          <View style={[styles.insightIconCircle, { backgroundColor: '#fef2f3' }]}>
            <TrendingUp size={20} color="#d4183d" />
          </View>
          <Text style={styles.insightTitle}>Platform Growth</Text>
          <Text style={styles.insightDesc}>
            Client base grew 12% this month with 38 new registrations
          </Text>
        </Card>
        <Card style={{...styles.insightCard, borderTopColor: '#10b981'}} padding={16}>
          <View style={[styles.insightIconCircle, { backgroundColor: '#dcfce7' }]}>
            <Clock size={20} color="#10b981" />
          </View>
          <Text style={styles.insightTitle}>Query Resolution</Text>
          <Text style={styles.insightDesc}>
            Average resolution time improved by 18% to 2.4 hours
          </Text>
        </Card>
        <Card style={{...styles.insightCard, borderTopColor: '#3b82f6'}} padding={16}>
          <View style={[styles.insightIconCircle, { backgroundColor: '#dbeafe' }]}>
            <Star size={20} color="#3b82f6" />
          </View>
          <Text style={styles.insightTitle}>Client Satisfaction</Text>
          <Text style={styles.insightDesc}>
            Overall satisfaction rating at 4.8/5.0, up from 4.6 last month
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, gap: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Banner
  banner: {
    backgroundColor: '#d4183d', borderRadius: 16, padding: 20,
  },
  bannerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 16,
  },
  bannerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bannerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  bannerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  bannerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  greenDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80',
  },
  bannerBadgeText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  bannerActions: { flexDirection: 'row', gap: 10 },
  dropdownBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  dropdownText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  exportBtnText: { fontSize: 13, color: '#d4183d', fontWeight: '600' },

  // Stats
  statsGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  statCard: {
    flex: 1, minWidth: 180, backgroundColor: '#fff', borderRadius: 12,
    padding: 16, borderLeftWidth: 4, gap: 4,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  statCardValue: { fontSize: 28, fontWeight: '700', color: '#030213' },
  statCardLabel: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  statTrend: { fontSize: 12, fontWeight: '500', marginTop: 2 },

  // Charts
  chartsRow: { flexDirection: 'row', gap: 16 },
  chartsRowMobile: { flexDirection: 'column' },
  chartCard: { flex: 2 },
  chartCardSmall: { flex: 1 },

  // Two columns
  twoCol: { flexDirection: 'row', gap: 16 },
  twoColMobile: { flexDirection: 'column' },
  flex1: { flex: 1 },

  // Activity
  activityList: { gap: 12 },
  activityItem: { flexDirection: 'row', gap: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  activityInfo: { flex: 1 },
  activityTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  activityName: { fontSize: 14, fontWeight: '600', color: '#030213' },
  activityAction: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 2 },
  activityTime: { fontSize: 11, color: '#94a3b8' },

  // Table
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 10, paddingHorizontal: 8,
    borderRadius: 8,
  },
  tableHeaderCell: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center' },
  tableCellRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tableCellName: { fontSize: 13, fontWeight: '600', color: '#030213' },
  tableCell: { fontSize: 13, color: '#64748b' },

  // Insight cards
  insightRow: { flexDirection: 'row', gap: 16 },
  insightRowMobile: { flexDirection: 'column' },
  insightCard: {
    flex: 1, borderTopWidth: 4, borderRadius: 12,
  },
  insightIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  insightTitle: { fontSize: 16, fontWeight: '700', color: '#030213', marginBottom: 6 },
  insightDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },
});
