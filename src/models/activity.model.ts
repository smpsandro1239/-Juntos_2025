
export interface Activity {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  price: number;
  rating: number; // 1-5
  location: {
    lat: number;
    lng: number;
  };
  isSustainable: boolean;
  accessibility: {
    wheelchair: string;
    stroller: string;
  };
}
