import { Injectable, signal, computed } from '@angular/core';
import { Activity, UserImage } from '../models/activity.model';
import { Review } from '../models/review.model';
import { Event } from '../models/event.model';

const MOCK_REVIEWS: Review[] = [
    { id: 1, activityId: 1, userName: 'Ana Silva', rating: 5, comment: 'As crianças adoraram! Muito interactivo e educativo.', date: '2024-05-10T10:00:00Z' },
    { id: 2, activityId: 1, userName: 'Carlos Santos', rating: 4, comment: 'Espaço excelente, mas um pouco cheio ao fim-de-semana.', date: '2024-05-11T14:30:00Z' },
    { id: 3, activityId: 2, userName: 'Sofia Costa', rating: 5, comment: 'Um oásis no meio da cidade. Perfeito para um piquenique em família.', date: '2024-04-20T12:00:00Z' },
    { id: 4, activityId: 3, userName: 'Miguel Pereira', rating: 5, comment: 'Incrível! Vimos tubarões e raias bem de perto. A não perder.', date: '2024-05-01T16:00:00Z' },
    { id: 5, activityId: 4, userName: 'Beatriz Almeida', rating: 3, comment: 'Divertido, mas as filas para as diversões maiores são muito longas.', date: '2024-03-15T13:00:00Z' },
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: 1, name: 'Pavilhão do Conhecimento', description: 'Um museu de ciência interativo onde é proibido não tocar. Perfeito para mentes curiosas de todas as idades.', category: 'Museu', imageUrl: 'https://picsum.photos/seed/pavilhaoconhecimento/400/300', price: 10, rating: 4.8, location: { lat: 38.7626, lng: -9.0953, address: 'Parque das Nações, Lisboa' }, suitableForRainyDays: true, userImages: [{id: 1, imageUrl: 'https://picsum.photos/seed/user1/400/300', userName: 'Ana S.'}]},
  { id: 2, name: 'Jardim da Estrela', description: 'Um jardim romântico com lagos, quiosques e um parque infantil que faz as delícias dos mais pequenos.', category: 'Ar Livre', imageUrl: 'https://picsum.photos/seed/jardimestrela/400/300', price: 0, rating: 4.6, location: { lat: 38.7153, lng: -9.1597, address: 'Praça da Estrela, Lisboa' }, suitableForRainyDays: false },
  { id: 3, name: 'Oceanário de Lisboa', description: 'Mergulhe nos oceanos do mundo e descubra milhares de criaturas marinhas. Uma experiência inesquecível.', category: 'Aquário', imageUrl: 'https://picsum.photos/seed/oceanario/400/300', price: 19, rating: 4.9, location: { lat: 38.7635, lng: -9.0938, address: 'Parque das Nações, Lisboa' }, suitableForRainyDays: true, userImages: [{id: 2, imageUrl: 'https://picsum.photos/seed/user2/400/300', userName: 'Miguel P.'}]},
  { id: 4, name: 'Parque da Serafina', description: 'Um parque com matas, circuito de manutenção e um parque infantil com baloiços e escorregas. Ótimo para gastar energias.', category: 'Ar Livre', imageUrl: 'https://picsum.photos/seed/serafina/400/300', price: 0, rating: 4.3, location: { lat: 38.7369, lng: -9.1769, address: 'Parque Florestal de Monsanto, Lisboa' }, suitableForRainyDays: false },
  { id: 5, name: 'World of Discoveries', description: 'Museu interativo e parque temático que recria a odisseia dos navegadores portugueses.', category: 'Museu', imageUrl: 'https://picsum.photos/seed/worldofdiscoveries/400/300', price: 15, rating: 4.5, location: { lat: 41.1413, lng: -8.618, address: 'Rua de Miragaia, Porto' }, suitableForRainyDays: true },
];

const MOCK_EVENTS: Event[] = [
    {
      id: 1,
      name: 'Festival Panda 2024',
      description: 'O maior festival infantil de Portugal está de volta com muita música, dança e as tuas personagens favoritas do Canal Panda!',
      imageUrl: 'https://picsum.photos/seed/event1/600/400',
      location: 'Estádio Nacional, Oeiras',
      price: 25,
      startDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 11)).toISOString(),
    },
    {
      id: 2,
      name: 'Workshop de Robótica para Crianças',
      description: 'Aprende a construir e programar o teu próprio robô numa tarde divertida e educativa.',
      imageUrl: 'https://picsum.photos/seed/event2/600/400',
      location: 'Pavilhão do Conhecimento, Lisboa',
      price: 15,
      startDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
    },
    {
      id: 3,
      name: 'Teatro: O Principezinho',
      description: 'Uma adaptação mágica do clássico de Antoine de Saint-Exupéry para toda a família.',
      imageUrl: 'https://picsum.photos/seed/event3/600/400',
      location: 'Teatro da Trindade, Lisboa',
      price: 12,
      startDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    }
];


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private allActivities = signal<Activity[]>(MOCK_ACTIVITIES);
  private allReviews = signal<Review[]>(MOCK_REVIEWS);
  private allEvents = signal<Event[]>(MOCK_EVENTS);

  // Filter signals
  selectedCategory = signal<string | null>(null);
  showOnlyFree = signal<boolean>(false);
  showRainyDayOk = signal<boolean>(false);

  // Computed signals
  uniqueCategories = computed(() => [...new Set(this.allActivities().map(a => a.category))]);

  filteredActivities = computed(() => {
    return this.allActivities()
      .map(activity => ({
        ...activity,
        reviews: this.allReviews().filter(r => r.activityId === activity.id)
      }))
      .filter(activity => {
        const categoryMatch = !this.selectedCategory() || activity.category === this.selectedCategory();
        const freeMatch = !this.showOnlyFree() || activity.price === 0;
        const rainyDayMatch = !this.showRainyDayOk() || activity.suitableForRainyDays;
        return categoryMatch && freeMatch && rainyDayMatch;
      });
  });

  upcomingEvents = computed(() => {
    const now = new Date();
    return this.allEvents()
      .filter(event => new Date(event.endDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  });

  // Methods to update filters
  setCategoryFilter(category: string | null): void {
    this.selectedCategory.set(category);
  }

  toggleShowOnlyFree(): void {
    this.showOnlyFree.update(value => !value);
  }

  toggleShowRainyDayOk(): void {
    this.showRainyDayOk.update(value => !value);
  }

  // Methods to get data
  getActivityById(id: number): Activity | undefined {
    return this.allActivities().find(a => a.id === id);
  }

  getEventById(id: number): Event | undefined {
    return this.allEvents().find(event => event.id === id);
  }

  getReviewsForActivity(activityId: number): Review[] {
    return this.allReviews().filter(r => r.activityId === activityId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addReview(review: Omit<Review, 'id'>): void {
    const newReview = { ...review, id: Date.now() }; // Simple unique ID
    this.allReviews.update(reviews => [...reviews, newReview]);
  }
  
  addUserImage(activityId: number, imageUrl: string, userName: string): void {
      this.allActivities.update(activities => {
          return activities.map(activity => {
              if (activity.id === activityId) {
                  const newUserImage: UserImage = { id: Date.now(), imageUrl, userName };
                  const userImages = activity.userImages ? [...activity.userImages, newUserImage] : [newUserImage];
                  return { ...activity, userImages };
              }
              return activity;
          });
      });
  }
}
