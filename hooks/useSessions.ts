import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, SessionInsert, SessionUpdate } from '@/types';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setSessions(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (session: SessionInsert) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      setSessions((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating session:', err);
      throw err;
    }
  }, []);

  const updateSession = useCallback(async (id: string, updates: SessionUpdate) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
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
      let query = supabase.from('sessions').select('*').order('date', { ascending: false });

      if (status !== 'All') {
        query = query.eq('status', status as 'Completed' | 'Scheduled' | 'Cancelled' | 'In Progress');
      }

      const { data, error } = await query;
      if (error) throw error;
      setSessions(data || []);
    } catch (err: any) {
      console.error('Error filtering sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();

    const subscription = supabase
      .channel('sessions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, () => {
        fetchSessions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
