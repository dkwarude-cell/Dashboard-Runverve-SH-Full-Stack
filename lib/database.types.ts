export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'therapist' | 'support';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'therapist' | 'support';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'therapist' | 'support';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          avatar_color: string;
          progress: number;
          sessions: number;
          adherence: number;
          last_active: string;
          change: number;
          status: 'Active' | 'Inactive';
          profile_type: string;
          therapist_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          avatar_color?: string;
          progress?: number;
          sessions?: number;
          adherence?: number;
          last_active?: string;
          change?: number;
          status?: 'Active' | 'Inactive';
          profile_type?: string;
          therapist_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          avatar_color?: string;
          progress?: number;
          sessions?: number;
          adherence?: number;
          last_active?: string;
          change?: number;
          status?: 'Active' | 'Inactive';
          profile_type?: string;
          therapist_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          client_id: string;
          therapist_id: string;
          therapy_type: string;
          date: string;
          time: string;
          duration: string;
          status: 'Completed' | 'Scheduled' | 'Cancelled' | 'In Progress';
          progress: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          therapist_id: string;
          therapy_type: string;
          date: string;
          time: string;
          duration: string;
          status?: 'Completed' | 'Scheduled' | 'Cancelled' | 'In Progress';
          progress?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          therapist_id?: string;
          therapy_type?: string;
          date?: string;
          time?: string;
          duration?: string;
          status?: 'Completed' | 'Scheduled' | 'Cancelled' | 'In Progress';
          progress?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      queries: {
        Row: {
          id: string;
          title: string;
          description: string;
          client_id: string;
          assigned_to: string | null;
          priority: 'Critical' | 'High' | 'Medium' | 'Low';
          status: 'New' | 'Open' | 'In Progress' | 'Closed';
          support_id: string;
          device_info: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          client_id: string;
          assigned_to?: string | null;
          priority?: 'Critical' | 'High' | 'Medium' | 'Low';
          status?: 'New' | 'Open' | 'In Progress' | 'Closed';
          support_id?: string;
          device_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          client_id?: string;
          assigned_to?: string | null;
          priority?: 'Critical' | 'High' | 'Medium' | 'Low';
          status?: 'New' | 'Open' | 'In Progress' | 'Closed';
          support_id?: string;
          device_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      query_responses: {
        Row: {
          id: string;
          query_id: string;
          author: string;
          message: string;
          is_staff: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          query_id: string;
          author: string;
          message: string;
          is_staff?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          query_id?: string;
          author?: string;
          message?: string;
          is_staff?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      devices: {
        Row: {
          id: string;
          name: string;
          type: string;
          status: 'Connected' | 'Standby' | 'Offline';
          battery: number;
          signal: string;
          firmware: string;
          client_id: string | null;
          intensity_level: number;
          pulse_frequency: number;
          treatment_duration: number;
          pulse_width: number;
          temperature: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          status?: 'Connected' | 'Standby' | 'Offline';
          battery?: number;
          signal?: string;
          firmware?: string;
          client_id?: string | null;
          intensity_level?: number;
          pulse_frequency?: number;
          treatment_duration?: number;
          pulse_width?: number;
          temperature?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          status?: 'Connected' | 'Standby' | 'Offline';
          battery?: number;
          signal?: string;
          firmware?: string;
          client_id?: string | null;
          intensity_level?: number;
          pulse_frequency?: number;
          treatment_duration?: number;
          pulse_width?: number;
          temperature?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          metadata: Json | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          metadata?: Json | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          metadata?: Json | null;
          user_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_dashboard_stats: {
        Args: Record<string, never>;
        Returns: {
          total_clients: number;
          active_sessions: number;
          completion_rate: number;
          total_devices: number;
        }[];
      };
      get_monthly_sessions: {
        Args: { months_back: number };
        Returns: {
          month: string;
          scheduled: number;
          completed: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
