import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';

const MOCK_ACTIVITIES: Activity[] = [
    {
      id: 1,
      name: 'Explore Central Park',
      description: 'A beautiful and large urban park with many attractions, including a zoo, a carousel, and plenty of walking paths.',
      category: 'Outdoor',
      price: 0,
      location: { lat: 40.785091, lng: -73.968285, address: 'Central Park, New York, NY' },
      imageUrl: 'https://picsum.photos/seed/cpark/600/400',
      rainyDayOk: false,
      reviews: [
        { id: 1, activityId: 1, userName: 'Alice', rating: 5, comment: 'Absolutely stunning! So much to see.', date: new Date('2023-10-20').toISOString() },
        { id: 2, activityId: 1, userName: 'Bob', rating: 4, comment: 'Great for a long walk, but can get crowded.', date: new Date('2023-10-22').toISOString() },
      ],
      rating: 4.5
    },
    {
      id: 2,
      name: 'Metropolitan Museum of Art',
      description: 'One of the world\'s largest and finest art museums. It contains more than two million works of art.',
      category: 'Museum',
      price: 30,
      location: { lat: 40.779437, lng: -73.963244, address: '1000 5th Ave, New York, NY 10028' },
      imageUrl: 'https://picsum.photos/seed/met/600/400',
      rainyDayOk: true,
      reviews: [
        { id: 3, activityId: 2, userName: 'Charlie', rating: 5, comment: 'Could spend days here. The Egyptian exhibit is incredible.', date: new Date('2023-11-05').toISOString() },
      ],
      rating: 5
    },
    {
      id: 3,
      name: 'Walk the Brooklyn Bridge',
      description: 'A hybrid cable-stayed/suspension bridge in New York City, spanning the East River between Manhattan and Brooklyn.',
      category: 'Outdoor',
      price: 0,
      location: { lat: 40.706051, lng: -73.996864, address: 'Brooklyn Bridge, New York, NY 10038' },
      imageUrl: 'https://picsum.photos/seed/bbridge/600/400',
      rainyDayOk: false,
      reviews: [
         { id: 4, activityId: 3, userName: 'Diana', rating: 4, comment: 'Iconic views, but very windy!', date: new Date('2023-11-10').toISOString() },
         { id: 5, activityId: 3, userName: 'Eve', rating: 5, comment: 'Best to go early in the morning to avoid crowds.', date: new Date('2023-11-12').toISOString() }
      ],
      rating: 4.5
    },
    {
      id: 4,
      name: 'Intrepid Sea, Air & Space Museum',
      description: 'An American military and maritime history museum with a collection of museum ships.',
      category: 'Museum',
      price: 33,
      location: { lat: 40.764528, lng: -73.999645, address: 'Pier 86, W 46th St, New York, NY 10036' },
      imageUrl: 'https://picsum.photos/seed/intrepid/600/400',
      rainyDayOk: true,
      reviews: [],
      rating: 0
    },
    {
      id: 5,
      name: 'Katz\'s Delicatessen',
      description: 'A kosher-style delicatessen known for its pastrami on rye, which is considered among New York\'s best.',
      category: 'Food',
      price: 25, // Average meal cost
      location: { lat: 40.722237, lng: -73.987373, address: '205 E Houston St, New York, NY 10002' },
      imageUrl: 'https://picsum.photos/seed/katz/600/400',
      rainyDayOk: true,
      reviews: [
        { id: 6, activityId: 5, userName: 'Frank', rating: 5, comment: 'The pastrami sandwich is life-changing.', date: new Date('2023-09-15').toISOString() }
      ],
      rating: 5
    }
];

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities = signal<Activity[]>(MOCK_ACTIVITIES);
  allActivities = this.activities.asReadonly();

  selectedCategory = signal<string | null>(null);
  showOnlyFree = signal<boolean>(false);
  showRainyDayOk = signal<boolean>(false);

  uniqueCategories = computed(() => {
    const allCategories = this.allActivities().map(a => a.category);
    return [...new Set(allCategories)];
  });

  filteredActivities = computed(() => {
    return this.allActivities()
      .filter(activity => !this.selectedCategory() || activity.category === this.selectedCategory())
      .filter(activity => !this.showOnlyFree() || activity.price === 0)
      .filter(activity => !this.showRainyDayOk() || activity.rainyDayOk);
  });
  
  setCategoryFilter(category: string | null): void {
    this.selectedCategory.set(category);
  }
  
  toggleShowOnlyFree(): void {
    this.showOnlyFree.update(value => !value);
  }

  toggleShowRainyDayOk(): void {
    this.showRainyDayOk.update(value => !value);
  }

  addReview(activityId: number, review: Omit<Review, 'id' | 'activityId' | 'date'>): void {
    this.activities.update(activities => {
      const activityIndex = activities.findIndex(a => a.id === activityId);
      if (activityIndex === -1) return activities;

      const newReview: Review = {
        ...review,
        id: Date.now(),
        activityId: activityId,
        date: new Date().toISOString(),
      };
      
      const updatedActivity = { ...activities[activityIndex] };
      updatedActivity.reviews = [...updatedActivity.reviews, newReview];
      
      const totalRating = updatedActivity.reviews.reduce((sum, r) => sum + r.rating, 0);
      updatedActivity.rating = totalRating / updatedActivity.reviews.length;

      const newActivities = [...activities];
      newActivities[activityIndex] = updatedActivity;
      
      return newActivities;
    });
  }
}
