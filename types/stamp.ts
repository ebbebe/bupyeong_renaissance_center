export interface Stamp {
  id: string;
  spotId: string;
  userId?: string;
  visitedAt: Date;
  isCollected: boolean;
}

export interface StampCollection {
  userId?: string;
  stamps: Stamp[];
  totalSpots: number;
  collectedCount: number;
  completionRate: number;
}