/**
 * SAMPLE ANALYTICS DATA REFERENCE
 * 
 * This file shows the exact values that will be calculated from the dummy data
 * Use this for testing and understanding the analytics system
 */

// ============================================
// CLIENT STATISTICS (from 12 dummy clients)
// ============================================

export const SAMPLE_CLIENT_STATS = {
  total: 12,
  active: 9,
  inactive: 3,
  avgProgress: 65,
  avgAdherence: 79,
  byProfileType: {
    'Orthopedic': 4,
    'Cardiac': 2,
    'Sports Medicine': 2,
    'Neurological': 2,
    'General': 2,
  },
};

// ============================================
// SESSION STATISTICS (from 25 sessions)
// ============================================

export const SAMPLE_SESSION_STATS = {
  total: 25,
  completed: 18,
  scheduled: 4,
  cancelled: 3,
  completionRate: 72,
  avgProgress: 82,
};

// ============================================
// DEVICE STATISTICS (from 6 devices)
// ============================================

export const SAMPLE_DEVICE_STATS = {
  total: 6,
  connected: 4,
  standby: 1,
  offline: 1,
  connectionRate: 83.3,
};

// ============================================
// THERAPY OUTCOMES (by therapy type)
// ============================================

export const SAMPLE_THERAPY_OUTCOMES = [
  {
    therapyType: 'EMS Therapy',
    avgProgress: 88,
    sessionsCount: 4,
    successRate: 100, // All sessions had >70% progress
  },
  {
    therapyType: 'Ultrasound Therapy',
    avgProgress: 79,
    sessionsCount: 8,
    successRate: 75,
  },
  {
    therapyType: 'Cardiac Rehab',
    avgProgress: 76,
    sessionsCount: 5,
    successRate: 60,
  },
  {
    therapyType: 'Neurostimulation',
    avgProgress: 68,
    sessionsCount: 4,
    successRate: 50,
  },
  {
    therapyType: 'TENS Therapy',
    avgProgress: 85,
    sessionsCount: 2,
    successRate: 100,
  },
  {
    therapyType: 'General Wellness',
    avgProgress: 0, // No completed sessions
    sessionsCount: 0,
    successRate: 0,
  },
];

// ============================================
// THERAPIST PERFORMANCE RANKINGS
// ============================================

export const SAMPLE_THERAPIST_PERFORMANCE = [
  {
    therapistId: 't1000000-0000-0000-0000-000000000002',
    therapistName: 'Dr. Neha Patel',
    clientsCount: 8,
    completedSessions: 13,
    avgClientProgress: 76,
    avgSessionProgress: 85,
  },
  {
    therapistId: 't1000000-0000-0000-0000-000000000001',
    therapistName: 'Dr. Rajesh Sharma',
    clientsCount: 5,
    completedSessions: 8,
    avgClientProgress: 63,
    avgSessionProgress: 71,
  },
  {
    therapistId: 't1000000-0000-0000-0000-000000000003',
    therapistName: 'Dr. Priya Singh',
    clientsCount: 3,
    completedSessions: 5,
    avgClientProgress: 48,
    avgSessionProgress: 68,
  },
];

// ============================================
// AT-RISK CLIENTS IDENTIFICATION
// ============================================

export const SAMPLE_AT_RISK_CLIENTS = [
  {
    clientId: 'c1000000-0000-0000-0000-000000000011',
    clientName: 'Sneha Desai',
    riskLevel: 'high',
    reasons: [
      'Low adherence rate (40%)',
      'Minimal progress (20%)',
      'Inactive status',
    ],
    lastActive: '2 weeks ago',
  },
  {
    clientId: 'c1000000-0000-0000-0000-000000000007',
    clientName: 'Kavya Menon',
    riskLevel: 'high',
    reasons: [
      'Low adherence rate (60%)',
      'Below average progress (35%)',
      'Inactive status',
    ],
    lastActive: '1 week ago',
  },
  {
    clientId: 'c1000000-0000-0000-0000-000000000004',
    clientName: 'Vikram Reddy',
    riskLevel: 'medium',
    reasons: [
      'Declining progress trend (-2.1%)',
      'Below average progress (45%)',
    ],
    lastActive: '3 days ago',
  },
];

// ============================================
// MONTHLY GROWTH TRENDS
// ============================================

export const SAMPLE_MONTHLY_GROWTH = [
  {
    month: 'Jan',
    activeClients: 2,
    completedSessions: 2,
    newClients: 0,
  },
  {
    month: 'Feb',
    activeClients: 5,
    completedSessions: 8,
    newClients: 0,
  },
  {
    month: 'Mar',
    activeClients: 9,
    completedSessions: 8,
    newClients: 0,
  },
];

