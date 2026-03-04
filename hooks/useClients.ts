import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Client, ClientInsert, ClientUpdate } from '@/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setClients(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (client: ClientInsert) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();

      if (error) throw error;
      setClients((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating client:', err);
      throw err;
    }
  }, []);

  const updateClient = useCallback(async (id: string, updates: ClientUpdate) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setClients((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err: any) {
      console.error('Error updating client:', err);
      throw err;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      console.error('Error searching clients:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  useEffect(() => {
    fetchClients();

    // Real-time subscription
    const subscription = supabase
      .channel('clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        fetchClients();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
