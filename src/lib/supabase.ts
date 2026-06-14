import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mfgtttxiqucadfyugyff.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3R0dHhpcXVjYWRmeXVneWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjUzNDcsImV4cCI6MjA5NzAwMTM0N30.Td2Pth4aGefhCDodArCVF5QbXaAMoH08o1RSkY53wfg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы
export interface Profile {
  id: string;
  discord_id: string | null;
  username: string | null;
  avatar_url: string | null;
  role: 'user' | 'curator' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  title: string;
  status: 'open' | 'in_progress' | 'payment' | 'completed' | 'closed';
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  assigned_profile?: Profile;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string | null;
  is_system: boolean;
  payment_amount: number | null;
  payment_link: string | null;
  payment_status: 'pending' | 'paid' | 'cancelled' | null;
  created_at: string;
  profiles?: Profile;
}

export interface DiscordUser {
  id: string;
  email?: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
    provider_id?: string;
    custom_claims?: {
      global_name?: string;
    };
  };
}