// ============================================
// CHART DATA FOR COMPONENTS
// ============================================

export const SAMPLE_CLIENT_DISTRIBUTION_CHART = [
  { label: 'Orthopedic', value: 4, color: '#e84d6a' },
  { label: 'Cardiac', value: 2, color: '#3b82f6' },
  { label: 'Sports Medicine', value: 2, color: '#10b981' },
  { label: 'Neurological', value: 2, color: '#f59e0b' },
  { label: 'General', value: 2, color: '#8b5cf6' },
];

export const SAMPLE_SESSION_TRENDS_CHART = [
  {
    label: 'Jan',
    values: [
      { value: 1, color: '#3b82f6', label: 'Scheduled' },
      { value: 1, color: '#10b981', label: 'Completed' },
    ],
  },
  {
    label: 'Feb',
    values: [
      { value: 2, color: '#3b82f6', label: 'Scheduled' },
      { value: 6, color: '#10b981', label: 'Completed' },
    ],
  },
  {
    label: 'Mar',
    values: [
      { value: 1, color: '#3b82f6', label: 'Scheduled' },
      { value: 11, color: '#10b981', label: 'Completed' },
    ],
  },
];

export const SAMPLE_THERAPY_OUTCOMES_CHART = [
  {
    label: 'EMS Therapy',
    values: [{ value: 88, color: '#10b981' }],
  },
  {
    label: 'Ultrasound Therapy',
    values: [{ value: 79, color: '#10b981' }],
  },
  {
    label: 'Cardiac Rehab',
    values: [{ value: 76, color: '#10b981' }],
  },
  {
    label: 'Neurostimulation',
    values: [{ value: 68, color: '#10b981' }],
  },
  {
    label: 'TENS Therapy',
    values: [{ value: 85, color: '#10b981' }],
  },
];

export const SAMPLE_GROWTH_DATA_CHART = [
  {
    label: 'Jan',
    values: [
      { value: 2, color: '#3b82f6', label: 'Logins' },
      { value: 2, color: '#10b981', label: 'Signups' },
    ],
  },
  {
    label: 'Feb',
    values: [
      { value: 4, color: '#3b82f6', label: 'Logins' },
      { value: 3, color: '#10b981', label: 'Signups' },
    ],
  },
  {
    label: 'Mar',
    values: [
      { value: 4, color: '#3b82f6', label: 'Logins' },
      { value: 5, color: '#10b981', label: 'Signups' },
    ],
  },
];

// ============================================
// SAMPLE USAGE IN COMPONENTS
// ============================================

/**
 * Example: Display top therapist
 */
export function getTopTherapist() {
  return SAMPLE_THERAPIST_PERFORMANCE[0]; // Dr. Neha Patel
  // Returns:
  // {
  //   therapistName: 'Dr. Neha Patel',
  //   clientsCount: 8,
  //   completedSessions: 13,
  //   avgSessionProgress: 85,
  // }
}

/**
 * Example: Get alert count
 */
export function getAlertCounts() {
  const highRisk = SAMPLE_AT_RISK_CLIENTS.filter(c => c.riskLevel === 'high').length;
  const mediumRisk = SAMPLE_AT_RISK_CLIENTS.filter(c => c.riskLevel === 'medium').length;

  return {
    highRisk, // 2
    mediumRisk, // 1
    total: highRisk + mediumRisk, // 3
  };
}

/**
 * Example: Format metrics for display
 */
export function formatDashboardMetrics() {
  return {
    // Key Performance Indicators
    kpis: {
      totalClients: SAMPLE_CLIENT_STATS.total,
      activeClients: SAMPLE_CLIENT_STATS.active,
      inactiveClients: SAMPLE_CLIENT_STATS.inactive,
      completionRate: SAMPLE_SESSION_STATS.completionRate,
      avgClientProgress: SAMPLE_CLIENT_STATS.avgProgress,
      avgAdherence: SAMPLE_CLIENT_STATS.avgAdherence,
    },

    // Alert indicators
    alerts: {
      highRiskClients: 2,
      mediumRiskClients: 1,
      deviceOffline: 1,
      lowCompletionRate: false, // 72% is good
    },

    // Top performers
    topTherapist: SAMPLE_THERAPIST_PERFORMANCE[0].therapistName, // 'Dr. Neha Patel'
    bestTherapyType: 'EMS Therapy', // 100% success rate
    worstTherapyType: 'Neurostimulation', // 50% success rate

    // Session metrics
    sessions: {
      total: SAMPLE_SESSION_STATS.total,
      completed: SAMPLE_SESSION_STATS.completed,
      scheduled: SAMPLE_SESSION_STATS.scheduled,
      cancelled: SAMPLE_SESSION_STATS.cancelled,
    },

    // Client distribution
    clientsByType: SAMPLE_CLIENT_STATS.byProfileType,

    // Device status
    devices: {
      connected: 4,
      available: 5, // Connected + Standby
      offline: 1,
    },
  };
}

