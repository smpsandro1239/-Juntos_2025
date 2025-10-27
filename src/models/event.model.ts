export interface Event {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  price: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}
