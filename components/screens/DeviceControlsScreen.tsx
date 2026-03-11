import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Wifi,
  WifiOff,
  Battery,
  Shield,
  Clock,
  Zap,
  Activity,
  AlertCircle,
} from 'lucide-react-native';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useDevices } from '@/hooks/useDevices';
import { useResponsive } from '@/hooks/useResponsive';

// Slider Control Component
function SliderControl({
  label,
  value,
  unit,
  min,
  max,
  color,
  scaleLabels,
}: {
  label: string;
  value: number;
  unit: string;
  min: string;
  max: string;
  color: string;
  scaleLabels: string[];
}) {
  const pct = Math.min(100, Math.max(0, ((value - parseFloat(min)) / (parseFloat(max) - parseFloat(min))) * 100)) || 50;
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={[styles.sliderValue, { color }]}>{value}{unit}</Text>
      </View>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${pct}%`, backgroundColor: color }]} />
        <View style={[styles.sliderThumb, { left: `${pct}%`, borderColor: color }]} />
      </View>
      <View style={styles.sliderScale}>
        {scaleLabels.map((s, i) => (
          <Text key={i} style={styles.sliderScaleText}>{s}</Text>
        ))}
      </View>
    </View>
  );
}

const DEMO_DEVICES = [
  { id: '1', name: 'SmartHeal Pro', serial_number: 'ITT-01', status: 'active', battery_level: 87, assigned_to: 'Dr. Verma' },
  { id: '2', name: 'SmartHeal Pro', serial_number: 'ITT-02', status: 'active', battery_level: 92, assigned_to: 'Dr. Kapoor' },
  { id: '3', name: 'SmartHeal Pro', serial_number: 'ITT-03', status: 'inactive', battery_level: 45, assigned_to: 'Dr. Mehta' },
];

const PROTOCOLS = [
  { name: 'Pain Relief', intensity: '40%', frequency: '50 Hz', duration: '20 min' },
  { name: 'Muscle Recovery', intensity: '60%', frequency: '80 Hz', duration: '30 min' },
  { name: 'Performance Enhancement', intensity: '70%', frequency: '100 Hz', duration: '45 min' },
  { name: 'Injury Rehabilitation', intensity: '45%', frequency: '60 Hz', duration: '35 min' },
];

const SAFETY_GUIDELINES = [
  'Ensure device is fully charged before starting a treatment session',
  'Monitor client skin condition at electrode placement sites',
  'Do not exceed recommended intensity levels without medical supervision',
  'Discontinue treatment immediately if client reports unusual pain or discomfort',
  'Clean and sanitize electrodes after each use',
];

export default function DeviceControlsScreen() {
  const { devices, stats, loading, updateDevice, fetchDevices } = useDevices();
  const { isMobile } = useResponsive();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDevices();
    setRefreshing(false);
  };

  const displayDevices = devices.length > 0 ? devices : DEMO_DEVICES;

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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Device Controls</Text>
          <Text style={styles.pageSubtitle}>
            Manage and configure treatment devices and parameters
          </Text>
        </View>
      </View>

      {/* Connected Devices */}
      <Card padding={20}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.devicesRow}>
          {displayDevices.map((device: any) => {
            const isActive = device.status === 'active';
            return (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceCardHeader}>
                  <View style={[styles.deviceIcon, { backgroundColor: isActive ? '#dcfce7' : '#fee2e2' }]}>
                    {isActive ? <Wifi size={20} color="#10b981" /> : <WifiOff size={20} color="#ef4444" />}
                  </View>
                  <Badge
                    text={isActive ? 'Connected' : 'Disconnected'}
                    variant={isActive ? 'success' : 'destructive'}
                  />
                </View>
                <Text style={styles.deviceName}>{device.name}</Text>
                <View style={styles.deviceMeta}>
                  <Battery size={14} color="#64748b" />
                  <Text style={styles.deviceMetaText}>{device.battery_level}%</Text>
                </View>
                <View style={styles.deviceMeta}>
                  <Text style={styles.deviceMetaLabel}>ID: </Text>
                  <Text style={styles.deviceMetaText}>{device.serial_number}</Text>
                </View>
                <View style={styles.deviceMeta}>
                  <Text style={styles.deviceMetaLabel}>Assigned: </Text>
                  <Text style={styles.deviceMetaText}>{device.assigned_to || 'Unassigned'}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </Card>

      {/* Two columns: Treatment Parameters + Protocols */}
      <View style={[styles.twoCol, isMobile && styles.twoColMobile]}>
        {/* Treatment Parameters */}
        <Card style={{...styles.flex1, ...(isMobile ? { flex: undefined } : {})}} padding={20}>
          <Text style={styles.sectionTitle}>Treatment Parameters</Text>
          <SliderControl
            label="Intensity Level"
            value={50}
            unit="%"
            min="0"
            max="100"
            color="#d4183d"
            scaleLabels={['Low', 'Medium', 'High']}
          />
          <SliderControl
            label="Frequency"
            value={60}
            unit=" Hz"
            min="1"
            max="150"
            color="#3b82f6"
            scaleLabels={['1 Hz', '75 Hz', '150 Hz']}
          />
          <SliderControl
            label="Session Duration"
            value={30}
            unit=" min"
            min="5"
            max="60"
            color="#10b981"
            scaleLabels={['5 min', '30 min', '60 min']}
          />
          <SliderControl
            label="Pulse Width"
            value={200}
            unit=" μs"
            min="50"
            max="400"
            color="#f59e0b"
            scaleLabels={['50 μs', '225 μs', '400 μs']}
          />
          <View style={styles.paramButtons}>
            <Button title="Apply Settings" variant="accent" onPress={() => {}} />
            <Button title="Reset" variant="outline" onPress={() => {}} />
          </View>
        </Card>

        {/* Treatment Protocols */}
        <Card style={{...styles.flex1, ...(isMobile ? { flex: undefined } : {})}} padding={20}>
          <Text style={styles.sectionTitle}>Treatment Protocols</Text>
          <View style={styles.protocolTable}>
            <View style={styles.protocolHeaderRow}>
              <Text style={[styles.protocolCell, styles.protocolHeaderCell, { flex: 2 }]}>Protocol</Text>
              <Text style={[styles.protocolCell, styles.protocolHeaderCell]}>Intensity</Text>
              <Text style={[styles.protocolCell, styles.protocolHeaderCell]}>Frequency</Text>
              <Text style={[styles.protocolCell, styles.protocolHeaderCell]}>Duration</Text>
            </View>
            {PROTOCOLS.map((p, i) => (
              <View key={i} style={[styles.protocolRow, i % 2 === 0 && { backgroundColor: '#f8fafc' }]}>
                <Text style={[styles.protocolCell, { flex: 2, fontWeight: '600', color: '#030213' }]}>{p.name}</Text>
                <Text style={styles.protocolCell}>{p.intensity}</Text>
                <Text style={styles.protocolCell}>{p.frequency}</Text>
                <Text style={styles.protocolCell}>{p.duration}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Two columns: Safety + Usage Stats */}
      <View style={[styles.twoCol, isMobile && styles.twoColMobile]}>
        {/* Safety Guidelines */}
        <Card style={{...styles.flex1, ...(isMobile ? { flex: undefined } : {})}} padding={20}>
          <View style={styles.safetyHeader}>
            <AlertCircle size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Safety Guidelines</Text>
          </View>
          {SAFETY_GUIDELINES.map((g, i) => (
            <View key={i} style={styles.guidelineRow}>
              <Shield size={14} color="#64748b" style={{ marginTop: 2 }} />
              <Text style={styles.guidelineText}>{g}</Text>
            </View>
          ))}
        </Card>

        {/* Device Usage Statistics */}
        <Card style={{...styles.flex1, ...(isMobile ? { flex: undefined } : {})}} padding={20}>
          <Text style={styles.sectionTitle}>Device Usage Statistics</Text>
          <View style={styles.usageGrid}>
            <View style={[styles.usageItem, { backgroundColor: '#fef2f3' }]}>
              <Clock size={20} color="#d4183d" />
              <Text style={styles.usageValue}>1,247 h</Text>
              <Text style={styles.usageLabel}>Total Usage Hours</Text>
            </View>
            <View style={[styles.usageItem, { backgroundColor: '#dcfce7' }]}>
              <Activity size={20} color="#10b981" />
              <Text style={styles.usageValue}>523</Text>
              <Text style={styles.usageLabel}>Sessions Completed</Text>
            </View>
            <View style={[styles.usageItem, { backgroundColor: '#dbeafe' }]}>
              <Clock size={20} color="#3b82f6" />
              <Text style={styles.usageValue}>38 min</Text>
              <Text style={styles.usageLabel}>Avg Session Duration</Text>
            </View>
            <View style={[styles.usageItem, { backgroundColor: '#fef3c7' }]}>
              <Zap size={20} color="#f59e0b" />
              <Text style={styles.usageValue}>99.2%</Text>
              <Text style={styles.usageLabel}>Device Uptime</Text>
            </View>
          </View>
        </Card>
      </View>
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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#030213', marginBottom: 16 },
  devicesRow: { gap: 12, paddingBottom: 4 },
  deviceCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#e2e8f0', width: 220,
  },
  deviceCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  deviceIcon: {
    width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  deviceName: { fontSize: 16, fontWeight: '700', color: '#030213', marginBottom: 8 },
  deviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  deviceMetaLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  deviceMetaText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  twoCol: { flexDirection: 'row', gap: 16 },
  twoColMobile: { flexDirection: 'column' },
  flex1: { flex: 1 },
  sliderContainer: { marginBottom: 20 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sliderLabel: { fontSize: 14, fontWeight: '600', color: '#030213' },
  sliderValue: { fontSize: 14, fontWeight: '700' },
  sliderTrack: {
    height: 8, backgroundColor: '#e2e8f0', borderRadius: 4,
    position: 'relative', marginBottom: 6,
  },
  sliderFill: { height: '100%', borderRadius: 4 },
  sliderThumb: {
    position: 'absolute', top: -4, width: 16, height: 16,
    borderRadius: 8, backgroundColor: '#fff', borderWidth: 3,
    marginLeft: -8,
  },
  sliderScale: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderScaleText: { fontSize: 11, color: '#94a3b8' },
  paramButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  protocolTable: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' },
  protocolHeaderRow: {
    flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 10, paddingHorizontal: 12,
  },
  protocolRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 },
  protocolCell: { flex: 1, fontSize: 13, color: '#64748b' },
  protocolHeaderCell: { fontWeight: '700', color: '#030213' },
  safetyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  guidelineRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  guidelineText: { fontSize: 13, color: '#64748b', flex: 1, lineHeight: 18 },
  usageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  usageItem: {
    width: '48%', borderRadius: 12, padding: 16, gap: 6,
  },
  usageValue: { fontSize: 24, fontWeight: '700', color: '#030213' },
  usageLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
});
