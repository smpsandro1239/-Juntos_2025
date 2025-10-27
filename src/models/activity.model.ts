import { Review } from './review.model';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number; // 0 for free
  location: Location;
  imageUrl: string;
  rainyDayOk: boolean;
  reviews: Review[];
  rating: number; // average rating
}
