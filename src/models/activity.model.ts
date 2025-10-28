export interface Activity {
  id: number;
  name: string;
  category: 'Cultura' | 'Ar Livre' | 'Comida' | 'Oficinas';
  description: string;
  imageUrl: string;
  gallery: string[];
  price: number;
  rating: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  accessibility: {
    wheelchair: 'Total' | 'Partial' | 'None';
    stroller: 'Total' | 'Partial' | 'None';
  };
}
