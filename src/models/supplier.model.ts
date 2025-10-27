export interface Supplier {
  id: number;
  name: string;
  category: string; // e.g., 'Animação', 'Catering', 'Espaços'
  description: string;
  imageUrl: string;
  rating: number;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  location: string;
}
