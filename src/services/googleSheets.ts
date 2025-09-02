// Mock Google Sheets service for demo
// In production, you would implement actual Google Sheets API integration

import { Wish } from '../types';

class GoogleSheetsService {
  private wishes: Wish[] = [
    {
      id: '1',
      text: 'Thank you for being an amazing teacher and inspiring us every day!',
      timestamp: new Date().toISOString(),
      approved: true,
    },
    {
      id: '2', 
      text: 'Your dedication and passion for teaching have made such a difference in our lives.',
      timestamp: new Date().toISOString(),
      approved: true,
    },
    {
      id: '3',
      text: 'Happy Teachers Day! You are the best mentor anyone could ask for.',
      timestamp: new Date().toISOString(),
      approved: true,
    },
  ];

  async getWishes(): Promise<Wish[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.wishes.filter(wish => wish.approved);
  }

  async addWish(text: string): Promise<Wish> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newWish: Wish = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      approved: true, // Auto-approve for demo
    };
    
    this.wishes.push(newWish);
    return newWish;
  }

  async updateWish(id: string, updates: Partial<Wish>): Promise<Wish | null> {
    const wishIndex = this.wishes.findIndex(w => w.id === id);
    if (wishIndex === -1) return null;
    
    this.wishes[wishIndex] = { ...this.wishes[wishIndex], ...updates };
    return this.wishes[wishIndex];
  }

  async deleteWish(id: string): Promise<boolean> {
    const initialLength = this.wishes.length;
    this.wishes = this.wishes.filter(w => w.id !== id);
    return this.wishes.length < initialLength;
  }
}

export const googleSheetsService = new GoogleSheetsService();