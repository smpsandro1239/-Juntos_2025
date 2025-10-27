export interface Activity {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  distance: number;
  price: string;
  ageRange: string;
  tags: string[];
  isFavorite: boolean;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
}
