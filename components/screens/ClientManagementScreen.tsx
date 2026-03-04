import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  TrendingUp,
  Filter,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SearchBar } from '@/components/ui/SearchBar';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useClients } from '@/hooks/useClients';
import { useResponsive } from '@/hooks/useResponsive';
import type { Client, ClientInsert } from '@/types';

export default function ClientManagementScreen() {
  const {
    clients,
    loading,
    stats,
    searchClients,
    createClient,
    updateClient,
    deleteClient,
    fetchClients,
  } = useClients();
  const { isMobile, columns } = useResponsive();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_type: 'General',
  });
  const [saving, setSaving] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchClients(text);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  };

  const handleAddClient = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    try {
      setSaving(true);
      await createClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profile_type: formData.profile_type,
      } as ClientInsert);
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', profile_type: 'General' });
    } catch (err) {
      Alert.alert('Error', 'Failed to create client');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClient = (id: string) => {
    Alert.alert('Delete Client', 'Are you sure you want to delete this client?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteClient(id);
            setSelectedClient(null);
          } catch {
            Alert.alert('Error', 'Failed to delete client');
          }
        },
      },
    ]);
  };

  const handleToggleStatus = async (client: Client) => {
    try {
      await updateClient(client.id, {
        status: client.status === 'Active' ? 'Inactive' : 'Active',
      });
    } catch {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const avgAdherence = clients.length
    ? Math.round(clients.reduce((sum, c) => sum + (c.adherence || 0), 0) / clients.length)
    : 0;

  if (loading && !refreshing && clients.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d4183d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Client Management</Text>
            <Text style={styles.pageSubtitle}>
              Manage and monitor all client profiles and progress
            </Text>
          </View>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search clients..."
            style={styles.searchBar}
          />
          <TouchableOpacity style={styles.filterDropdown}>
            <Filter size={16} color="#64748b" />
            <Text style={styles.filterText}>All Types</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsGrid, { flexWrap: 'wrap' }]}>
          <View style={[styles.statItem, { width: isMobile ? '48%' : '23%' }]}>
            <StatCard
              title="Total Clients"
              value={stats.total}
              icon={<Users size={20} color="#64748b" />}
              iconBgColor="#f1f5f9"
            />
          </View>
          <View style={[styles.statItem, { width: isMobile ? '48%' : '23%' }]}>
            <StatCard
              title="Active"
              value={stats.active}
              icon={<Users size={20} color="#10b981" />}
              iconBgColor="#dcfce7"
            />
          </View>
          <View style={[styles.statItem, { width: isMobile ? '48%' : '23%' }]}>
            <StatCard
              title="Avg Progress"
              value={`${stats.avgProgress}%`}
              icon={<TrendingUp size={20} color="#d4183d" />}
              iconBgColor="#fef2f3"
            />
          </View>
          <View style={[styles.statItem, { width: isMobile ? '48%' : '23%' }]}>
            <StatCard
              title="Avg Adherence"
              value={`${avgAdherence}%`}
              icon={<TrendingUp size={20} color="#d4183d" />}
              iconBgColor="#fef2f3"
            />
          </View>
        </View>

        {/* Client Cards Grid */}
        <View style={[styles.clientGrid, { flexWrap: 'wrap' }]}>
          {clients.map((client) => (
            <TouchableOpacity
              key={client.id}
              style={[
                styles.clientCard,
                {
                  width: isMobile ? '100%' : columns >= 3 ? '31.5%' : '48%',
                },
              ]}
              onPress={() => setSelectedClient(client)}
              activeOpacity={0.7}
            >
              <Card padding={16}>
                <View style={styles.clientHeader}>
                  <View style={styles.clientHeaderLeft}>
                    <Avatar name={client.name} size={44} color={client.avatar_color || '#10b981'} />
                    <View>
                      <Text style={styles.clientName}>{client.name}</Text>
                      <Text style={styles.clientType}>{client.profile_type}</Text>
                    </View>
                  </View>
                  <Badge
                    text={client.status}
                    variant={client.status === 'Active' ? 'success' : 'warning'}
                  />
                </View>

                <View style={styles.clientInfo}>
                  <View style={styles.infoRow}>
                    <Mail size={14} color="#64748b" />
                    <Text style={styles.infoText} numberOfLines={1}>
                      {client.email}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Phone size={14} color="#64748b" />
                    <Text style={styles.infoText}>{client.phone}</Text>
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressValue}>{client.progress}%</Text>
                  </View>
                  <ProgressBar progress={client.progress} height={6} />
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Sessions</Text>
                    <Text style={styles.metricValue}>{client.sessions}</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Adherence</Text>
                    <Text style={styles.metricValue}>{client.adherence}%</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.lastActive}>Last: {client.last_active}</Text>
                  <View style={styles.trendRow}>
                    <TrendingUp size={12} color={client.change >= 0 ? '#10b981' : '#ef4444'} />
                    <Text
                      style={[
                        styles.trendText,
                        { color: client.change >= 0 ? '#10b981' : '#ef4444' },
                      ]}
                    >
                      {Math.abs(client.change)}% ↑
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {clients.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Users size={48} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No clients found</Text>
            <Text style={styles.emptyDesc}>
              Add your first client to get started
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Client Modal */}
      <Modal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Client"
      >
        <Input
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter client name"
        />
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
        <Input
          label="Profile Type"
          value={formData.profile_type}
          onChangeText={(text) => setFormData({ ...formData, profile_type: text })}
          placeholder="e.g., Physical Therapy"
        />
        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setShowAddModal(false)}
          />
          <Button
            title="Add Client"
            variant="accent"
            onPress={handleAddClient}
            loading={saving}
          />
        </View>
      </Modal>

      {/* Client Detail Modal */}
      <Modal
        visible={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        title={selectedClient?.name || 'Client Details'}
      >
        {selectedClient && (
          <View>
            <View style={styles.detailRow}>
              <Avatar
                name={selectedClient.name}
                size={56}
                color={selectedClient.avatar_color}
              />
              <View style={styles.detailInfo}>
                <Text style={styles.detailName}>{selectedClient.name}</Text>
                <Text style={styles.detailType}>{selectedClient.profile_type}</Text>
                <Badge
                  text={selectedClient.status}
                  variant={selectedClient.status === 'Active' ? 'success' : 'warning'}
                />
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{selectedClient.email}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{selectedClient.phone}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Progress</Text>
              <ProgressBar progress={selectedClient.progress} height={8} />
              <Text style={styles.detailValue}>{selectedClient.progress}%</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Sessions</Text>
              <Text style={styles.detailValue}>{selectedClient.sessions}</Text>
            </View>

            <View style={styles.modalActions}>
              <Button
                title={selectedClient.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                variant="outline"
                onPress={() => handleToggleStatus(selectedClient)}
              />
              <Button
                title="Delete"
                variant="destructive"
                onPress={() => handleDeleteClient(selectedClient.id)}
              />
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  content: { padding: 20, gap: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#030213' },
  pageSubtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  searchRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  searchBar: { flex: 1 },
  filterDropdown: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff',
  },
  filterText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statItem: { marginBottom: 4 },
  clientGrid: { flexDirection: 'row', gap: 16 },
  clientCard: { marginBottom: 4 },
  clientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  clientHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  clientName: { fontSize: 16, fontWeight: '700', color: '#030213' },
  clientType: { fontSize: 12, color: '#64748b' },
  clientInfo: { gap: 6, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 13, color: '#64748b', flex: 1 },
  progressSection: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: '#64748b' },
  progressValue: { fontSize: 12, fontWeight: '600', color: '#030213' },
  metricsRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9', marginBottom: 8,
  },
  metric: { alignItems: 'center' },
  metricValue: { fontSize: 16, fontWeight: '700', color: '#030213' },
  metricLabel: { fontSize: 11, color: '#64748b', marginBottom: 2 },
  metricDivider: { width: 1, height: 30, backgroundColor: '#e2e8f0' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastActive: { fontSize: 12, color: '#94a3b8' },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  trendText: { fontSize: 12, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#030213', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#64748b', marginTop: 4 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  detailInfo: { flex: 1, gap: 4 },
  detailName: { fontSize: 20, fontWeight: '700', color: '#030213' },
  detailType: { fontSize: 14, color: '#64748b' },
  detailSection: { marginBottom: 12 },
  detailLabel: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 4 },
  detailValue: { fontSize: 14, color: '#030213' },
});
