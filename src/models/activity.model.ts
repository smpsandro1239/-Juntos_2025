import { Review } from './review.model';

export interface Activity {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  price: number;
  rating: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reviews: Review[];
}
