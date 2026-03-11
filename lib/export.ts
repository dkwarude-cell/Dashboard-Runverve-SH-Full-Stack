import { Platform } from 'react-native';

export function exportToCSV(data: any[], filename: string, columns?: { key: string; label: string }[]) {
  if (!data.length) return;

  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));
  const header = cols.map(c => c.label).join(',');
  const rows = data.map(item =>
    cols.map(c => {
      const val = item[c.key];
      const str = val === null || val === undefined ? '' : String(val);
      // Escape CSV values
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  );

  const csv = [header, ...rows].join('\n');

  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function exportClientsCSV(clients: any[]) {
  exportToCSV(clients, 'smartheal-clients', [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'profile_type', label: 'Profile Type' },
    { key: 'status', label: 'Status' },
    { key: 'progress', label: 'Progress (%)' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'adherence', label: 'Adherence (%)' },
    { key: 'last_active', label: 'Last Active' },
    { key: 'notes', label: 'Notes' },
  ]);
}

export function exportSessionsCSV(sessions: any[]) {
  exportToCSV(sessions, 'smartheal-sessions', [
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'therapy_type', label: 'Therapy Type' },
    { key: 'duration', label: 'Duration' },
    { key: 'status', label: 'Status' },
    { key: 'progress', label: 'Progress (%)' },
    { key: 'notes', label: 'Notes' },
  ]);
}

export function exportAnalyticsCSV(analyticsData: { label: string; value: number }[]) {
  exportToCSV(analyticsData, 'smartheal-analytics', [
    { key: 'label', label: 'Category' },
    { key: 'value', label: 'Value' },
  ]);
}
