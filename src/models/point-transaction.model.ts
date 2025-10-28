export interface PointTransaction {
    id: number;
    date: string; // ISO 8601
    description: string;
    points: number; // can be positive or negative
}
