/**
 * ANALYTICS IMPLEMENTATION EXAMPLES
 * 
 * Complete code examples showing how to use the analytics data
 * in real SmartHeal Dashboard components
 */

// ============================================
// EXAMPLE 1: Dashboard Stat Cards
// ============================================

export const dashboardStatCardsExample = `
import React from 'react';
import { View, ScrollView } from 'react-native';
import { StatCard } from '@/components/ui/StatCard';
import { useAnalytics } from '@/hooks/useAnalytics';

export function DashboardStats() {
  const { clientStats, sessionStats, loading } = useAnalytics();

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView horizontal>
      <StatCard
        title="Total Clients"
        value={clientStats?.total || 0}
        icon="Users"
        color="#3b82f6"
        trend={clientStats?.active}
        trendLabel="Active"
      />
      
      <StatCard
        title="Avg Progress"
        value={\`\${clientStats?.avgProgress || 0}%\`}
        icon="TrendingUp"
        color="#10b981"
        trend={clientStats?.avgAdherence}
        trendLabel="Adherence"
      />

      <StatCard
        title="Session Rate"
        value={\`\${sessionStats?.completionRate || 0}%\`}
        icon="CheckCircle"
        color="#f59e0b"
        trend={sessionStats?.completed}
        trendLabel="Completed"
      />

      <StatCard
        title="Avg Session Progress"
        value={\`\${sessionStats?.avgProgress || 0}%\`}
        icon="Activity"
        color="#ef4444"
      />
    </ScrollView>
  );
}
`;

// ============================================
// EXAMPLE 2: Therapist Performance Rankings
// ============================================

export const therapistPerformanceExample = `
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAnalytics } from '@/hooks/useAnalytics';

export function TherapistRankings() {
  const { therapistPerformance, loading } = useAnalytics();

  if (loading) return <ActivityIndicator />;

  return (
    <Card>
      <Text style={styles.title}>Top Therapists by Performance</Text>
      
      <FlatList
        data={therapistPerformance}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={styles.rankingItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            
            <View style={styles.info}>
              <Text style={styles.name}>{item.therapistName}</Text>
              <Text style={styles.subtitle}>
                {item.clientsCount} clients • {item.completedSessions} sessions
              </Text>
            </View>

            <View style={styles.stats}>
              <Badge 
                text={\`\${item.avgSessionProgress}% avg\`}
                variant="success"
              />
            </View>
          </View>
        )}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  rank: { fontSize: 18, fontWeight: '700', marginRight: 12 },
  info: { flex: 1 },
  name: { fontWeight: '500' },
  subtitle: { fontSize: 12, color: '#6b7280' },
  stats: { alignItems: 'flex-end' },
});
`;

// ============================================
// EXAMPLE 3: At-Risk Client Alerts
// ============================================

export const atRiskClientsExample = `
import React from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { useAnalytics } from '@/hooks/useAnalytics';

export function AtRiskClientsWidget() {
  const { riskClients } = useAnalytics();

  const riskColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };

  if (riskClients.length === 0) {
    return (
      <Card style={{ backgroundColor: '#d1fae5' }}>
        <Text style={{ color: '#065f46', fontWeight: '500' }}>
          ✅ No at-risk clients detected
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <AlertCircle size={20} color="#dc2626" />
        <Text style={{ marginLeft: 8, fontWeight: '600', fontSize: 16 }}>
          At-Risk Clients ({riskClients.length})
        </Text>
      </View>

      <FlatList
        data={riskClients}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={{
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: riskColors[item.riskLevel],
            backgroundColor: '#f9fafb',
          }}>
            <Text style={{ fontWeight: '600' }}>
              {item.clientName}
            </Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginVertical: 4 }}>
              Last active: {item.lastActive}
            </Text>
            
            <View style={{ marginTop: 8 }}>
              {item.reasons.map((reason, idx) => (
                <Text key={idx} style={{ fontSize: 12, color: '#374151' }}>
                  • {reason}
                </Text>
              ))}
            </View>

            <Text style={{
              fontSize: 11,
              fontWeight: '600',
              marginTop: 8,
              color: riskColors[item.riskLevel],
              textTransform: 'uppercase',
            }}>
              {item.riskLevel} RISK
            </Text>
          </View>
        )}
      />
    </Card>
  );
}
`;

