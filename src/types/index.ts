export interface Wish {
  id: string;
  text: string;
  timestamp: string;
  approved?: boolean;
}

export interface AppSettings {
  wishLimit: number;
  backgroundImages: string[];
  isLimitReached: boolean;
}