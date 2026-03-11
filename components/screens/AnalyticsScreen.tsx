import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Users, Activity, CheckCircle, Heart, Download, TrendingUp } from 'lucide-react-native';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useDashboard } from '@/hooks/useDashboard';
import { useResponsive } from '@/hooks/useResponsive';

// Demo data for charts when real data isn't available
const DEMO_GROWTH = [
  { label: 'Jul', values: [{ value: 300, color: '#3b82f6', label: 'Clients' }, { value: 50, color: '#ef4444', label: 'Sessions' }] },
  { label: 'Aug', values: [{ value: 350, color: '#3b82f6', label: 'Clients' }, { value: 80, color: '#ef4444', label: 'Sessions' }] },
  { label: 'Sep', values: [{ value: 380, color: '#3b82f6', label: 'Clients' }, { value: 100, color: '#ef4444', label: 'Sessions' }] },
  { label: 'Oct', values: [{ value: 400, color: '#3b82f6', label: 'Clients' }, { value: 90, color: '#ef4444', label: 'Sessions' }] },
  { label: 'Nov', values: [{ value: 450, color: '#3b82f6', label: 'Clients' }, { value: 120, color: '#ef4444', label: 'Sessions' }] },
  { label: 'Dec', values: [{ value: 500, color: '#3b82f6', label: 'Clients' }, { value: 130, color: '#ef4444', label: 'Sessions' }] },
];

const DEMO_OUTCOMES = [
  { label: 'Pain Reduction', values: [{ value: 82, color: '#ef4444' }] },
  { label: 'Mobility Increase', values: [{ value: 85, color: '#ef4444' }] },
  { label: 'Strength Gain', values: [{ value: 75, color: '#ef4444' }] },
  { label: 'Flexibility', values: [{ value: 70, color: '#ef4444' }] },
  { label: 'Endurance', values: [{ value: 65, color: '#ef4444' }] },
];

const DEMO_WEEKLY = [
  { label: 'Mon', values: [{ value: 24, color: '#10b981' }] },
  { label: 'Tue', values: [{ value: 28, color: '#10b981' }] },
  { label: 'Wed', values: [{ value: 32, color: '#10b981' }] },
  { label: 'Thu', values: [{ value: 30, color: '#10b981' }] },
  { label: 'Fri', values: [{ value: 26, color: '#10b981' }] },
  { label: 'Sat', values: [{ value: 18, color: '#10b981' }] },
  { label: 'Sun', values: [{ value: 15, color: '#10b981' }] },
];

