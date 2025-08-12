export interface Zone {
  id: string;
  name: string;
  description: string;
  image?: string;
  spots: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ZonePost {
  id: string;
  zoneId: string;
  title: string;
  content: string;
  author?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}