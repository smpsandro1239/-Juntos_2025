import { Injectable, signal, computed } from '@angular/core';
import { Activity, UserImage } from '../models/activity.model';
import { Review } from '../models/review.model';

// MOCK DATA
const MOCK_REVIEWS: Review[] = [
  { id: 1, activityId: 1, userName: 'Ana', rating: 5, comment: 'As crianças adoraram! Muito interativo.', date: new Date('2024-05-10').toISOString() },
  { id: 2, activityId: 1, userName: 'Carlos', rating: 4, comment: 'Ótimo para uma tarde em família.', date: new Date('2024-05-12').toISOString() },
  { id: 3, activityId: 2, userName: 'Beatriz', rating: 5, comment: 'Uma experiência fantástica, os animais são muito bem tratados.', date: new Date('2024-04-20').toISOString() },
  { id: 4, activityId: 4, userName: 'Diogo', rating: 3, comment: 'Interessante, mas um pouco cheio no fim de semana.', date: new Date('2024-05-01').toISOString() },
];

const MOCK_USER_IMAGES: UserImage[] = [
    { id: 1, imageUrl: 'https://picsum.photos/seed/user1/400/300', userName: 'Ana' },
    { id: 2, imageUrl: 'https://picsum.photos/seed/user2/400/300', userName: 'Carlos' },
    { id: 3, imageUrl: 'https://picsum.photos/seed/user3/400/300', userName: 'Beatriz' },
]

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: 'Pavilhão do Conhecimento',
    description: 'Um museu de ciência interativo onde as crianças podem tocar e experimentar. Perfeito para mentes curiosas de todas as idades.',
    category: 'Museu',
    imageUrl: 'https://picsum.photos/seed/pavilion/400/300',
    price: 10,
    rating: 4.8,
    location: { lat: 38.7628, lng: -9.095, address: 'Largo José Mariano Gago 1, 1990-073 Lisboa' },
    suitableForRainyDays: true,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 1),
    userImages: MOCK_USER_IMAGES.slice(0, 2),
  },
  {
    id: 2,
    name: 'Jardim Zoológico de Lisboa',
    description: 'Um dia entre os animais! Veja golfinhos, leões, macacos e muito mais. Um clássico para toda a família.',
    category: 'Ar Livre',
    imageUrl: 'https://picsum.photos/seed/zoo/400/300',
    price: 22,
    rating: 4.6,
    location: { lat: 38.744, lng: -9.174, address: 'Praça Marechal Humberto Delgado, 1549-004 Lisboa' },
    suitableForRainyDays: false,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 2),
    userImages: [MOCK_USER_IMAGES[2]],
  },
  {
    id: 3,
    name: 'Oceanário de Lisboa',
    description: 'Mergulhe nas profundezas dos oceanos do mundo. Veja tubarões, raias e o famoso peixe-lua.',
    category: 'Aquário',
    imageUrl: 'https://picsum.photos/seed/oceanario/400/300',
    price: 19,
    rating: 4.9,
    location: { lat: 38.763, lng: -9.093, address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa' },
    suitableForRainyDays: true,
  },
  {
    id: 4,
    name: 'KidZania',
    description: 'Uma cidade à escala das crianças onde elas podem "trabalhar" em mais de 60 profissões diferentes.',
    category: 'Parque Temático',
    imageUrl: 'https://picsum.photos/seed/kidzania/400/300',
    price: 25,
    rating: 4.5,
    location: { lat: 38.755, lng: -9.189, address: 'Centro Comercial UBBO, Loja 1054, 2650-345 Amadora' },
    suitableForRainyDays: true,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 4),
  },
   {
    id: 5,
    name: 'Parque das Nações',
    description: 'Uma vasta área moderna para passear, andar de bicicleta, brincar nos parques infantis e apanhar o teleférico.',
    category: 'Ar Livre',
    imageUrl: 'https://picsum.photos/seed/parque/400/300',
    price: 0,
    rating: 4.7,
    location: { lat: 38.768, lng: -9.095, address: 'Parque das Nações, Lisboa' },
    suitableForRainyDays: false,
  },
  {
    id: 6,
    name: 'Quinta Pedagógica dos Olivais',
    description: 'Uma quinta no meio da cidade, com animais domésticos, hortas e atividades que ensinam as crianças sobre a vida no campo.',
    category: 'Ar Livre',
    imageUrl: 'https://picsum.photos/seed/quinta/400/300',
    price: 0,
    rating: 4.4,
    location: { lat: 38.775, lng: -9.123, address: 'R. Cidade de Lobito, 1800-088 Lisboa' },
    suitableForRainyDays: false,
  },
];

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities = signal<Activity[]>(MOCK_ACTIVITIES);
  private reviews = signal<Review[]>(MOCK_REVIEWS);

  // Filter signals
  selectedCategory = signal<string | null>(null);
  showOnlyFree = signal<boolean>(false);
  showRainyDayOk = signal<boolean>(false);

  // Computed signals for UI
  uniqueCategories = computed(() => {
    const allCategories = this.activities().map(a => a.category);
    return [...new Set(allCategories)];
  });

  filteredActivities = computed(() => {
    const category = this.selectedCategory();
    const freeOnly = this.showOnlyFree();
    const rainy = this.showRainyDayOk();

    return this.activities().filter(activity => {
      const categoryMatch = !category || activity.category === category;
      const priceMatch = !freeOnly || activity.price === 0;
      const rainyDayMatch = !rainy || activity.suitableForRainyDays;
      return categoryMatch && priceMatch && rainyDayMatch;
    });
  });

  // Public API
  setCategoryFilter(category: string | null): void {
    this.selectedCategory.set(category);
  }

  toggleShowOnlyFree(): void {
    this.showOnlyFree.update(value => !value);
  }

  toggleShowRainyDayOk(): void {
    this.showRainyDayOk.update(value => !value);
  }

  getActivityById(id: number): Activity | undefined {
    return this.activities().find(a => a.id === id);
  }

  getReviewsForActivity(activityId: number): Review[] {
    return this.reviews().filter(r => r.activityId === activityId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addReview(review: Omit<Review, 'id'>): void {
    const newId = Math.max(...this.reviews().map(r => r.id), 0) + 1;
    const newReview: Review = { ...review, id: newId };

    this.reviews.update(reviews => [...reviews, newReview]);

    this.activities.update(activities => {
        const activityIndex = activities.findIndex(a => a.id === review.activityId);
        if (activityIndex > -1) {
            const activity = activities[activityIndex];
            const currentReviews = [...(activity.reviews || []), newReview];
            const newRating = (currentReviews.reduce((acc, r) => acc + r.rating, 0)) / currentReviews.length;

            const updatedActivity = {
                ...activity,
                reviews: currentReviews,
                rating: newRating
            };

            const newActivities = [...activities];
            newActivities[activityIndex] = updatedActivity;
            return newActivities;
        }
        return activities;
    });
  }
  
  addUserImage(activityId: number, imageUrl: string, userName: string): void {
     this.activities.update(activities => {
        const activityIndex = activities.findIndex(a => a.id === activityId);
        if (activityIndex > -1) {
            const activity = activities[activityIndex];
            const newImageId = Math.max(...(activity.userImages || []).map(img => img.id), 0) + 1;
            const newImage: UserImage = { id: newImageId, imageUrl, userName };

            const updatedActivity = {
                ...activity,
                userImages: [...(activity.userImages || []), newImage],
            };

            const newActivities = [...activities];
            newActivities[activityIndex] = updatedActivity;
            return newActivities;
        }
        return activities;
    });
  }
}