import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입
export interface Story {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  content: string[];
  image_url?: string;
  image_mask?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Stamp {
  id: string;
  zone: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  qr_code?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}