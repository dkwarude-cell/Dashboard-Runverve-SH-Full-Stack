import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats, MonthlySessionData } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const MOCK_TOKEN = 'Bearer mock-token-dev';

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
      // Fetch analytics from backend
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const { data } = await response.json();

      // Transform backend data to component format
      if (data.clientStats && data.sessionStats) {
        setStats({
          total_clients: data.clientStats.total,
          active_sessions: Math.round(
            data.sessionStats.total * (data.sessionStats.completionRate / 100)
          ),
          completion_rate: data.sessionStats.completionRate,
          total_devices: 0, // Backend doesn't track devices
        });
      }

      // Set monthly data from growth trends
      if (data.monthlyGrowth && Array.isArray(data.monthlyGrowth)) {
        setMonthlyData(
          data.monthlyGrowth.map((month: any) => ({
            month: month.month,
            sessions: month.totalSessions,
            completion_rate: month.completionRate,
          }))
        );
      }

      // Set recent clients (first 5 from clients list)
      if (data.clientStats) {
        const response2 = await fetch(`${API_BASE_URL}/clients?limit=5`, {
          headers: {
            'Authorization': MOCK_TOKEN,
            'Content-Type': 'application/json',
          },
        });
        if (response2.ok) {
          const json = await response2.json();
          // Backend returns { data: { data: clients[], total, limit, offset } }
          const result = json.data;
          const clientsArray = Array.isArray(result) ? result : (result?.data || []);
          setRecentClients(clientsArray);
        }
      }
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      // Fallback values already set in state
      setStats({
        total_clients: 0,
        active_sessions: 0,
        completion_rate: 0,
        total_devices: 0,
      });
    }
  }, []);

  const fetchMonthlyData = useCallback(async () => {
    try {
      // Already fetched in fetchDashboardStats, using monthlyGrowth data
    } catch (err: any) {
      console.error('Error fetching monthly data:', err);
    }
  }, []);

  const fetchRecentClients = useCallback(async () => {
    try {
      // Already fetched in fetchDashboardStats
    } catch (err: any) {
      console.error('Error fetching recent clients:', err);
    }
  }, []);

  const fetchTodaysSchedule = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions?status=Scheduled`, {
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        // Backend returns { data: { data: sessions[], total, limit, offset } }
        const result = json.data;
        const sessionsArray = Array.isArray(result) ? result : (result?.data || []);
        setTodaysSchedule((sessionsArray || []).slice(0, 5));
      }
    } catch (err: any) {
      console.error('Error fetching today schedule:', err);
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