// ============================================
// EXAMPLE 4: Therapy Outcomes Comparison
// ============================================

export const therapyOutcomesExample = `
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BarChart } from '@/components/charts/BarChart';
import { Card } from '@/components/ui/Card';
import { useAnalytics } from '@/hooks/useAnalytics';

export function TherapyOutcomesComparison() {
  const { therapyOutcomes, loading } = useAnalytics();

  if (loading) return <ActivityIndicator />;

  // Transform data for chart
  const chartData = therapyOutcomes
    .filter(t => t.sessionsCount > 0)
    .map(t => ({
      label: t.therapyType,
      values: [
        { 
          value: t.avgProgress,
          color: t.successRate >= 80 ? '#10b981' : t.successRate >= 60 ? '#f59e0b' : '#ef4444',
        },
      ],
    }));

  return (
    <Card>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
        Therapy Outcomes by Type
      </Text>

      <BarChart data={chartData} />

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: '600', marginBottom: 8 }}>Summary</Text>
        
        {therapyOutcomes.map((outcome, idx) => (
          <View key={idx} style={{ paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{outcome.therapyType}</Text>
            <Text style={{ fontWeight: '500' }}>
              {outcome.avgProgress}% • {outcome.successRate}% success
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
`;

// ============================================
// EXAMPLE 5: Client List with Risk Indicators
// ============================================

export const clientListWithRiskExample = `
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useClients } from '@/hooks/useClients';
import { useAnalytics } from '@/hooks/useAnalytics';

export function ClientListWithRisk() {
  const { clients } = useClients();
  const { riskClients } = useAnalytics();

  const getRiskLevel = (clientId) => {
    return riskClients.find(r => r.clientId === clientId)?.riskLevel || 'low';
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle size={16} color="#ef4444" />;
      case 'medium':
        return <AlertTriangle size={16} color="#f59e0b" />;
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={clients}
      keyExtractor={c => c.id}
      renderItem={({ item: client }) => {
        const riskLevel = getRiskLevel(client.id);
        const isAtRisk = riskLevel !== 'low';

        return (
          <View style={[
            styles.clientCard,
            isAtRisk && styles.atRiskCard,
          ]}>
            <View style={styles.clientHeader}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientType}>{client.profile_type}</Text>
              </View>
              
              {isAtRisk && getRiskIcon(riskLevel)}
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Progress</Text>
                <Text style={styles.metricValue}>{client.progress}%</Text>
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Adherence</Text>
                <Text style={styles.metricValue}>{client.adherence}%</Text>
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Sessions</Text>
                <Text style={styles.metricValue}>{client.sessions}</Text>
              </View>

              {client.change > 0 && (
                <TrendingUp size={16} color="#10b981" />
              )}
              {client.change < 0 && (
                <TrendingDown size={16} color="#ef4444" />
              )}
            </View>

            {isAtRisk && (
              <Text style={styles.riskBadge}>
                ⚠️ {riskLevel.toUpperCase()} RISK
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  clientCard: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  atRiskCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: { fontWeight: '600', fontSize: 14 },
  clientType: { fontSize: 12, color: '#6b7280' },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metric: { alignItems: 'center' },
  metricLabel: { fontSize: 11, color: '#9ca3af' },
  metricValue: { fontWeight: '600', fontSize: 13 },
  riskBadge: { fontSize: 11, fontWeight: '600', color: '#dc2626' },
});
`;

// ============================================
// EXAMPLE 6: Monthly Growth Chart
// ============================================

export const monthlyGrowthChartExample = `
import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from '@/components/charts/LineChart';
import { Card } from '@/components/ui/Card';
import { useAnalytics } from '@/hooks/useAnalytics';

export function MonthlyGrowthChart() {
  const { growthData, loading } = useAnalytics();

  if (loading) return <ActivityIndicator />;

  return (
    <Card>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          Platform Growth Trend
        </Text>
        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          User engagement metrics over time
        </Text>
      </View>

      <LineChart data={growthData} />

      <View style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Logins</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#3b82f6' }}>
              ↗ 4
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Signups</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#10b981' }}>
              ↗ 5
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
`;