export default function AnalyticsScreen() {
  const {
    clientDistribution,
    sessionTrends,
    therapyOutcomes,
    growthData,
    loading,
    refresh,
  } = useAnalytics();
  const { stats } = useDashboard();
  const { isMobile } = useResponsive();
  const [refreshing, setRefreshing] = React.useState(false);

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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Analytics & Reports</Text>
          <Text style={styles.pageSubtitle}>
            Comprehensive insights into client progress and outcomes
          </Text>
        </View>
        <TouchableOpacity style={styles.exportBtn}>
          <Download size={16} color="#fff" />
          <Text style={styles.exportBtnText}>Export Report</Text>
        </TouchableOpacity>
      </View>

      {/* Stat Cards */}
      <View style={[styles.statsGrid, isMobile && { flexWrap: 'wrap' }]}>
        <StatCard
          title="Total Clients"
          value={stats.total_clients || 127}
          trend="+12% vs last month"
          icon={<Users size={20} color="#d4183d" />}
          iconBgColor="#fef2f3"
        />
        <StatCard
          title="Sessions/Month"
          value={stats.active_sessions || 523}
          trend="+8% vs last month"
          icon={<Activity size={20} color="#3b82f6" />}
          iconBgColor="#dbeafe"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completion_rate || 93}%`}
          trend="+2% vs last month"
          icon={<CheckCircle size={20} color="#10b981" />}
          iconBgColor="#dcfce7"
        />
        <StatCard
          title="Avg Pain Reduction"
          value={`${stats.total_devices || 78}%`}
          trend="+5% vs last month"
          icon={<Heart size={20} color="#f59e0b" />}
          iconBgColor="#fef3c7"
        />
      </View>

      {/* Charts Row 1 */}
      <View style={[styles.chartsRow, isMobile && styles.chartsRowMobile]}>
        {/* Growth Trends */}
        <Card style={{...styles.chartCard, ...(isMobile ? styles.chartCardMobile : {})}}>
          <CardHeader title="Growth Trends" />
          <LineChart
            data={growthData.length > 0 ? growthData : DEMO_GROWTH}
            height={220}
            legend={[
              { label: 'Clients', color: '#3b82f6' },
              { label: 'Sessions', color: '#ef4444' },
            ]}
          />
        </Card>

        {/* Client Profile Distribution */}
        <Card style={{...styles.chartCard, ...(isMobile ? styles.chartCardMobile : {})}}>
          <CardHeader title="Client Profile Distribution" />
          <PieChart
            data={clientDistribution.length > 0 ? clientDistribution : [
              { label: 'Runner/Athlete', value: 52, color: '#3b82f6' },
              { label: 'Health & Wellness', value: 43, color: '#f59e0b' },
              { label: 'Coach/Trainer', value: 32, color: '#10b981' },
            ]}
            size={180}
            innerRadius={0.6}
          />
        </Card>
      </View>

      {/* Charts Row 2 */}
      <View style={[styles.chartsRow, isMobile && styles.chartsRowMobile]}>
        {/* Average Therapy Outcomes */}
        <Card style={{...styles.chartCard, ...(isMobile ? styles.chartCardMobile : {})}}>
          <CardHeader title="Average Therapy Outcomes" />
          <BarChart
            data={therapyOutcomes.length > 0 ? therapyOutcomes : DEMO_OUTCOMES}
            height={220}
          />
        </Card>

        {/* Weekly Session Distribution */}
        <Card style={{...styles.chartCard, ...(isMobile ? styles.chartCardMobile : {})}}>
          <CardHeader title="Weekly Session Distribution" />
          <BarChart
            data={sessionTrends.length > 0 ? sessionTrends : DEMO_WEEKLY}
            height={220}
          />
        </Card>
      </View>

      {/* Performance Summary */}
      <Card style={styles.perfCard} padding={20}>
        <Text style={styles.perfTitle}>Performance Summary</Text>
        <View style={[styles.perfGrid, isMobile && styles.perfGridMobile]}>
          <View style={[styles.perfItem, { backgroundColor: '#fef2f3' }]}>
            <Text style={styles.perfItemLabel}>Client Satisfaction</Text>
            <Text style={[styles.perfItemValue, { color: '#d4183d' }]}>4.8/5.0</Text>
          </View>
          <View style={[styles.perfItem, { backgroundColor: '#dcfce7' }]}>
            <Text style={styles.perfItemLabel}>Treatment Success</Text>
            <Text style={[styles.perfItemValue, { color: '#10b981' }]}>91%</Text>
          </View>
          <View style={[styles.perfItem, { backgroundColor: '#dbeafe' }]}>
            <Text style={styles.perfItemLabel}>Client Retention</Text>
            <Text style={[styles.perfItemValue, { color: '#3b82f6' }]}>96%</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, gap: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#030213' },
  pageSubtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#d4183d', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  exportBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  statsGrid: { flexDirection: 'row', gap: 12 },
  chartsRow: { flexDirection: 'row', gap: 16 },
  chartsRowMobile: { flexDirection: 'column' },
  chartCard: { flex: 1, padding: 16 },
  chartCardMobile: { flex: undefined },
  perfCard: {},
  perfTitle: { fontSize: 18, fontWeight: '700', color: '#030213', marginBottom: 16 },
  perfGrid: { flexDirection: 'row', gap: 12 },
  perfGridMobile: { flexDirection: 'column' },
  perfItem: {
    flex: 1, borderRadius: 12, padding: 16,
  },
  perfItemLabel: { fontSize: 13, color: '#64748b', fontWeight: '500', marginBottom: 6 },
  perfItemValue: { fontSize: 28, fontWeight: '700' },
});
