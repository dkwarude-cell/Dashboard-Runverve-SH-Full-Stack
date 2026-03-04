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
  MessageCircle,
  AlertCircle,
  Clock,
  CheckCircle,
  Filter,
  ChevronRight,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { SmartHealLogo } from '@/components/ui/SmartHealLogo';
import { useQueries } from '@/hooks/useQueries';
import { useResponsive } from '@/hooks/useResponsive';
import type { Query } from '@/types';

const DEMO_QUERIES: Query[] = [
  {
    id: '1', title: 'Device connectivity issue', description: 'SmartHeal Pro is not connecting to the mobile app via Bluetooth',
    client_id: 'c1', assigned_to: null, priority: 'High', status: 'In Progress',
    support_id: 'Q001', device_info: null, created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2', title: 'Treatment plan adjustment request', description: 'Client requesting modification to current therapy protocol',
    client_id: 'c2', assigned_to: null, priority: 'Medium', status: 'Open',
    support_id: 'Q002', device_info: null, created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3', title: 'Billing discrepancy', description: 'Client reports incorrect charge on latest invoice',
    client_id: 'c3', assigned_to: null, priority: 'Low', status: 'New',
    support_id: 'Q003', device_info: null, created_at: new Date(Date.now() - 10800000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '4', title: 'Device firmware update issue', description: 'Unable to update firmware on SmartHeal device ITT-03',
    client_id: 'c4', assigned_to: null, priority: 'Critical', status: 'Open',
    support_id: 'Q004', device_info: null, created_at: new Date(Date.now() - 14400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '5', title: 'Session data not syncing', description: 'Therapy session data not appearing in dashboard after completion',
    client_id: 'c5', assigned_to: null, priority: 'High', status: 'In Progress',
    support_id: 'Q005', device_info: null, created_at: new Date(Date.now() - 18000000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '6', title: 'Pain reduction protocol inquiry', description: 'Requesting information about advanced pain management protocols',
    client_id: 'c6', assigned_to: null, priority: 'Medium', status: 'Closed',
    support_id: 'Q006', device_info: null, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
];

const CLIENT_NAMES: Record<string, string> = {
  c1: 'Sarah Johnson', c2: 'Mike Chen', c3: 'Emma Davis',
  c4: 'James Wilson', c5: 'Lisa Anderson', c6: 'Robert Taylor',
};

// Infer category from title keywords
function getCategory(title: string): { label: string; color: string; bg: string } {
  const t = title.toLowerCase();
  if (t.includes('device') || t.includes('firmware') || t.includes('connectivity'))
    return { label: 'Device', color: '#3b82f6', bg: '#dbeafe' };
  if (t.includes('billing') || t.includes('charge') || t.includes('invoice'))
    return { label: 'Billing', color: '#f59e0b', bg: '#fef3c7' };
  if (t.includes('treatment') || t.includes('therapy') || t.includes('pain') || t.includes('session'))
    return { label: 'Therapy', color: '#10b981', bg: '#dcfce7' };
  return { label: 'Technical', color: '#8b5cf6', bg: '#ede9fe' };
}

function getPriorityVariant(priority: string): 'destructive' | 'warning' | 'success' | 'info' {
  switch (priority) {
    case 'Critical': return 'destructive';
    case 'High': return 'destructive';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'info';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Closed': return { color: '#10b981', bg: '#dcfce7' };
    case 'In Progress': return { color: '#3b82f6', bg: '#dbeafe' };
    case 'Open': return { color: '#f59e0b', bg: '#fef3c7' };
    case 'New': return { color: '#d4183d', bg: '#fef2f3' };
    default: return { color: '#64748b', bg: '#f1f5f9' };
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function QueryManagementScreen() {
  const { queries: realQueries, stats, loading, fetchQueries } = useQueries();
  const { isMobile } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const queries = realQueries.length > 0 ? realQueries : DEMO_QUERIES;

  const computedStats = realQueries.length > 0 ? stats : {
    total: DEMO_QUERIES.length,
    open: DEMO_QUERIES.filter(q => q.status === 'Open' || q.status === 'New').length,
    inProgress: DEMO_QUERIES.filter(q => q.status === 'In Progress').length,
    closed: DEMO_QUERIES.filter(q => q.status === 'Closed').length,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQueries();
    setRefreshing(false);
  };

  const filteredQueries = queries.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <SmartHealLogo size={28} />
          <View>
            <Text style={styles.pageTitle}>Query Management</Text>
            <Text style={styles.pageSubtitle}>
              Track and respond to client queries and support tickets
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#f1f5f9' }]}>
            <MessageCircle size={18} color="#64748b" />
          </View>
          <View>
            <Text style={styles.statValue}>{computedStats.total}</Text>
            <Text style={styles.statLabel}>Total Queries</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#fef2f3' }]}>
            <AlertCircle size={18} color="#d4183d" />
          </View>
          <View>
            <Text style={[styles.statValue, { color: '#d4183d' }]}>{computedStats.open}</Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
            <Clock size={18} color="#3b82f6" />
          </View>
          <View>
            <Text style={[styles.statValue, { color: '#3b82f6' }]}>{computedStats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
            <CheckCircle size={18} color="#10b981" />
          </View>
          <View>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{computedStats.closed}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search queries..." />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Two Columns: Query List + Detail */}
      <View style={[styles.twoCol, isMobile && styles.twoColMobile]}>
        {/* Query List */}
        <View style={[styles.queryListCol, isMobile && { flex: undefined }]}>
          {filteredQueries.map((q) => {
            const cat = getCategory(q.title);
            const statusCol = getStatusColor(q.status);
            const isSelected = selectedQuery?.id === q.id;
            return (
              <TouchableOpacity
                key={q.id}
                onPress={() => setSelectedQuery(q)}
              >
                <Card
                  style={{...styles.queryCard, ...(isSelected ? { borderColor: '#d4183d', borderWidth: 2 } : {})}}
                  padding={16}
                >
                  <View style={styles.queryCardTop}>
                    <View style={styles.queryCardBadges}>
                      <Text style={styles.queryId}>#{q.support_id}</Text>
                      <View style={[styles.categoryBadge, { backgroundColor: cat.bg }]}>
                        <Text style={[styles.categoryText, { color: cat.color }]}>{cat.label}</Text>
                      </View>
                      <Badge
                        text={q.priority}
                        variant={getPriorityVariant(q.priority)}
                      />
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusCol.bg }]}>
                      <Text style={[styles.statusText, { color: statusCol.color }]}>{q.status === 'Closed' ? 'Resolved' : q.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.queryTitle}>{q.title}</Text>
                  <Text style={styles.queryDesc} numberOfLines={2}>{q.description}</Text>
                  <View style={styles.queryFooter}>
                    <Text style={styles.queryClient}>
                      {CLIENT_NAMES[q.client_id] || 'Unknown Client'}
                    </Text>
                    <Text style={styles.queryTime}>{timeAgo(q.created_at)}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detail Pane */}
        <View style={[styles.detailCol, isMobile && { flex: undefined, minHeight: 200 }]}>
          <Card style={styles.detailCard} padding={20}>
            {selectedQuery ? (
              <>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailId}>#{selectedQuery.support_id}</Text>
                  <Badge
                    text={selectedQuery.priority}
                    variant={getPriorityVariant(selectedQuery.priority)}
                  />
                </View>
                <Text style={styles.detailTitle}>{selectedQuery.title}</Text>
                <Text style={styles.detailDesc}>{selectedQuery.description}</Text>
                <View style={styles.detailMeta}>
                  <Text style={styles.detailMetaLabel}>Client:</Text>
                  <Text style={styles.detailMetaValue}>
                    {CLIENT_NAMES[selectedQuery.client_id] || selectedQuery.client_id}
                  </Text>
                </View>
                <View style={styles.detailMeta}>
                  <Text style={styles.detailMetaLabel}>Status:</Text>
                  <Text style={styles.detailMetaValue}>{selectedQuery.status}</Text>
                </View>
                <View style={styles.detailMeta}>
                  <Text style={styles.detailMetaLabel}>Created:</Text>
                  <Text style={styles.detailMetaValue}>
                    {new Date(selectedQuery.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.detailEmpty}>
                <MessageCircle size={40} color="#e2e8f0" />
                <Text style={styles.detailEmptyTitle}>Select a query</Text>
                <Text style={styles.detailEmptyDesc}>
                  Choose a query from the list to view details
                </Text>
              </View>
            )}
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, gap: 20 },
  header: {},
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#030213' },
  pageSubtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  statItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: '#e2e8f0', flex: 1, minWidth: 160,
  },
  statIcon: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '700', color: '#030213' },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },

  // Search
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterBtn: {
    width: 40, height: 40, borderRadius: 8,
    borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },

  // Layout
  twoCol: { flexDirection: 'row', gap: 16 },
  twoColMobile: { flexDirection: 'column' },
  queryListCol: { flex: 1, gap: 10 },
  detailCol: { flex: 1 },

  // Query card
  queryCard: { marginBottom: 0 },
  queryCardTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8,
  },
  queryCardBadges: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  queryId: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  categoryBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 11, fontWeight: '600' },
  queryTitle: { fontSize: 15, fontWeight: '700', color: '#030213', marginBottom: 4 },
  queryDesc: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 8 },
  queryFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8,
  },
  queryClient: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  queryTime: { fontSize: 12, color: '#94a3b8' },

  // Detail
  detailCard: { height: '100%' },
  detailHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12,
  },
  detailId: { fontSize: 14, fontWeight: '700', color: '#d4183d' },
  detailTitle: { fontSize: 18, fontWeight: '700', color: '#030213', marginBottom: 8 },
  detailDesc: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 16 },
  detailMeta: { flexDirection: 'row', marginBottom: 8 },
  detailMetaLabel: { fontSize: 13, color: '#94a3b8', fontWeight: '600', width: 80 },
  detailMetaValue: { fontSize: 13, color: '#030213', fontWeight: '500' },
  detailEmpty: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8,
    minHeight: 300,
  },
  detailEmptyTitle: { fontSize: 16, fontWeight: '700', color: '#94a3b8' },
  detailEmptyDesc: { fontSize: 13, color: '#cbd5e1' },
});
