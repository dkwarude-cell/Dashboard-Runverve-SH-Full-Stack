import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Device, DeviceUpdate } from '@/types';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('devices')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setDevices(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDevice = useCallback(async (id: string, updates: DeviceUpdate) => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDevices((prev) => prev.map((d) => (d.id === id ? data : d)));
      return data;
    } catch (err: any) {
      console.error('Error updating device:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDevices();

    const subscription = supabase
      .channel('devices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        fetchDevices();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchDevices]);

  const stats = {
    total: devices.length,
    connected: devices.filter((d) => d.status === 'Connected').length,
    standby: devices.filter((d) => d.status === 'Standby').length,
    offline: devices.filter((d) => d.status === 'Offline').length,
  };

  return {
    devices,
    loading,
    error,
    stats,
    fetchDevices,
    updateDevice,
  };
}
