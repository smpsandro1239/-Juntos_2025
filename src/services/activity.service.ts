import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';

// Fix: Add mock data for reviews and activities.
const MOCK_REVIEWS: Review[] = [
  { id: 1, activityId: 1, userName: 'Ana', rating: 5, comment: 'Incrível! As crianças adoraram.', date: '2024-07-20T10:00:00Z' },
  { id: 2, activityId: 1, userName: 'Carlos', rating: 4, comment: 'Muito bom, mas um pouco cheio.', date: '2024-07-19T14:30:00Z' },
  { id: 3, activityId: 2, userName: 'Beatriz', rating: 5, comment: 'Perfeito para um dia de sol. Super recomendo!', date: '2024-07-18T11:00:00Z' },
  { id: 4, activityId: 3, userName: 'Daniel', rating: 3, comment: 'Achei a comida cara, mas o ambiente é legal.', date: '2024-07-21T19:00:00Z' },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: 'Parque de Trampolins',
    description: 'Um parque gigante com camas elásticas, piscinas de espuma e muita diversão para todas as idades.',
    category: 'Indoor',
    price: 50,
    location: { lat: -23.5505, lng: -46.6333, address: 'Rua da Consolação, 247, São Paulo' },
    imageUrl: 'https://picsum.photos/seed/trampoline/600/400',
    rainyDayOk: true,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 1),
    rating: 4.5
  },
  {
    id: 2,
    name: 'Piquenique no Parque Ibirapuera',
    description: 'Aproveite um dia de sol com um delicioso piquenique nas áreas verdes do parque mais famoso de São Paulo.',
    category: 'Ar Livre',
    price: 0,
    location: { lat: -23.5885, lng: -46.6586, address: 'Av. Pedro Álvares Cabral, s/n - Vila Mariana, São Paulo' },
    imageUrl: 'https://picsum.photos/seed/park/600/400',
    rainyDayOk: false,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 2),
    rating: 5.0
  },
  {
    id: 3,
    name: 'Feira de Artesanato da Praça da República',
    description: 'Explore a tradicional feira de artesanato e comidas típicas que acontece todos os domingos.',
    category: 'Cultural',
    price: 0,
    location: { lat: -23.5428, lng: -46.6416, address: 'Praça da República, s/n - República, São Paulo' },
    imageUrl: 'https://picsum.photos/seed/market/600/400',
    rainyDayOk: false,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 3),
    rating: 3.0
  },
  {
    id: 4,
    name: 'Museu Catavento',
    description: 'Um museu de ciências interativo que fascina crianças e adultos com suas exposições sobre o universo, a vida e a engenharia.',
    category: 'Indoor',
    price: 15,
    location: { lat: -23.5413, lng: -46.6289, address: 'Av. Mercúrio, s/n - Parque Dom Pedro II, São Paulo' },
    imageUrl: 'https://picsum.photos/seed/museum/600/400',
    rainyDayOk: true,
    reviews: [],
    rating: 4.8
  },
    {
    id: 5,
    name: 'Cinema ao Ar Livre no Parque Villa-Lobos',
    description: 'Sessões de cinema gratuitas projetadas em uma tela gigante no gramado do parque. Leve sua canga e aproveite!',
    category: 'Ar Livre',
    price: 0,
    location: { lat: -23.5419, lng: -46.7265, address: 'Av. Prof. Fonseca Rodrigues, 2001 - Alto de Pinheiros, São Paulo' },
    imageUrl: 'https://picsum.photos/seed/cinema/600/400',
    rainyDayOk: false,
    reviews: [],
    rating: 4.9
  }
];


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities = signal<Activity[]>(MOCK_ACTIVITIES);

  selectedCategory = signal<string | null>(null);
  showOnlyFree = signal<boolean>(false);
  showRainyDayOk = signal<boolean>(false);

  uniqueCategories = computed(() => {
    const allActivities = this.activities();
    const categories = allActivities.map(a => a.category);
    return [...new Set(categories)];
  });

  filteredActivities = computed(() => {
    const allActivities = this.activities();
    const category = this.selectedCategory();
    const freeOnly = this.showOnlyFree();
    const rainy = this.showRainyDayOk();

    return allActivities.filter(activity => {
      const categoryMatch = !category || activity.category === category;
      const priceMatch = !freeOnly || activity.price === 0;
      const rainyMatch = !rainy || activity.rainyDayOk;
      return categoryMatch && priceMatch && rainyMatch;
    });
  });
  
  getActivityById(id: number) {
      return computed(() => this.activities().find(a => a.id === id));
  }

  addReview(review: Omit<Review, 'id' | 'date'>): void {
      this.activities.update(activities => {
          const activityIndex = activities.findIndex(a => a.id === review.activityId);
          if (activityIndex === -1) return activities;

          const newReview: Review = {
              ...review,
              id: Date.now(),
              date: new Date().toISOString()
          };

          const updatedActivities = [...activities];
          const activityToUpdate = { ...updatedActivities[activityIndex] };
          activityToUpdate.reviews = [...activityToUpdate.reviews, newReview];
          
          // Recalculate average rating
          const totalRating = activityToUpdate.reviews.reduce((sum, r) => sum + r.rating, 0);
          activityToUpdate.rating = totalRating / activityToUpdate.reviews.length;

          updatedActivities[activityIndex] = activityToUpdate;
          return updatedActivities;
      });
  }

  setCategoryFilter(category: string | null): void {
    this.selectedCategory.set(category);
  }

  toggleFreeFilter(): void {
    this.showOnlyFree.update(value => !value);
  }

  toggleRainyDayFilter(): void {
    this.showRainyDayOk.update(value => !value);
  }
}
