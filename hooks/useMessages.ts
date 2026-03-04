import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Message, MessageInsert, Profile } from '@/types';

export function useMessages() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '')
        .order('full_name', { ascending: true });

      if (fetchError) throw fetchError;
      setContacts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchMessages = useCallback(async (contactId: string) => {
    if (!user?.id) return;
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages((prev) => ({ ...prev, [contactId]: data || [] }));

      // Mark as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', contactId)
        .eq('receiver_id', user.id)
        .eq('read', false);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    }
  }, [user?.id]);

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!user?.id) return;
    try {
      const message: MessageInsert = {
        sender_id: user.id,
        receiver_id: receiverId,
        content,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      setMessages((prev) => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), data],
      }));
      return data;
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchContacts();

      // Real-time subscription for messages
      subscriptionRef.current = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages((prev) => ({
              ...prev,
              [newMessage.sender_id]: [
                ...(prev[newMessage.sender_id] || []),
                newMessage,
              ],
            }));
          }
        )
        .subscribe();
    }

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [user?.id, fetchContacts]);

  return {
    contacts,
    messages,
    loading,
    error,
    fetchContacts,
    fetchMessages,
    sendMessage,
  };
}
