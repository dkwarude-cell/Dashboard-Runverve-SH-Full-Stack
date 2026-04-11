import { useState, useEffect, useCallback } from 'react';
import type { Client, ClientInsert, ClientUpdate } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const MOCK_TOKEN = 'Bearer mock-token-dev';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/clients`, {
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const { data } = await response.json();
      // Backend returns { data: clients[], total, limit, offset }
      const raw = Array.isArray(data) ? data : (data?.data || []);
      const mapped = raw.map((c: any) => ({
        id: c.id,
        name: c.name || [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Unknown Client',
        email: c.email || '',
        phone: c.phone || c.emergency_contact_phone || '+1 (555) 000-0000',
        avatar_color: c.avatar_color || '#10b981',
        progress: c.total_sessions ? Math.round((c.completed_sessions / c.total_sessions) * 100) : 0,
        sessions: c.completed_sessions || 0,
        adherence: c.total_sessions ? Math.round((c.completed_sessions / c.total_sessions) * 100) : 0,
        last_active: c.last_session_date ? new Date(c.last_session_date).toLocaleDateString() : 'Never',
        change: c.risk_score ? Math.round(parseFloat(c.risk_score) * 2) : 0,
        status: 'Active',
        profile_type: c.diagnosis || 'General Profile',
        therapist_id: c.assigned_therapist_id || null,
        notes: c.medical_history || null,
      }));
      setClients(mapped as any);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching clients:', err);
      // Fallback to empty array to prevent UI crash
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (client: ClientInsert) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) throw new Error(`Failed to create: ${response.status}`);
      const { data } = await response.json();
      setClients((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating client:', err);
      throw err;
    }
  }, []);

  const updateClient = useCallback(async (id: string, updates: ClientUpdate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
      const { data } = await response.json();
      setClients((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err: any) {
      console.error('Error updating client:', err);
      throw err;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': MOCK_TOKEN,
        },
      });

      if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error('Error deleting client:', err);
      throw err;
    }
  }, []);

  const searchClients = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchClients();
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/clients?search=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': MOCK_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to search: ${response.status}`);
      const { data } = await response.json();
      // Backend returns { data: clients[], total, limit, offset }
      const raw = Array.isArray(data) ? data : (data?.data || []);
      const mapped = raw.map((c: any) => ({
        id: c.id,
        name: c.name || [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Unknown Client',
        email: c.email || '',
        phone: c.phone || c.emergency_contact_phone || '+1 (555) 000-0000',
        avatar_color: c.avatar_color || '#10b981',
        progress: c.total_sessions ? Math.round((c.completed_sessions / c.total_sessions) * 100) : 0,
        sessions: c.completed_sessions || 0,
        adherence: c.total_sessions ? Math.round((c.completed_sessions / c.total_sessions) * 100) : 0,
        last_active: c.last_session_date ? new Date(c.last_session_date).toLocaleDateString() : 'Never',
        change: c.risk_score ? Math.round(parseFloat(c.risk_score) * 2) : 0,
        status: 'Active',
        profile_type: c.diagnosis || 'General Profile',
        therapist_id: c.assigned_therapist_id || null,
        notes: c.medical_history || null,
      }));
      setClients(mapped as any);
    } catch (err: any) {
      console.error('Error searching clients:', err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'Active').length,
    inactive: clients.filter((c) => c.status === 'Inactive').length,
    avgProgress: clients.length
      ? Math.round(clients.reduce((sum, c) => sum + c.progress, 0) / clients.length)
      : 0,
  };

  return {
    clients,
    loading,
    error,
    stats,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
  };
}

