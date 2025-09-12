import { supabase } from './supabase-client';

export interface StoryItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  content: string[];
  image_url?: string;
  image_mask?: string;
  additional_images?: string[];
  category_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StampLocation {
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

export interface EventInfo {
  id: string;
  title: string;
  content: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}


// Story CRUD
export const storyAPI = {
  getAll: async (): Promise<StoryItem[]> => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('category_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<StoryItem | null> => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching story:', error);
      return null;
    }
    
    return data;
  },

  create: async (story: Omit<StoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<StoryItem> => {
    const { data, error } = await supabase
      .from('stories')
      .insert([story])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating story:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: string, updates: Partial<StoryItem>): Promise<StoryItem | null> => {
    const { data, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating story:', error);
      return null;
    }
    
    return data;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting story:', error);
      return false;
    }
    
    return true;
  }
};

// Event CRUD
export const eventAPI = {
  getAll: async (): Promise<EventItem[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<EventItem | null> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching event:', error);
      return null;
    }
    
    return data;
  },

  create: async (event: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): Promise<EventItem> => {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: string, updates: Partial<EventItem>): Promise<EventItem | null> => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event:', error);
      return null;
    }
    
    return data;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting event:', error);
      return false;
    }
    
    return true;
  }
};

// Stamp CRUD
export const stampAPI = {
  getAll: async (): Promise<StampLocation[]> => {
    const { data, error } = await supabase
      .from('stamps')
      .select('*')
      .order('zone', { ascending: true });
    
    if (error) {
      console.error('Error fetching stamps:', error);
      return [];
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<StampLocation | null> => {
    const { data, error } = await supabase
      .from('stamps')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching stamp:', error);
      return null;
    }
    
    return data;
  },

  create: async (stamp: Omit<StampLocation, 'id' | 'created_at' | 'updated_at'>): Promise<StampLocation> => {
    const { data, error } = await supabase
      .from('stamps')
      .insert([stamp])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating stamp:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: string, updates: Partial<StampLocation>): Promise<StampLocation | null> => {
    const { data, error } = await supabase
      .from('stamps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating stamp:', error);
      return null;
    }
    
    return data;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('stamps')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting stamp:', error);
      return false;
    }
    
    return true;
  }
};

// EventInfo CRUD
export const eventInfoAPI = {
  getAll: async (): Promise<EventInfo[]> => {
    const { data, error } = await supabase
      .from('event_info')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching event info:', error);
      return [];
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<EventInfo | null> => {
    const { data, error } = await supabase
      .from('event_info')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching event info:', error);
      return null;
    }
    
    return data;
  },

  create: async (info: Omit<EventInfo, 'id' | 'created_at' | 'updated_at'>): Promise<EventInfo> => {
    const { data, error } = await supabase
      .from('event_info')
      .insert([info])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event info:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: string, updates: Partial<EventInfo>): Promise<EventInfo> => {
    const { data, error } = await supabase
      .from('event_info')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event info:', error);
      throw error;
    }
    
    return data;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('event_info')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting event info:', error);
      return false;
    }
    
    return true;
  }
};

