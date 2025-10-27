export interface Review {
  id: number;
  activityId: number;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO 8601 format
}
