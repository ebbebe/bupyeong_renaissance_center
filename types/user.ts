export interface User {
  id: string;
  name?: string;
  email?: string;
  visitedSpots: string[];
  stamps: string[];
  preferences?: UserPreferences;
  createdAt: Date;
  lastVisit: Date;
}

export interface UserPreferences {
  language: 'ko' | 'en' | 'zh' | 'ja';
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
}