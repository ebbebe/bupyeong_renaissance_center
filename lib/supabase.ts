import { supabase } from './supabase-client';

export interface StoryItem {
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

// localStorage keys for migration
const STORAGE_KEYS = {
  STORIES: 'bupyeong_stories',
  EVENTS: 'bupyeong_events',
  STAMPS: 'bupyeong_stamps'
};

// Story CRUD
export const storyAPI = {
  getAll: async (): Promise<StoryItem[]> => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('order_index', { ascending: true });
    
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

// Migration function to transfer localStorage data to Supabase
export const migrateLocalStorageToSupabase = async () => {
  if (typeof window === 'undefined') return;
  
  let migrationResults = {
    stories: { migrated: 0, errors: 0 },
    events: { migrated: 0, errors: 0 },
    stamps: { migrated: 0, errors: 0 }
  };

  // Migrate stories
  const storiesData = localStorage.getItem(STORAGE_KEYS.STORIES);
  if (storiesData) {
    try {
      const stories = JSON.parse(storiesData);
      for (const story of stories) {
        try {
          // Check if story already exists
          const existing = await storyAPI.getById(story.id);
          if (!existing) {
            await supabase.from('stories').insert([story]);
            migrationResults.stories.migrated++;
          }
        } catch (e) {
          console.error('Error migrating story:', e);
          migrationResults.stories.errors++;
        }
      }
      // Clear localStorage after successful migration
      if (migrationResults.stories.errors === 0) {
        localStorage.removeItem(STORAGE_KEYS.STORIES);
      }
    } catch (e) {
      console.error('Error parsing stories from localStorage:', e);
    }
  }

  // Migrate events
  const eventsData = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (eventsData) {
    try {
      const events = JSON.parse(eventsData);
      for (const event of events) {
        try {
          // Check if event already exists
          const existing = await eventAPI.getById(event.id);
          if (!existing) {
            await supabase.from('events').insert([event]);
            migrationResults.events.migrated++;
          }
        } catch (e) {
          console.error('Error migrating event:', e);
          migrationResults.events.errors++;
        }
      }
      // Clear localStorage after successful migration
      if (migrationResults.events.errors === 0) {
        localStorage.removeItem(STORAGE_KEYS.EVENTS);
      }
    } catch (e) {
      console.error('Error parsing events from localStorage:', e);
    }
  }

  // Migrate stamps
  const stampsData = localStorage.getItem(STORAGE_KEYS.STAMPS);
  if (stampsData) {
    try {
      const stamps = JSON.parse(stampsData);
      for (const stamp of stamps) {
        try {
          // Check if stamp already exists
          const existing = await stampAPI.getById(stamp.id);
          if (!existing) {
            await supabase.from('stamps').insert([stamp]);
            migrationResults.stamps.migrated++;
          }
        } catch (e) {
          console.error('Error migrating stamp:', e);
          migrationResults.stamps.errors++;
        }
      }
      // Clear localStorage after successful migration
      if (migrationResults.stamps.errors === 0) {
        localStorage.removeItem(STORAGE_KEYS.STAMPS);
      }
    } catch (e) {
      console.error('Error parsing stamps from localStorage:', e);
    }
  }

  return migrationResults;
};

// Default data functions (for initial setup)
export const insertDefaultData = async () => {
  // Check if data already exists
  const existingStories = await storyAPI.getAll();
  const existingEvents = await eventAPI.getAll();
  
  // Insert default story if no stories exist
  if (existingStories.length === 0) {
    await storyAPI.create({
      category: "A ZONE",
      title: "문화의 거리와 역사",
      subtitle: "상인이 만든 거리, 지켜가는 문화",
      content: [
        "'문화의거리'라는 개념은 1990년부터 한국 사회에 도입되었으며, 이는 초대 문화부 장관인 이어령이 지역의 문화 환경을 개선하기 위한 정책으로 각 지방자치단체에 문화의 거리 조성을 권장한 데에서 비롯되었다. 이후 각 지자체는 문화행사나 축제 개최, 지역 문화시설 조성 등을 통해 지역 경제 활성화를 도모했으나, 대부분의 문화의 거리는 지역 고유의 특색이나 정체성을 반영하지 못하고 조형물 설치나 일회성 행사 위주의 전시행정에 머무는 한계를 보였다.",
        "이와는 다르게 '부평문화의거리'는 행정기관 주도가 아닌, 변화의 필요성을 절실히 느낀 지역 상인들의 자발적인 참여로 시작되었다. 상인들은 행정의 무관심과 노점상 반발, 시민들의 의구심 속에서도 거리의 변화를 주도했고, 갈등과 협력을 거치며 '우리가 거리의 주인'이라는 공동체 의식을 형성하게 되었다. 부평문화의 거리는 단순한 공간 조성보다 그 과정을 통해 지역 정체성과 차별성을 획득한 사례로 평가된다.",
        "한편, 부평문화의거리는 1955년부터 상권이 형성되기 시작했으며, 1996년 건물주와 세입자들이 '문화의거리 발전추진위원회'를 조직하면서 본격적인 거리 조성 사업이 시작되었다. 1998년에는 차 없는 상가 거리로 재탄생하였고, 2000년대부터는 길거리 공연장과 프리마켓이 열리는 문화 공간으로 발전하였다.",
        "거리 내 일부 구역은 과거 '커튼골목'이라 불리던 곳이었으나, 2016년 이후 젊은 세대를 겨냥한 상점들이 입점하면서 '평리단길'로 새롭게 불리게 되었다. 이는 서울 경리단길 상권에서 차용한 이름으로, 현재는 카페, 디저트숍, 와인바 등이 모여 젊은 감성의 상권으로 변화하고 있다."
      ],
      image_url: "/images/culture_street.png",
      image_mask: "/images/culture_mask.svg",
      order_index: 1
    });
  }
  
  // Insert default event if no events exist
  if (existingEvents.length === 0) {
    await eventAPI.create({
      title: "부평 여름 축제",
      description: "시원한 여름을 즐기는 부평의 대표 축제",
      date: "2024-07-15",
      time: "18:00",
      location: "부평문화의거리",
      image_url: "/images/summer_festival.png",
      is_active: true
    });
  }
};