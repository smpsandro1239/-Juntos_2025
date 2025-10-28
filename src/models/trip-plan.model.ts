export interface TripPlanDay {
    day: number;
    title: string;
    activities: {
        time: string;
        description: string;
    }[];
}

export interface TripPlan {
    id: number;
    title: string;
    description: string; // The raw markdown from Gemini
    details: {
        duration: string;
        travelers: string;
        interests: string[];
    };
    days: TripPlanDay[]; // This would be populated by parsing the description
}
