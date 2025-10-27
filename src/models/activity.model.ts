import { Review } from './review.model';

export type AccessibilityLevel = 'total' | 'parcial' | 'nenhum';

export interface Activity {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  price: number;
  rating: number;
  rainyDayOk: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reviews: Review[];
  accessibility: {
    wheelchair: AccessibilityLevel;
    stroller: AccessibilityLevel;
  };
}