import { useState, useEffect, useCallback } from 'react';
import type { Client, ClientInsert, ClientUpdate } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api/v1';
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
      
      const clientsArray = Array.isArray(data) ? data : (data?.data || []);
      
      // Map backend client fields to frontend expected fields
      const mappedClients = clientsArray.map((c: any) => {
        const total = c.total_sessions || 1;
        const completed = c.completed_sessions || 0;
        const progress = Math.round((completed / total) * 100) || 0;
        
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
        const nameCode = (c.name || 'A').charCodeAt(0);
        const avatarColor = colors[nameCode % colors.length];
        
        let lastActiveStr = 'Unknown';
        if (c.last_session_date) {
            // Check if it's a timestamp or a date string
            const d = new Date(c.last_session_date);
            if (!isNaN(d.getTime())) {
                const diffTime = Math.abs(new Date().getTime() - d.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                lastActiveStr = diffDays === 0 ? 'Today' : `${diffDays} days ago`;
            }
        }
          
        return {
            ...c,
            progress: progress,
            sessions: completed,
            adherence: progress > 0 ? Math.min(100, progress + 5) : 0, // Mock adherence
            last_active: lastActiveStr,
            change: Math.floor((nameCode % 21)) - 10, // Mock change percentage deterministically
            status: c.status || 'Active',
            profile_type: c.diagnosis || 'General',
            avatar_color: avatarColor
        };
      });

      setClients(mappedClients);
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
      const clientsArray = Array.isArray(data) ? data : (data?.data || []);
      setClients(clientsArray);
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
