import { Injectable, signal, computed } from '@angular/core';
import { Activity, UserImage } from '../models/activity.model';
import { Review } from '../models/review.model';
import { Event } from '../models/event.model';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities = signal<Activity[]>([
    { id: 1, name: 'Oceanário de Lisboa', description: 'Explore a diversidade da vida marinha num dos maiores aquários da Europa.', category: 'Aquário', imageUrl: 'https://picsum.photos/seed/oceanario/400/300', price: 19, rating: 4.8, location: { lat: 38.7634, lng: -9.0936, address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa' }, suitableForRainyDays: true, reviews: [], userImages: [] },
    { id: 2, name: 'Jardim Zoológico de Lisboa', description: 'Um dia em cheio a conhecer animais de todo o mundo.', category: 'Ar Livre', imageUrl: 'https://picsum.photos/seed/zoo/400/300', price: 22, rating: 4.5, location: { lat: 38.744, lng: -9.172, address: 'Praça Marechal Humberto Delgado, 1549-004 Lisboa' }, suitableForRainyDays: false, reviews: [], userImages: [] },
    { id: 3, name: 'Pavilhão do Conhecimento', description: 'Ciência e tecnologia de forma interativa e divertida para todas as idades.', category: 'Museu', imageUrl: 'https://picsum.photos/seed/pavilhao/400/300', price: 10, rating: 4.7, location: { lat: 38.762, lng: -9.095, address: 'Largo José Mariano Gago nº1, 1990-073 Lisboa' }, suitableForRainyDays: true, reviews: [], userImages: [] },
    { id: 4, name: 'Parque da Pena', description: 'Passeio pelos jardins exóticos do Palácio da Pena em Sintra.', category: 'Ar Livre', imageUrl: 'https://picsum.photos/seed/pena/400/300', price: 0, rating: 4.9, location: { lat: 38.788, lng: -9.390, address: 'Estrada da Pena, 2710-609 Sintra' }, suitableForRainyDays: false, reviews: [], userImages: [] },
    { id: 5, name: 'KidZania Lisboa', description: 'Uma cidade à escala das crianças, onde podem "trabalhar" em mais de 60 profissões.', category: 'Parque Temático', imageUrl: 'https://picsum.photos/seed/kidzania/400/300', price: 25, rating: 4.6, location: { lat: 38.756, lng: -9.183, address: 'Centro Comercial UBBO, Loja 1054, 2650-305 Amadora' }, suitableForRainyDays: true, reviews: [], userImages: [] },
    { id: 6, name: 'Museu Nacional de História Natural e da Ciência', description: 'Descubra a história natural e a ciência através de coleções impressionantes.', category: 'Museu', imageUrl: 'https://picsum.photos/seed/mnhnc/400/300', price: 6, rating: 4.4, location: { lat: 38.718, lng: -9.151, address: 'R. da Escola Politécnica 58, 1250-102 Lisboa' }, suitableForRainyDays: true, reviews: [], userImages: [] },
  ]);

  private reviews = signal<Review[]>([
    { id: 1, activityId: 1, userName: 'Ana Silva', rating: 5, comment: 'Fantástico! Os miúdos adoraram os pinguins.', date: '2023-10-22T10:00:00Z' },
    { id: 2, activityId: 1, userName: 'Carlos Santos', rating: 4, comment: 'Muito bonito, mas um pouco cheio ao fim de semana.', date: '2023-10-20T14:30:00Z' },
    { id: 3, activityId: 3, userName: 'Joana Ferreira', rating: 5, comment: 'Super interativo, recomendo a 100% para famílias.', date: '2023-09-15T11:00:00Z' },
  ]);

  private events = signal<Event[]>([
    { id: 1, name: 'Festival de Marionetas', description: 'Um festival mágico com espetáculos de marionetas de todo o mundo.', imageUrl: 'https://picsum.photos/seed/marionetas/400/200', location: 'Jardim da Estrela, Lisboa', price: 0, startDate: '2024-09-01T10:00:00Z', endDate: '2024-09-03T18:00:00Z' },
    { id: 2, name: 'Workshop de Ciência Divertida', description: 'As crianças transformam-se em cientistas por um dia com experiências explosivas!', imageUrl: 'https://picsum.photos/seed/workshop/400/200', location: 'Pavilhão do Conhecimento, Lisboa', price: 15, startDate: '2024-09-15T15:00:00Z', endDate: '2024-09-15T17:00:00Z' },
  ]);

  private suppliers = signal<Supplier[]>([
    { id: 1, name: 'Festa Mágica Animações', category: 'Animação', description: 'Animadores, palhaços, mágicos e insufláveis para a festa perfeita.', imageUrl: 'https://picsum.photos/seed/animacao/400/300', rating: 4.9, contact: { phone: '912345678', email: 'contacto@festamagica.pt', website: 'https://example.com' }, location: 'Lisboa' },
    { id: 2, name: 'Doces da Avó', category: 'Catering', description: 'Bolos de aniversário personalizados, cupcakes, e todo o tipo de doces.', imageUrl: 'https://picsum.photos/seed/catering/400/300', rating: 4.8, contact: { phone: '923456789', email: 'encomendas@docesdaavo.pt' }, location: 'Porto' },
    { id: 3, name: 'Quinta das Brincadeiras', category: 'Espaços', description: 'Um espaço amplo com jardim, parque infantil e sala interior para festas.', imageUrl: 'https://picsum.photos/seed/espaco/400/300', rating: 4.7, contact: { phone: '934567890', email: 'reservas@quintadasbrincadeiras.pt', website: 'https://example.com' }, location: 'Sintra' },
  ]);

  // Filters for Activities
  selectedCategory = signal<string | null>(null);
  showOnlyFree = signal<boolean>(false);
  showRainyDayOk = signal<boolean>(false);

  uniqueCategories = computed(() => {
    const categories = this.activities().map(a => a.category);
    return [...new Set(categories)];
  });

  filteredActivities = computed(() => {
    const activitiesWithReviews = this.activities().map(activity => {
      const reviews = this.getReviewsForActivity(activity.id);
      const rating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : activity.rating;
      return { ...activity, reviews, rating };
    });
    
    return activitiesWithReviews
      .filter(activity => this.selectedCategory() ? activity.category === this.selectedCategory() : true)
      .filter(activity => this.showOnlyFree() ? activity.price === 0 : true)
      .filter(activity => this.showRainyDayOk() ? activity.suitableForRainyDays : true);
  });

  upcomingEvents = computed(() => {
    const now = new Date();
    return this.events()
      .filter(event => new Date(event.endDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  });

  allSuppliers = this.suppliers.asReadonly();

  // Methods
  getActivityById(id: number): Activity | undefined {
    return this.filteredActivities().find(a => a.id === id);
  }

  getEventById(id: number): Event | undefined {
    return this.events().find(e => e.id === id);
  }

  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers().find(s => s.id === id);
  }
  
  getReviewsForActivity(activityId: number): Review[] {
    return this.reviews()
      .filter(r => r.activityId === activityId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addReview(review: Omit<Review, 'id'>): void {
    const newId = Math.max(...this.reviews().map(r => r.id), 0) + 1;
    const newReview: Review = { ...review, id: newId };
    
    this.reviews.update(reviews => [...reviews, newReview]);
  }

  addUserImage(activityId: number, imageUrl: string, userName: string): void {
     this.activities.update(activities => {
      const activityIndex = activities.findIndex(a => a.id === activityId);
      if (activityIndex > -1) {
        const activity = activities[activityIndex];
        const userImages = activity.userImages || [];
        const newImage: UserImage = {
          id: Date.now(),
          imageUrl,
          userName,
        };
        const updatedActivity = { ...activity, userImages: [...userImages, newImage] };
        return activities.map(a => a.id === activityId ? updatedActivity : a);
      }
      return activities;
    });
  }

  // Filter setters
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
