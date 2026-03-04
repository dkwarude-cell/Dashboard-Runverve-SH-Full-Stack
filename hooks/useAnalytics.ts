import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useAnalytics() {
  const [clientDistribution, setClientDistribution] = useState<
    { label: string; value: number; color: string }[]
  >([]);
  const [sessionTrends, setSessionTrends] = useState<any[]>([]);
  const [therapyOutcomes, setTherapyOutcomes] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      // Client profile distribution
      const { data: clients } = await supabase
        .from('clients')
        .select('profile_type');

      if (clients) {
        const distribution: Record<string, number> = {};
        clients.forEach((c) => {
          distribution[c.profile_type] = (distribution[c.profile_type] || 0) + 1;
        });
        const colors = ['#e84d6a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
        setClientDistribution(
          Object.entries(distribution).map(([label, value], i) => ({
            label,
            value,
            color: colors[i % colors.length],
          }))
        );
      }

      // Session trends by month
      const { data: sessions } = await supabase
        .from('sessions')
        .select('created_at, status')
        .order('created_at', { ascending: true });

      if (sessions) {
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
      }

      // Therapy outcomes by type
      const { data: outcomeData } = await supabase
        .from('sessions')
        .select('therapy_type, progress, status')
        .eq('status', 'Completed');

      if (outcomeData) {
        const outcomeMap: Record<string, { total: number; count: number }> = {};
        outcomeData.forEach((s) => {
          if (!outcomeMap[s.therapy_type]) outcomeMap[s.therapy_type] = { total: 0, count: 0 };
          outcomeMap[s.therapy_type].total += s.progress;
          outcomeMap[s.therapy_type].count++;
        });
        setTherapyOutcomes(
          Object.entries(outcomeMap).map(([type, data]) => ({
            label: type,
            values: [
              {
                value: Math.round(data.total / data.count),
                color: '#10b981',
              },
            ],
          }))
        );
      }

      // Growth data from analytics events
      const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type, created_at')
        .in('event_type', ['login', 'signup'])
        .order('created_at', { ascending: true });

      if (events) {
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
      }
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
    therapyOutcomes,
    growthData,
    loading,
    refresh: fetchAnalytics,
  };
}
