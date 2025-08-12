import { Stamp, StampCollection } from '@/types/stamp';
import { APP_CONFIG } from '@/lib/constants/config';

export class StampStorage {
  private static instance: StampStorage;
  private storageKey = APP_CONFIG.storageKeys.stamps;

  private constructor() {}

  static getInstance(): StampStorage {
    if (!StampStorage.instance) {
      StampStorage.instance = new StampStorage();
    }
    return StampStorage.instance;
  }

  getStamps(): Stamp[] {
    if (typeof window === 'undefined') return [];
    const stamps = localStorage.getItem(this.storageKey);
    return stamps ? JSON.parse(stamps) : [];
  }

  addStamp(stamp: Stamp): void {
    const stamps = this.getStamps();
    const exists = stamps.some(s => s.spotId === stamp.spotId);
    
    if (!exists) {
      stamps.push(stamp);
      localStorage.setItem(this.storageKey, JSON.stringify(stamps));
    }
  }

  removeStamp(spotId: string): void {
    const stamps = this.getStamps();
    const filtered = stamps.filter(s => s.spotId !== spotId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  getStampCollection(totalSpots: number): StampCollection {
    const stamps = this.getStamps();
    return {
      stamps,
      totalSpots,
      collectedCount: stamps.length,
      completionRate: (stamps.length / totalSpots) * 100,
    };
  }

  clearStamps(): void {
    localStorage.removeItem(this.storageKey);
  }
}