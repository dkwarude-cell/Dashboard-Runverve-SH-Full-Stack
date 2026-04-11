import { useState, useEffect, useCallback } from 'react';
import {
  type ClientStats,
  type SessionStats,
  type TherapyOutcomeStats,
  type TherapistPerformance,
  type ClientRisk,
} from '@/lib/analytics';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const MOCK_TOKEN = 'Bearer mock-token-dev';

export function useAnalytics() {
  const [clientDistribution, setClientDistribution] = useState<
    { label: string; value: number; color: string }[]
  >([]);
  const [sessionTrends, setSessionTrends] = useState<any[]>([]);
  const [therapyOutcomes, setTherapyOutcomes] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [therapistPerformance, setTherapistPerformance] = useState<TherapistPerformance[]>([]);
  const [riskClients, setRiskClients] = useState<ClientRisk[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch analytics from backend
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const { data } = await response.json();

      // Backend returns processed analytics data
      // Format for UI consumption
      
      // Set client stats from backend data
      if (data.clientStats) {
        setClientStats({
          total: data.clientStats.total || 0,
          active: data.clientStats.activeThisMonth || 0,
          inactive: data.clientStats.inactiveThisMonth || 0,
          avgProgress: 0,
          avgAdherence: 0,
          byProfileType: data.clientStats.byDiagnosis || {},
        } as any);
      }

      // Set session stats
      if (data.sessionStats) {
        setSessionStats({
          total: data.sessionStats.total || 0,
          completed: data.sessionStats.thisMonthSessions || 0,
          scheduled: 0,
          cancelled: 0,
          completionRate: parseFloat(data.sessionStats.completionRate) || 0,
        } as any);
      }

      // Set therapy outcomes
      if (data.therapyOutcomes && Array.isArray(data.therapyOutcomes.progressTrends)) {
        setTherapyOutcomes(
          data.therapyOutcomes.progressTrends.map((item: any) => ({
            label: item.category,
            values: [{ value: item.count, color: '#10b981' }],
          }))
        );
      }

      // Set growth data (6-month trends)
      if (data.monthlyGrowth && Array.isArray(data.monthlyGrowth.trend)) {
        setGrowthData(
          data.monthlyGrowth.trend.map((month: any) => ({
            label: month.label,
            values: [
              { value: month.newClientsAdded, color: '#10b981', label: 'New Clients' },
              { value: month.totalSessions, color: '#3b82f6', label: 'Sessions' },
            ],
          }))
        );
      }

      // Set therapist performance
      if (data.therapistPerformance && data.therapistPerformance.topTherapists) {
        setTherapistPerformance(
          data.therapistPerformance.topTherapists.map((therapist: any) => ({
            name: therapist.name,
            rating: therapist.rating,
            sessions: therapist.sessionsCompleted,
            capacityUsage: therapist.capacityUtilization,
          }))
        );
      }

      // Set at-risk clients
      if (data.riskAssessment && data.riskAssessment.atRiskClients) {
        setRiskClients(
          data.riskAssessment.atRiskClients.map((client: any) => ({
            id: client.id,
            name: client.name,
            riskLevel: client.riskScore,
            riskFactors: client.riskFactors,
          }))
        );
      }

      // Set client distribution (by diagnosis)
      if (data.clientStats && Array.isArray(data.clientStats.byDiagnosis)) {
        const colors = ['#e84d6a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
        setClientDistribution(
          data.clientStats.byDiagnosis.map((item: any, i: number) => ({
            label: item.diagnosis,
            value: item.count,
            color: colors[i % colors.length],
          }))
        );
      }

      // Set session trends
      if (data.sessionStats && Array.isArray(data.sessionStats.byStatus)) {
        const colors = ['#e84d6a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
        setSessionTrends(
          data.sessionStats.byStatus.map((item: any, i: number) => ({
            label: item.status,
            values: [{ value: item.count, color: colors[i % colors.length], label: item.status }],
          }))
        );
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      // Set default empty values on error
      setClientStats(null);
      setSessionStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    clientDistribution,
    sessionTrends,
    therapyOutcomes,
    growthData,
    clientStats: clientStats as any,
    sessionStats: sessionStats as any,
    therapistPerformance,
    riskClients,
    loading,
    refresh: fetchAnalytics,
  };
}

