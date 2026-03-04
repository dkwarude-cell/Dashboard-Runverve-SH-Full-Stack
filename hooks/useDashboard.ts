import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { DashboardStats, MonthlySessionData } from '@/types';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_clients: 0,
    active_sessions: 0,
    completion_rate: 0,
    total_devices: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlySessionData[]>([]);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [todaysSchedule, setTodaysSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      // Fallback: compute stats manually
      try {
        const [clientsRes, sessionsRes, devicesRes] = await Promise.all([
          supabase.from('clients').select('id', { count: 'exact', head: true }),
          supabase.from('sessions').select('id, status'),
          supabase.from('devices').select('id', { count: 'exact', head: true }),
        ]);

        const allSessions = sessionsRes.data || [];
        const completed = allSessions.filter((s) => s.status === 'Completed').length;
        const active = allSessions.filter(
          (s) => s.status === 'Scheduled' || s.status === 'In Progress'
        ).length;

        setStats({
          total_clients: clientsRes.count || 0,
          active_sessions: active,
          completion_rate: allSessions.length
            ? Math.round((completed / allSessions.length) * 100 * 10) / 10
            : 0,
          total_devices: devicesRes.count || 0,
        });
      } catch (fallbackErr) {
        console.error('Fallback stats also failed:', fallbackErr);
      }
    }
  }, []);

  const fetchMonthlyData = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_monthly_sessions', {
        months_back: 7,
      });
      if (error) throw error;
      setMonthlyData(data || []);
    } catch (err: any) {
      console.error('Error fetching monthly data:', err);
    }
  }, []);

  const fetchRecentClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentClients(data || []);
    } catch (err: any) {
      console.error('Error fetching recent clients:', err);
    }
  }, []);

  const fetchTodaysSchedule = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('date', today)
        .eq('status', 'Scheduled')
        .order('time', { ascending: true })
        .limit(5);

      if (error) throw error;
      setTodaysSchedule(data || []);
    } catch (err: any) {
      console.error('Error fetching today\'s schedule:', err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchMonthlyData(),
        fetchRecentClients(),
        fetchTodaysSchedule(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, [fetchDashboardStats, fetchMonthlyData, fetchRecentClients, fetchTodaysSchedule]);

  return {
    stats,
    monthlyData,
    recentClients,
    todaysSchedule,
    loading,
    refresh: async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchMonthlyData(),
        fetchRecentClients(),
        fetchTodaysSchedule(),
      ]);
    },
  };
}
