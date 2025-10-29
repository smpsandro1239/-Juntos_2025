export type AccessibilityLevel = 'Total' | 'Parcial' | 'Nenhum';

export interface Activity {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  price: number;
  rating: number; // 1 to 5
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  accessibility: {
    wheelchair: AccessibilityLevel;
    stroller: AccessibilityLevel;
  };
  isSustainable?: boolean;
  rainyDayOk?: boolean;
}
