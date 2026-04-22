
export type Page = 'landing' | 'login' | 'signup' | 'forgot-password' | 'studio' | 'shop' | 'results' | 'profile' | 'legal';

export interface User {
  id: string;
  email: string;
  isPro: boolean;
  credits: number;
  profilePicture?: string;
  tokenHistory?: {
    id: string;
    date: string;
    amount: number;
    cost: number;
  }[];
}

export interface DesignStyle {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
}

export interface DesignResult {
  id: string;
  style: string;
  imageUrl: string;
  analysis: {
    coreStyle: string;
    colorHarmony: string[];
    suitability: number;
    details: string;
    fineTuning?: {
      modernity: number;
      coziness: number;
      minimalism: number;
    };
  };
}
