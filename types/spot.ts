export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Spot {
  id: string;
  zoneId: string;
  name: string;
  description: string;
  coordinates: Coordinates;
  address: string;
  image?: string;
  qrCode: string;
  visitCount?: number;
  createdAt: Date;
  updatedAt: Date;
}