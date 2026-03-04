import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Query, QueryResponse, QueryInsert, QueryResponseInsert, QueryUpdate } from '@/types';

export function useQueries() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [responses, setResponses] = useState<Record<string, QueryResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setQueries(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching queries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResponses = useCallback(async (queryId: string) => {
    try {
      const { data, error } = await supabase
        .from('query_responses')
        .select('*')
        .eq('query_id', queryId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setResponses((prev) => ({ ...prev, [queryId]: data || [] }));
    } catch (err: any) {
      console.error('Error fetching responses:', err);
    }
  }, []);

  const createQuery = useCallback(async (query: QueryInsert) => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .insert(query)
        .select()
        .single();

      if (error) throw error;
      setQueries((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating query:', err);
      throw err;
    }
  }, []);

  const updateQuery = useCallback(async (id: string, updates: QueryUpdate) => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setQueries((prev) => prev.map((q) => (q.id === id ? data : q)));
      return data;
    } catch (err: any) {
      console.error('Error updating query:', err);
      throw err;
    }
  }, []);

  const addResponse = useCallback(async (response: QueryResponseInsert) => {
    try {
      const { data, error } = await supabase
        .from('query_responses')
        .insert(response)
        .select()
        .single();

      if (error) throw error;
      setResponses((prev) => ({
        ...prev,
        [response.query_id]: [...(prev[response.query_id] || []), data],
      }));
      return data;
    } catch (err: any) {
      console.error('Error adding response:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchQueries();

    const subscription = supabase
      .channel('queries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queries' }, () => {
        fetchQueries();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchQueries]);

  const stats = {
    total: queries.length,
    open: queries.filter((q) => q.status === 'Open' || q.status === 'New').length,
    inProgress: queries.filter((q) => q.status === 'In Progress').length,
    closed: queries.filter((q) => q.status === 'Closed').length,
  };

  return {
    queries,
    responses,
    loading,
    error,
    stats,
    fetchQueries,
    fetchResponses,
    createQuery,
    updateQuery,
    addResponse,
  };
}
