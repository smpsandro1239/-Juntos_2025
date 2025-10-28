import { Album } from './album.model';
import { Mission } from './mission.model';
import { Order } from './order.model';
import { PointTransaction } from './point-transaction.model';
import { ThematicSeries } from './thematic-series.model';
import { TripPlan } from './trip-plan.model';

export interface User {
  id: number;
  name: string;
  email: string;
  isPremium: boolean;
  favorites: number[]; // Array of activity IDs
  points: {
    balance: number;
    transactions: PointTransaction[];
  };
  missions: Mission[];
  passport: {
    stampsCollected: number[]; // Array of stamp IDs (which are activity IDs)
    thematicSeries: ThematicSeries[];
  };
  albums: Album[];
  orders: Order[];
  savedPlans: TripPlan[];
}
