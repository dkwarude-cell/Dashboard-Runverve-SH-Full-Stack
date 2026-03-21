/**
 * Analytics Logic and Calculations
 * Processes dummy data to generate dashboard insights and metrics
 */

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  avgProgress: number;
  avgAdherence: number;
  byProfileType: Record<string, number>;
}

export interface SessionStats {
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  completionRate: number;
  avgProgress: number;
}

export interface TherapyOutcomeStats {
  therapyType: string;
  avgProgress: number;
  sessionsCount: number;
  successRate: number;
}

export interface DeviceStats {
  total: number;
  connected: number;
  standby: number;
  offline: number;
  connectionRate: number;
}

export interface AnalyticsMetrics {
  clients: ClientStats;
  sessions: SessionStats;
  devices: DeviceStats;
  therapyOutcomes: TherapyOutcomeStats[];
  growthTrend: MonthlyGrowth[];
  topTherapists: TherapistPerformance[];
  clientRiskFactors: ClientRisk[];
}

export interface MonthlyGrowth {
  month: string;
  activeClients: number;
  completedSessions: number;
  newClients: number;
}

export interface TherapistPerformance {
  therapistId: string;
  therapistName: string;
  clientsCount: number;
  completedSessions: number;
  avgClientProgress: number;
  avgSessionProgress: number;
}

export interface ClientRisk {
  clientId: string;
  clientName: string;
  riskLevel: 'high' | 'medium' | 'low';
  reasons: string[];
  lastActive: string;
}

