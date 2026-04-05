import { useState, useEffect, useCallback } from 'react';
import type { Session, SessionInsert, SessionUpdate } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const MOCK_TOKEN = 'Bearer mock-token-dev';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const { data } = await response.json();
      // Backend returns { data: sessions[], total, limit, offset }
      const sessionsArray = Array.isArray(data) ? data : (data?.data || []);
      setSessions(sessionsArray);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (session: SessionInsert) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) throw new Error(`Failed to create: ${response.status}`);
      const { data } = await response.json();
      setSessions((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating session:', err);
      throw err;
    }
  }, []);

  const updateSession = useCallback(async (id: string, updates: SessionUpdate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
      const { data } = await response.json();
      setSessions((prev) => prev.map((s) => (s.id === id ? data : s)));
      return data;
    } catch (err: any) {
      console.error('Error updating session:', err);
      throw err;
    }
  }, []);

  const filterSessions = useCallback(async (status: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== 'All') {
        params.append('status', status);
      }

      const response = await fetch(`${API_BASE_URL}/sessions${params.toString() ? '?' + params : ''}`, {
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to filter: ${response.status}`);
      const { data } = await response.json();
      // Backend returns { data: sessions[], total, limit, offset }
      const sessionsArray = Array.isArray(data) ? data : (data?.data || []);
      setSessions(sessionsArray);
    } catch (err: any) {
      console.error('Error filtering sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const stats = {
    total: sessions.length,
    completed: sessions.filter((s) => s.status === 'Completed').length,
    scheduled: sessions.filter((s) => s.status === 'Scheduled').length,
    cancelled: sessions.filter((s) => s.status === 'Cancelled').length,
  };

  return {
    sessions,
    loading,
    error,
    stats,
    fetchSessions,
    createSession,
    updateSession,
    filterSessions,
  };
}
