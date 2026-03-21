import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  calculateClientStats,
  calculateSessionStats,
  calculateTherapyOutcomes,
  calculateMonthlyGrowth,
  calculateTherapistPerformance,
  identifyRiskClients,
  type ClientStats,
  type SessionStats,
  type TherapyOutcomeStats,
  type TherapistPerformance,
  type ClientRisk,
} from '@/lib/analytics';

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

      // Fetch all required data
      const [
        { data: clientsData },
        { data: sessionsData },
        { data: therapistsData },
        { data: eventsData },
      ] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('sessions').select('*').order('created_at', { ascending: true }),
        supabase.from('profiles').select('*').eq('role', 'therapist'),
        supabase
          .from('analytics_events')
          .select('event_type, created_at')
          .in('event_type', ['login', 'signup'])
          .order('created_at', { ascending: true }),
      ]);

      const clients = clientsData || [];
      const sessions = sessionsData || [];
      const therapists = therapistsData || [];
      const events = eventsData || [];

      // Calculate all statistics using analytics library
      const stats = calculateClientStats(clients);
      const sessionStat = calculateSessionStats(sessions);
      const outcomes = calculateTherapyOutcomes(sessions);
      const monthlyGrowth = calculateMonthlyGrowth(clients, sessions);
      const therapistPerf = calculateTherapistPerformance(therapists, clients, sessions);
      const riskClientsList = identifyRiskClients(clients);

      // Set client distribution
      const colors = ['#e84d6a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      setClientDistribution(
        Object.entries(stats.byProfileType).map(([label, value], i) => ({
          label,
          value,
          color: colors[i % colors.length],
        }))
      );

      // Set session trends
      const monthlyMap: Record<string, { scheduled: number; completed: number }> = {};
      sessions.forEach((s) => {
        const month = new Date(s.created_at).toLocaleDateString('en', { month: 'short' });
        if (!monthlyMap[month]) monthlyMap[month] = { scheduled: 0, completed: 0 };
        if (s.status === 'Completed') monthlyMap[month].completed++;
        else monthlyMap[month].scheduled++;
      });
      setSessionTrends(
        Object.entries(monthlyMap).map(([month, data]) => ({
          label: month,
          values: [
            { value: data.scheduled, color: '#3b82f6', label: 'Scheduled' },
            { value: data.completed, color: '#10b981', label: 'Completed' },
          ],
        }))
      );

      // Set therapy outcomes
      setTherapyOutcomes(
        outcomes.map((outcome: TherapyOutcomeStats) => ({
          label: outcome.therapyType,
          values: [
            {
              value: outcome.avgProgress,
              color: '#10b981',
            },
          ],
        }))
      );

      // Set growth data
      const growthMap: Record<string, { logins: number; signups: number }> = {};
      events.forEach((e) => {
        const month = new Date(e.created_at).toLocaleDateString('en', { month: 'short' });
        if (!growthMap[month]) growthMap[month] = { logins: 0, signups: 0 };
        if (e.event_type === 'login') growthMap[month].logins++;
        else growthMap[month].signups++;
      });
      setGrowthData(
        Object.entries(growthMap).map(([month, data]) => ({
          label: month,
          values: [
            { value: data.logins, color: '#3b82f6', label: 'Logins' },
            { value: data.signups, color: '#10b981', label: 'Signups' },
          ],
        }))
      );

      // Set computed statistics
      setClientStats(stats);
      setSessionStats(sessionStat);
      setTherapistPerformance(therapistPerf);
      setRiskClients(riskClientsList);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
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
