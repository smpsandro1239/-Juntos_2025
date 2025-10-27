import { Review } from './review.model';

export interface UserImage {
  id: number;
  imageUrl: string;
  userName: string;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  rating: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  suitableForRainyDays: boolean;
  reviews?: Review[];
  userImages?: UserImage[];
}