/**
 * Example: Generate summary report
 */
export function generateSummaryReport() {
  return `
    📊 SMARTHEAL DASHBOARD SUMMARY
    ═════════════════════════════════════════════════════════════

    👥 CLIENTS
    ├─ Total: 12
    ├─ Active: 9 (75%)
    ├─ Inactive: 3 (25%)
    ├─ Average Progress: 65%
    └─ Average Adherence: 79%

    📅 SESSIONS
    ├─ Total: 25
    ├─ Completed: 18 (72%)
    ├─ Scheduled: 4
    ├─ Cancelled: 3
    └─ Average Session Progress: 82%

    🏥 THERAPY OUTCOMES
    ├─ Best: EMS Therapy (88% avg, 100% success)
    ├─ Good: Ultrasound (79% avg, 75% success)
    ├─ Moderate: Cardiac Rehab (76% avg, 60% success)
    └─ Needs Work: Neurostimulation (68% avg, 50% success)

    👨‍⚕️ THERAPIST PERFORMANCE
    ├─ 🥇 Dr. Neha Patel: 8 clients, 13 sessions, 85% avg progress
    ├─ 🥈 Dr. Rajesh Sharma: 5 clients, 8 sessions, 71% avg progress
    └─ 🥉 Dr. Priya Singh: 3 clients, 5 sessions, 68% avg progress

    ⚠️ AT-RISK CLIENTS (3)
    ├─ 🔴 Sneha Desai: High Risk (40% adherence, inactive)
    ├─ 🔴 Kavya Menon: High Risk (60% adherence, minimal progress)
    └─ 🟡 Vikram Reddy: Medium Risk (declining trend, low progress)

    📱 DEVICES
    ├─ Connected: 4
    ├─ Standby: 1
    ├─ Offline: 1
    └─ Connection Rate: 83.3%

    ✨ KEY INSIGHTS
    ├─ Dr. Neha Patel is the top performer
    ├─ EMS Therapy has the highest success rate
    ├─ 25% of clients are at risk and need attention
    └─ Overall platform health: 72% session completion rate
  `;
}

// ============================================
// TESTING UTILITIES
// ============================================

/**
 * Verify all calculations are correct
 */
export function verifyAnalytics() {
  const checks = {
    clientTotal: SAMPLE_CLIENT_STATS.total === 12,
    sessionCompletion: SAMPLE_SESSION_STATS.completionRate === 72,
    topTherapistSessions: SAMPLE_THERAPIST_PERFORMANCE[0].completedSessions === 13,
    highRiskCount: SAMPLE_AT_RISK_CLIENTS.filter(c => c.riskLevel === 'high').length === 2,
    eMSTherapySuccess: SAMPLE_THERAPY_OUTCOMES[0].successRate === 100,
  };

  return {
    allPass: Object.values(checks).every(v => v === true),
    details: checks,
  };
}

/**
 * Log all data to console for debugging
 */
export function debugAllAnalytics() {
  console.group('📊 COMPLETE ANALYTICS DATA');

  console.group('Client Statistics');
  console.table(SAMPLE_CLIENT_STATS);
  console.groupEnd();

  console.group('Session Statistics');
  console.table(SAMPLE_SESSION_STATS);
  console.groupEnd();

  console.group('Device Statistics');
  console.table(SAMPLE_DEVICE_STATS);
  console.groupEnd();

  console.group('Therapy Outcomes');
  console.table(SAMPLE_THERAPY_OUTCOMES);
  console.groupEnd();

  console.group('Therapist Performance');
  console.table(SAMPLE_THERAPIST_PERFORMANCE);
  console.groupEnd();

  console.group('At-Risk Clients');
  console.table(SAMPLE_AT_RISK_CLIENTS);
  console.groupEnd();

  console.group('Monthly Growth');
  console.table(SAMPLE_MONTHLY_GROWTH);
  console.groupEnd();

  console.groupEnd();
}
