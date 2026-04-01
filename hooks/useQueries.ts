import { useState, useCallback, useEffect } from 'react';
import type { Query, QueryResponse, QueryInsert, QueryResponseInsert, QueryUpdate } from '@/types';

// Dummy queries initially injected into the state
const DEMO_QUERIES: Query[] = [
  {
    id: '1', title: 'Device connectivity issue', description: 'SmartHeal Pro is not connecting to the mobile app via Bluetooth',
    client_id: 'c1', assigned_to: null, priority: 'High', status: 'In Progress',
    support_id: 'Q001', device_info: null, created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2', title: 'Treatment plan adjustment request', description: 'Client requesting modification to current therapy protocol',
    client_id: 'c2', assigned_to: null, priority: 'Medium', status: 'Open',
    support_id: 'Q002', device_info: null, created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3', title: 'Billing discrepancy', description: 'Client reports incorrect charge on latest invoice',
    client_id: 'c3', assigned_to: null, priority: 'Low', status: 'New',
    support_id: 'Q003', device_info: null, created_at: new Date(Date.now() - 10800000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '4', title: 'Device firmware update issue', description: 'Unable to update firmware on SmartHeal device ITT-03',
    client_id: 'c4', assigned_to: null, priority: 'Critical', status: 'Open',
    support_id: 'Q004', device_info: null, created_at: new Date(Date.now() - 14400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '5', title: 'Session data not syncing', description: 'Therapy session data not appearing in dashboard after completion',
    client_id: 'c5', assigned_to: null, priority: 'High', status: 'In Progress',
    support_id: 'Q005', device_info: null, created_at: new Date(Date.now() - 18000000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '6', title: 'Pain reduction protocol inquiry', description: 'Requesting information about advanced pain management protocols',
    client_id: 'c6', assigned_to: null, priority: 'Medium', status: 'Closed',
    support_id: 'Q006', device_info: null, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
];

export function useQueries() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [responses, setResponses] = useState<Record<string, QueryResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Only set queries if empty (so we don't wipe out local changes on refresh)
      setQueries((prev) => prev.length ? prev : [...DEMO_QUERIES]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResponses = useCallback(async (queryId: string) => {
    // Return empty for dummy
    setResponses((prev) => ({ ...prev, [queryId]: prev[queryId] || [] }));
  }, []);

  const createQuery = useCallback(async (query: QueryInsert) => {
    const newQuery: Query = {
      ...query,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: query.priority || 'Medium',
      status: query.status || 'New',
    } as Query;

    setQueries((prev) => [newQuery, ...prev]);
    return newQuery;
  }, []);

  const updateQuery = useCallback(async (id: string, updates: QueryUpdate) => {
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return { ...q, ...updates, updated_at: new Date().toISOString() } as Query;
        }
        return q;
      })
    );
  }, []);

  const addResponse = useCallback(async (response: QueryResponseInsert) => {
    const newResponse: QueryResponse = {
      ...response,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    } as QueryResponse;

    setResponses((prev) => ({
      ...prev,
      [response.query_id]: [...(prev[response.query_id] || []), newResponse],
    }));
    return newResponse;
  }, []);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  const stats = {
    total: queries.length,
    open: queries.filter((q) => q.status === 'Open' || q.status === 'New').length,
    inProgress: queries.filter((q) => q.status === 'In Progress').length,
    closed: queries.filter((q) => q.status === 'Closed' || q.status === 'Solved').length,
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
