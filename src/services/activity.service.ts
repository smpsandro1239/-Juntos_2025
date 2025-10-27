import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';

const MOCK_ACTIVITIES: Activity[] = [
    {
      id: 1,
      name: 'Oceanário de Lisboa',
      description: 'Um dos maiores e mais espetaculares aquários da Europa, com uma vasta coleção de espécies marinhas. Ideal para um dia em família.',
      category: 'Educação',
      price: 22,
      location: { lat: 38.7634, lng: -9.0936, address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa' },
      imageUrl: 'https://picsum.photos/seed/oceanario/600/400',
      rainyDayOk: true,
      reviews: [
        { id: 1, activityId: 1, userName: 'Ana Silva', rating: 5, comment: 'Absolutamente incrível! As crianças adoraram o aquário central.', date: new Date('2023-10-20').toISOString() },
        { id: 2, activityId: 1, userName: 'Bruno Costa', rating: 4, comment: 'Muito bom, mas pode ficar cheio ao fim de semana. Recomendo ir cedo.', date: new Date('2023-10-22').toISOString() },
      ],
      rating: 4.5
    },
    {
      id: 2,
      name: 'Jardim Zoológico de Lisboa',
      description: 'Um dia bem passado entre animais de todo o mundo. Inclui um teleférico com vistas fantásticas sobre o parque.',
      category: 'Ar Livre',
      price: 23,
      location: { lat: 38.7424, lng: -9.1744, address: 'Praça Marechal Humberto Delgado, 1549-004 Lisboa' },
      imageUrl: 'https://picsum.photos/seed/zoo/600/400',
      rainyDayOk: false,
      reviews: [
        { id: 3, activityId: 2, userName: 'Carla Dias', rating: 5, comment: 'O espetáculo dos golfinhos é imperdível. Um clássico que nunca falha!', date: new Date('2023-11-05').toISOString() },
      ],
      rating: 5
    },
    {
      id: 3,
      name: 'Passeio nos Jardins de Serralves',
      description: 'Explore os magníficos jardins da Fundação de Serralves, um oásis de tranquilidade e arte no coração do Porto.',
      category: 'Ar Livre',
      price: 0,
      location: { lat: 41.1594, lng: -8.6599, address: 'R. Dom João de Castro 210, 4150-417 Porto' },
      imageUrl: 'https://picsum.photos/seed/serralves/600/400',
      rainyDayOk: false,
      reviews: [
         { id: 4, activityId: 3, userName: 'Diana Moreira', rating: 4, comment: 'Lindo e relaxante, mas use calçado confortável!', date: new Date('2023-11-10').toISOString() },
         { id: 5, activityId: 3, userName: 'Eva Fernandes', rating: 5, comment: 'Perfeito para um piquenique em família. A Treetop Walk é fantástica.', date: new Date('2023-11-12').toISOString() }
      ],
      rating: 4.5
    },
    {
      id: 4,
      name: 'Pavilhão do Conhecimento',
      description: 'Um museu de ciência e tecnologia interativo onde é proibido não tocar. Perfeito para crianças curiosas.',
      category: 'Museu',
      price: 11,
      location: { lat: 38.7623, lng: -9.095, address: 'Largo José Mariano Gago 1, 1990-073 Lisboa' },
      imageUrl: 'https://picsum.photos/seed/pavconhecimento/600/400',
      rainyDayOk: true,
      reviews: [],
      rating: 0
    },
    {
      id: 5,
      name: 'Livraria Lello',
      description: 'Uma das mais belas livrarias do mundo, famosa pela sua escadaria icónica e ambiente mágico. Uma visita obrigatória no Porto.',
      category: 'Cultura',
      price: 8, // Voucher dedutível em livros
      location: { lat: 41.1469, lng: -8.6147, address: 'R. das Carmelitas 144, 4050-161 Porto' },
      imageUrl: 'https://picsum.photos/seed/lello/600/400',
      rainyDayOk: true,
      reviews: [
        { id: 6, activityId: 5, userName: 'Francisco Reis', rating: 5, comment: 'Parece que estamos dentro de um filme do Harry Potter. Mágico!', date: new Date('2023-09-15').toISOString() }
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
