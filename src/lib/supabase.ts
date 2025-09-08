import { createClient } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from './supabase/client';

// Legacy client for backward compatibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// For client-side usage - use the new SSR client
export const supabase = createBrowserClient();

// Admin client for server-side operations (unchanged)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database types
export interface Booking {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_datetime: string;
  end_datetime: string;
  hours: number;
  lifeguards: number;
  service_type: string;
  custom_service?: string;
  remarks?: string;
  location?: string;
  amount: number;
  status: "pending" | "confirmed" | "paid" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  updated_at: string;
  viewed_by_admin: boolean;
  lifeguards_assigned?: string[];
}

export interface Lifeguard {
  id: string;
  name: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Booking, "id" | "created_at">>;
      };
      lifeguards: {
        Row: Lifeguard;
        Insert: Omit<Lifeguard, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Lifeguard, "id" | "created_at">>;
      };
    };
  };
}
