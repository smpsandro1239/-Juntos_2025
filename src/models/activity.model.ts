import { Review } from './review.model';

export type AccessibilityLevel = 'total' | 'parcial' | 'nenhum';

export interface Activity {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
  reviews: Review[];
  location: {
    lat: number;
    lng: number;
  };
  accessibility: {
    wheelchair: AccessibilityLevel;
    stroller: AccessibilityLevel;
  };
  galleryImages: string[];
}
