import type { Database } from '@/lib/database.types';

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type Query = Database['public']['Tables']['queries']['Row'];
export type QueryResponse = Database['public']['Tables']['query_responses']['Row'];
export type Device = Database['public']['Tables']['devices']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];

// Insert types
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
export type QueryInsert = Database['public']['Tables']['queries']['Insert'];
export type QueryResponseInsert = Database['public']['Tables']['query_responses']['Insert'];
export type DeviceInsert = Database['public']['Tables']['devices']['Insert'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

// Update types
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type SessionUpdate = Database['public']['Tables']['sessions']['Update'];
export type QueryUpdate = Database['public']['Tables']['queries']['Update'];
export type DeviceUpdate = Database['public']['Tables']['devices']['Update'];

// Dashboard stats
export interface DashboardStats {
  total_clients: number;
  active_sessions: number;
  completion_rate: number;
  total_devices: number;
}

// Chart data types
export interface MonthlySessionData {
  month: string;
  scheduled: number;
  completed: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// Navigation
export type AppSection =
  | 'dashboard'
  | 'clients'
  | 'sessions'
  | 'analytics'
  | 'device'
  | 'communications'
  | 'queries'
  | 'company';

export interface NavItem {
  key: AppSection;
  label: string;
  icon: string;
  badge?: string;
}

// Communication
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface ContactUser {
  id: string;
  name: string;
  role: string;
  online: boolean;
  avatar_color: string;
  lastMessage?: string;
}
