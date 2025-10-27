import { Album } from './album.model';
import { Order } from './order.model';

export interface User {
  id: number;
  name: string;
  email: string;
  isPremium: boolean;
  visitedActivityIds: number[];
  albums: Album[];
  orders: Order[];
}