// ============================================
// EXAMPLE 7: Summary Dashboard Widget
// ============================================

export const summaryDashboardExample = `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { useAnalytics } from '@/hooks/useAnalytics';

export function SummaryWidget() {
  const {
    clientStats,
    sessionStats,
    therapistPerformance,
    riskClients,
    loading,
  } = useAnalytics();

  if (loading) return <ActivityIndicator />;

  const topTherapist = therapistPerformance[0];
  const highRiskCount = riskClients.filter(r => r.riskLevel === 'high').length;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Dashboard Summary</Text>

      <View style={styles.grid}>
        {/* KPIs */}
        <View style={styles.gridItem}>
          <Text style={styles.label}>Total Clients</Text>
          <Text style={styles.bigNumber}>{clientStats?.total}</Text>
          <Text style={styles.sublabel}>
            {clientStats?.active} active
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>Completion Rate</Text>
          <Text style={styles.bigNumber}>
            {sessionStats?.completionRate}%
          </Text>
          <Text style={styles.sublabel}>
            {sessionStats?.completed} / {sessionStats?.total}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>Avg Progress</Text>
          <Text style={styles.bigNumber}>
            {clientStats?.avgProgress}%
          </Text>
          <Text style={styles.sublabel}>
            Adherence: {clientStats?.avgAdherence}%
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>At-Risk Clients</Text>
          <Text style={[
            styles.bigNumber,
            { color: highRiskCount > 0 ? '#ef4444' : '#10b981' }
          ]}>
            {highRiskCount}
          </Text>
          <Text style={styles.sublabel}>
            Requires attention
          </Text>
        </View>
      </View>

      {/* Top Performer */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Therapist</Text>
        <Text style={styles.therapistName}>
          🏆 {topTherapist?.therapistName}
        </Text>
        <Text style={styles.therapistStats}>
          {topTherapist?.completedSessions} sessions • 
          {topTherapist?.avgSessionProgress}% avg progress
        </Text>
      </View>

      {/* Alerts */}
      {highRiskCount > 0 && (
        <View style={[styles.section, styles.alertSection]}>
          <Text style={styles.alertTitle}>⚠️ Alert</Text>
          <Text style={styles.alertText}>
            {highRiskCount} client(s) require immediate attention
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  gridItem: {
    width: '50%',
    paddingRight: 8,
    marginBottom: 16,
  },
  label: { fontSize: 12, color: '#6b7280' },
  bigNumber: { fontSize: 24, fontWeight: '700', marginVertical: 4 },
  sublabel: { fontSize: 11, color: '#9ca3af' },
  section: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  sectionTitle: { fontSize: 12, color: '#9ca3af', marginBottom: 8 },
  therapistName: { fontWeight: '600', fontSize: 14 },
  therapistStats: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  alertSection: { backgroundColor: '#fef2f2' },
  alertTitle: { fontWeight: '600', color: '#dc2626', fontSize: 13 },
  alertText: { fontSize: 12, color: '#991b1b', marginTop: 4 },
});
`;

// ============================================
// QUICK REFERENCE USAGE
// ============================================

export const quickReferenceUsage = `
// In any component, import and use like this:

import { useAnalytics } from '@/hooks/useAnalytics';

export default function MyComponent() {
  const {
    clientDistribution,
    sessionTrends,
    therapyOutcomes,
    growthData,
    clientStats,
    sessionStats,
    therapistPerformance,
    riskClients,
    loading,
    refresh,
  } = useAnalytics();

  // Access data:
  console.log('Total clients:', clientStats?.total);
  console.log('Completion rate:', sessionStats?.completionRate + '%');
  console.log('Top therapist:', therapistPerformance[0]?.therapistName);
  console.log('At-risk clients:', riskClients.length);

  // Use in JSX, charts, and UI components
  return (
    // Your component JSX...
  );
}
`;

export default {
  dashboardStatCardsExample,
  therapistPerformanceExample,
  atRiskClientsExample,
  therapyOutcomesExample,
  clientListWithRiskExample,
  monthlyGrowthChartExample,
  summaryDashboardExample,
  quickReferenceUsage,
};
