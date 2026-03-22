import { useState, useEffect, useCallback } from 'react';
import {
  type ClientStats,
  type SessionStats,
  type TherapyOutcomeStats,
  type TherapistPerformance,
  type ClientRisk,
} from '@/lib/analytics';

const API_BASE_URL = 'http://localhost:3000/api/v1';
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
          totalClients: data.clientStats.total,
          activeClients: data.clientStats.activeThisMonth,
          byProfileType: data.clientStats.byDiagnosis || {},
          atRiskPercentage: data.clientStats.atRiskPercentage || 0,
        });
      }

      // Set session stats
      if (data.sessionStats) {
        setSessionStats({
          totalSessions: data.sessionStats.total,
          completedSessions: data.sessionStats.completionRate,
          avgDuration: data.sessionStats.avgDuration,
          completionRate: data.sessionStats.completionRate,
        });
      }

      // Set therapy outcomes
      if (data.therapyOutcomes) {
        setTherapyOutcomes(
          Object.entries(data.therapyOutcomes.progressTrends || {}).map(([label, value]: any) => ({
            label,
            values: [{ value, color: '#10b981' }],
          }))
        );
      }

      // Set growth data (6-month trends)
      if (data.monthlyGrowth && Array.isArray(data.monthlyGrowth)) {
        setGrowthData(
          data.monthlyGrowth.map((month: any) => ({
            label: month.month,
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
      if (data.clientStats && data.clientStats.byDiagnosis) {
        const colors = ['#e84d6a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
        setClientDistribution(
          Object.entries(data.clientStats.byDiagnosis).map(([label, value]: any, i) => ({
            label,
            value,
            color: colors[i % colors.length],
          }))
        );
      }

      // Set session trends
      if (data.sessionStats && data.sessionStats.byStatus) {
        const colors = ['#e84d6a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
        setSessionTrends(
          Object.entries(data.sessionStats.byStatus).map(([label, value]: any, i) => ({
            label,
            values: [{ value, color: colors[i % colors.length], label }],
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
    // Chart data
    clientDistribution,
    sessionTrends,
    therapyOutcomes,
    growthData,
    
    // Calculated statistics
    clientStats,
    sessionStats,
    therapistPerformance,
    riskClients,
    
    // Loading and refreshtchAnalytics,
  };
}
