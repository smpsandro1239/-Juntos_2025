export interface TripPlanDetails {
  destination: string;
  duration: string;
  travelers: string;
  interests: string[];
}

export interface TripPlanDay {
  day: number;
  title: string;
  activities: string; // Markdown formatted
}

export interface TripPlan {
  id: number;
  title: string;
  details: TripPlanDetails;
  plan: TripPlanDay[];
  isGenerating?: boolean; // Optional flag for UI state
}