// Calculate client statistics from raw data
export function calculateClientStats(clients: any[]): ClientStats {
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const inactiveClients = clients.filter(c => c.status === 'Inactive').length;
  
  const totalProgress = clients.reduce((sum, c) => sum + (c.progress || 0), 0);
  const avgProgress = clients.length > 0 ? Math.round(totalProgress / clients.length) : 0;
  
  const totalAdherence = clients.reduce((sum, c) => sum + (c.adherence || 0), 0);
  const avgAdherence = clients.length > 0 ? Math.round(totalAdherence / clients.length) : 0;

  // Group by profile type
  const byProfileType = clients.reduce((acc, client) => {
    const type = client.profile_type || 'General';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: clients.length,
    active: activeClients,
    inactive: inactiveClients,
    avgProgress,
    avgAdherence,
    byProfileType,
  };
}

// Calculate session statistics
export function calculateSessionStats(sessions: any[]): SessionStats {
  const completed = sessions.filter(s => s.status === 'Completed').length;
  const scheduled = sessions.filter(s => s.status === 'Scheduled').length;
  const cancelled = sessions.filter(s => s.status === 'Cancelled').length;

  const completionRate = sessions.length > 0 
    ? Math.round((completed / sessions.length) * 100 * 10) / 10 
    : 0;

  const totalProgress = sessions
    .filter(s => s.status === 'Completed')
    .reduce((sum, s) => sum + (s.progress || 0), 0);
  const completedCount = sessions.filter(s => s.status === 'Completed').length;
  const avgProgress = completedCount > 0 ? Math.round(totalProgress / completedCount) : 0;

  return {
    total: sessions.length,
    completed,
    scheduled,
    cancelled,
    completionRate,
    avgProgress,
  };
}

// Calculate device statistics
export function calculateDeviceStats(devices: any[]): DeviceStats {
  const connected = devices.filter(d => d.status === 'Connected').length;
  const standby = devices.filter(d => d.status === 'Standby').length;
  const offline = devices.filter(d => d.status === 'Offline').length;

  const connectionRate = devices.length > 0 
    ? Math.round(((connected + standby) / devices.length) * 100 * 10) / 10 
    : 0;

  return {
    total: devices.length,
    connected,
    standby,
    offline,
    connectionRate,
  };
}

// Calculate therapy outcomes by type
export function calculateTherapyOutcomes(sessions: any[]): TherapyOutcomeStats[] {
  const completedSessions = sessions.filter(s => s.status === 'Completed');
  
  const outcomesByType = completedSessions.reduce((acc, session) => {
    const type = session.therapy_type || 'Unknown';
    if (!acc[type]) {
      acc[type] = { sessions: [], total: 0, count: 0 };
    }
    acc[type].sessions.push(session);
    acc[type].total += session.progress || 0;
    acc[type].count += 1;
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(outcomesByType).map(([type, data]) => ({
    therapyType: type,
    avgProgress: Math.round(data.total / data.count),
    sessionsCount: data.count,
    successRate: data.count > 0 ? Math.round((data.sessions.filter((s: any) => s.progress > 70).length / data.count) * 100) : 0,
  }));
}

// Calculate monthly growth metrics
export function calculateMonthlyGrowth(
  clients: any[], 
  sessions: any[]
): MonthlyGrowth[] {
  const monthlyData: Record<string, any> = {};

  // Process sessions by month
  sessions.forEach(session => {
    const date = new Date(session.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        completedSessions: 0,
        clientIds: new Set(),
      };
    }

    if (session.status === 'Completed') {
      monthlyData[monthKey].completedSessions += 1;
    }
    monthlyData[monthKey].clientIds.add(session.client_id);
  });

  // Process clients by creation month
  clients.forEach(client => {
    const date = new Date(client.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        completedSessions: 0,
        clientIds: new Set(),
      };
    }
  });

  return Object.values(monthlyData)
    .sort((a, b) => {
      const aDate = new Date(a.month);
      const bDate = new Date(b.month);
      return aDate.getTime() - bDate.getTime();
    })
    .map(data => ({
      month: data.month,
      activeClients: data.clientIds.size,
      completedSessions: data.completedSessions,
      newClients: 0, // Will be calculated by client creation date
    }));
}

// Calculate therapist performance
export function calculateTherapistPerformance(
  therapists: any[],
  clients: any[],
  sessions: any[]
): TherapistPerformance[] {
  const performanceMap: Record<string, any> = {};

  therapists.forEach(therapist => {
    performanceMap[therapist.id] = {
      therapistId: therapist.id,
      therapistName: therapist.full_name || therapist.email,
      clientsCount: 0,
      completedSessions: 0,
      totalClientProgress: 0,
      totalSessionProgress: 0,
      sessionCount: 0,
    };
  });

  // Count clients per therapist
  clients.forEach(client => {
    if (client.therapist_id && performanceMap[client.therapist_id]) {
      performanceMap[client.therapist_id].clientsCount += 1;
      performanceMap[client.therapist_id].totalClientProgress += client.progress || 0;
    }
  });

  // Count sessions per therapist
  sessions.forEach(session => {
    if (session.therapist_id && performanceMap[session.therapist_id]) {
      if (session.status === 'Completed') {
        performanceMap[session.therapist_id].completedSessions += 1;
      }
      performanceMap[session.therapist_id].totalSessionProgress += session.progress || 0;
      performanceMap[session.therapist_id].sessionCount += 1;
    }
  });

  return Object.values(performanceMap)
    .map(data => ({
      therapistId: data.therapistId,
      therapistName: data.therapistName,
      clientsCount: data.clientsCount,
      completedSessions: data.completedSessions,
      avgClientProgress: data.clientsCount > 0 ? Math.round(data.totalClientProgress / data.clientsCount) : 0,
      avgSessionProgress: data.sessionCount > 0 ? Math.round(data.totalSessionProgress / data.sessionCount) : 0,
    }))
    .sort((a, b) => b.completedSessions - a.completedSessions);
}

// Identify at-risk clients
export function identifyRiskClients(clients: any[]): ClientRisk[] {
  return clients
    .map(client => {
      const reasons: string[] = [];
      let riskLevel: 'high' | 'medium' | 'low' = 'low';

      // Check adherence
      if (client.adherence < 50) {
        reasons.push('Low adherence rate');
        riskLevel = 'high';
      } else if (client.adherence < 70) {
        reasons.push('Moderate adherence concerns');
        riskLevel = 'medium';
      }

      // Check progress
      if (client.progress < 30) {
        reasons.push('Minimal progress');
        riskLevel = 'high';
      } else if (client.progress < 50) {
        reasons.push('Below average progress');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Check status
      if (client.status === 'Inactive') {
        reasons.push('Inactive status');
        riskLevel = 'high';
      } else if (client.status === 'Active' && client.last_active === 'Never') {
        reasons.push('Never attended session');
        riskLevel = 'high';
      }

      // Check change (negative trend)
      if (client.change !== undefined && client.change < -3) {
        reasons.push('Declining progress trend');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      return {
        clientId: client.id,
        clientName: client.name,
        riskLevel,
        reasons,
        lastActive: client.last_active,
      };
    })
    .filter(c => c.riskLevel !== 'low')
    .sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });
}

// Comprehensive analytics calculation
export function calculateAllAnalytics(
  clients: any[],
  sessions: any[],
  devices: any[],
  therapists: any[]
): AnalyticsMetrics {
  return {
    clients: calculateClientStats(clients),
    sessions: calculateSessionStats(sessions),
    devices: calculateDeviceStats(devices),
    therapyOutcomes: calculateTherapyOutcomes(sessions),
    growthTrend: calculateMonthlyGrowth(clients, sessions),
    topTherapists: calculateTherapistPerformance(therapists, clients, sessions),
    clientRiskFactors: identifyRiskClients(clients),
  };
}

// Helper to format percentage values
export function formatPercentage(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

// Helper to calculate trend
export function calculateTrend(current: number, previous: number): { value: number; direction: 'up' | 'down' | 'stable' } {
  const diff = current - previous;
  return {
    value: Math.abs(diff),
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
  };
}
