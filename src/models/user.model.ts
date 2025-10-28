import { Album } from './album.model';
import { Order } from './order.model';
import { PointTransaction } from './point-transaction.model';
import { ThematicSeries } from './thematic-series.model';
import { Mission } from './mission.model';

export interface User {
  id: number;
  name: string;
  email: string;
  isPremium: boolean;
  favorites: number[]; // activity IDs
  passport: {
    stampsCollected: number[]; // activity IDs
    thematicSeries: ThematicSeries[];
  };
  points: {
    balance: number;
    transactions: PointTransaction[];
  };
  albums: Album[];
  orders: Order[];
  missions: Mission[];
}
