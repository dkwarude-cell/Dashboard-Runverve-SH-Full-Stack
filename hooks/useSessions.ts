import { useState, useEffect, useCallback } from 'react';
import type { Session, SessionInsert, SessionUpdate } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const MOCK_TOKEN = 'Bearer mock-token-dev';

export function useSessions() {
  const [allSessions, setAllSessions] = useState<Session[]>([]);
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
      
      const sessionsArray = Array.isArray(data) ? data : (data?.data || []);
      const mappedSessions = sessionsArray.map((s: any) => {
        let mappedStatus = 'Scheduled';
        if (s.status === 'completed' || s.status === 'Completed') mappedStatus = 'Completed';
        else if (s.status === 'cancelled' || s.status === 'no_show') mappedStatus = 'Cancelled';
        else if (s.status === 'in_progress') mappedStatus = 'In Progress';
        
        let dateStr = 'Unknown';
        let timeStr = 'Unknown';
        if (s.session_datetime) {
            const d = new Date(s.session_datetime);
            if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString();
                timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
        }

        const nameCode = ((s.client_first_name || 'A') + (s.client_last_name || '')).charCodeAt(0) || 65;
        
        return {
            ...s,
            status: mappedStatus,
            client_name: `${s.client_first_name || ''} ${s.client_last_name || ''}`.trim(),
            therapy_type: 'General Therapy',
            date: dateStr,
            time: timeStr,
            duration: `${s.duration_minutes || 60} min`,
            progress: (nameCode % 10) * 10, // Mock progress for priority 0-90
        };
      });
      setAllSessions(mappedSessions);
      setSessions(mappedSessions);
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
      
      const sessionsArray = Array.isArray(data) ? data : (data?.data || []);
      const mappedSessions = sessionsArray.map((s: any) => {
        let mappedStatus = 'Scheduled';
        if (s.status === 'completed' || s.status === 'Completed') mappedStatus = 'Completed';
        else if (s.status === 'cancelled' || s.status === 'no_show') mappedStatus = 'Cancelled';
        else if (s.status === 'in_progress') mappedStatus = 'In Progress';
        
        let dateStr = 'Unknown';
        let timeStr = 'Unknown';
        if (s.session_datetime) {
            const d = new Date(s.session_datetime);
            if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString();
                timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
        }

        const nameCode = ((s.client_first_name || 'A') + (s.client_last_name || '')).charCodeAt(0) || 65;
        
        return {
            ...s,
            status: mappedStatus,
            client_name: `${s.client_first_name || ''} ${s.client_last_name || ''}`.trim(),
            therapy_type: 'General Therapy',
            date: dateStr,
            time: timeStr,
            duration: `${s.duration_minutes || 60} min`,
            progress: (nameCode % 10) * 10, // Mock progress for priority 0-90
        };
      });
      setSessions(mappedSessions);
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
    total: allSessions.length,
    completed: allSessions.filter((s) => s.status === 'Completed').length,
    scheduled: allSessions.filter((s) => s.status === 'Scheduled').length,
    cancelled: allSessions.filter((s) => s.status === 'Cancelled').length,
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
