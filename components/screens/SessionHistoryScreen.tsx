import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Calendar, Clock, Activity, Download } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useSessions } from '@/hooks/useSessions';
import { useResponsive } from '@/hooks/useResponsive';

const statusVariant = (status: string) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Scheduled': return 'info';
    case 'In Progress': return 'warning';
    case 'Cancelled': return 'destructive';
    default: return 'default';
  }
};

const priorityVariant = (priority: string) => {
  switch (priority) {
    case 'High': return 'destructive';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
  }
};

// Demo client names mapped to sessions
const CLIENT_NAMES: Record<string, { name: string; type: string }> = {
  'ITT Therapy': { name: 'Priya Sharma', type: 'ITT Therapy' },
  'Recovery': { name: 'Arjun Patel', type: 'Recovery' },
  'Assessment': { name: 'Vikram Reddy', type: 'Assessment' },
};

export default function SessionHistoryScreen() {
  const { sessions, loading, stats, filterSessions, createSession, fetchSessions } =
    useSessions();
  const { isMobile } = useResponsive();

  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    therapy_type: '',
    date: '',
    time: '',
    duration: '30 min',
    client_id: '',
  });
  const [saving, setSaving] = useState(false);

  const filterTabs = ['All', 'Completed', 'Scheduled', 'Cancelled'];

  const handleFilterChange = (tab: string) => {
    setActiveFilter(tab);
    filterSessions(tab);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  };

  const handleAddSession = async () => {
    if (!formData.therapy_type || !formData.date || !formData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      setSaving(true);
      await createSession({
        therapy_type: formData.therapy_type,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        client_id: formData.client_id || '00000000-0000-0000-0000-000000000000',
        therapist_id: '00000000-0000-0000-0000-000000000000',
      });
      setShowAddModal(false);
      setFormData({ therapy_type: '', date: '', time: '', duration: '30 min', client_id: '' });
    } catch {
      Alert.alert('Error', 'Failed to create session');
    } finally {
      setSaving(false);
    }
  };

  const thisWeek = sessions.filter((s) => {
    const d = new Date(s.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  if (loading && !refreshing && sessions.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d4183d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Session History</Text>
            <Text style={styles.pageSubtitle}>Track and manage all therapy sessions</Text>
          </View>
          <TouchableOpacity style={styles.exportBtn}>
            <Download size={16} color="#fff" />
            <Text style={styles.exportBtnText}>Export Report</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.completed}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Scheduled</Text>
            <Text style={[styles.statValue, { color: '#3b82f6' }]}>{stats.scheduled}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>{thisWeek || stats.total}</Text>
          </Card>
        </View>

        {/* Filter Tabs */}
        <FilterTabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onTabChange={handleFilterChange}
        />

        {/* Session List */}
        {sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No sessions found</Text>
            <Text style={styles.emptyDesc}>
              Create your first session to get started
            </Text>
          </View>
        ) : (
          sessions.map((session, index) => {
            const clientInfo = CLIENT_NAMES[session.therapy_type] || {
              name: `Client ${index + 1}`,
              type: session.therapy_type,
            };
            const priority = session.progress >= 75 ? 'High' : session.progress >= 50 ? 'Medium' : 'Low';
            const isCompleted = session.status === 'Completed';

            return (
              <Card key={session.id} style={styles.sessionCard} padding={16}>
                <View style={styles.sessionRow}>
                  {/* Left: Avatar + Info */}
                  <View style={styles.sessionLeft}>
                    <Avatar name={clientInfo.name} size={40} color="#d4183d" />
                    <View>
                      <Text style={styles.sessionName}>{clientInfo.name}</Text>
                      <Text style={styles.sessionType}>{clientInfo.type}</Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <Badge
                    text={session.status.toLowerCase()}
                    variant={statusVariant(session.status) as any}
                  />

                  {/* Actions */}
                  <View style={styles.sessionActions}>
                    <TouchableOpacity style={styles.viewDetailsBtn}>
                      <Text style={styles.viewDetailsBtnText}>View Details</Text>
                    </TouchableOpacity>
                    {!isCompleted && session.status === 'Scheduled' && (
                      <Text style={styles.rescheduleText}>Reschedule</Text>
                    )}
                  </View>
                </View>

                {/* Meta Row */}
                <View style={[styles.sessionMeta, isMobile && styles.sessionMetaMobile]}>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#64748b" />
                    <Text style={styles.metaText}>{session.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#64748b" />
                    <Text style={styles.metaText}>{session.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Activity size={14} color="#64748b" />
                    <Text style={styles.metaText}>{session.duration}</Text>
                  </View>
                  <Badge text={priority} variant={priorityVariant(priority) as any} />
                </View>

                {session.notes && isCompleted && (
                  <Text style={styles.sessionNotes}>Notes: {session.notes}</Text>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Add Session Modal */}
      <Modal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule New Session"
      >
        <Input
          label="Therapy Type"
          value={formData.therapy_type}
          onChangeText={(text) => setFormData({ ...formData, therapy_type: text })}
          placeholder="e.g., Physical Therapy"
        />
        <Input
          label="Date"
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
          placeholder="YYYY-MM-DD"
        />
        <Input
          label="Time"
          value={formData.time}
          onChangeText={(text) => setFormData({ ...formData, time: text })}
          placeholder="e.g., 10:00 AM"
        />
        <Input
          label="Duration"
          value={formData.duration}
          onChangeText={(text) => setFormData({ ...formData, duration: text })}
          placeholder="e.g., 30 min"
        />
        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setShowAddModal(false)}
          />
          <Button
            title="Schedule"
            variant="accent"
            onPress={handleAddSession}
            loading={saving}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, gap: 16 },
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
  statsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 100, padding: 14 },
  statValue: { fontSize: 22, fontWeight: '700', color: '#030213' },
  statLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  sessionCard: { marginBottom: 4 },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap',
  },
  sessionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 },
  sessionName: { fontSize: 15, fontWeight: '600', color: '#030213' },
  sessionType: { fontSize: 12, color: '#64748b' },
  sessionActions: { alignItems: 'flex-end', gap: 4 },
  viewDetailsBtn: {
    borderWidth: 1, borderColor: '#d4183d', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  viewDetailsBtnText: { fontSize: 12, fontWeight: '600', color: '#d4183d' },
  rescheduleText: { fontSize: 12, color: '#64748b' },
  sessionMeta: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', alignItems: 'center' },
  sessionMetaMobile: { gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: '#64748b' },
  sessionNotes: { fontSize: 13, color: '#3b82f6', marginTop: 8, fontStyle: 'italic' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#030213', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#64748b', marginTop: 4 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 },
});
