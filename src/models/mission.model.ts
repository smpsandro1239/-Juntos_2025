export interface Mission {
    id: number;
    title: string;
    description: string;
    points: number; // reward
    isCompleted: boolean;
    activityId?: number; // Optional activity to complete the mission
}
