import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';
import { Event } from '../models/event.model';
import { Supplier } from '../models/supplier.model';

export interface ActivityFilters {
    searchTerm: string;
    category: string | null;
    minPrice: number;
    maxPrice: number;
    minRating: number;
}

const MOCK_REVIEWS: Review[] = [
    { id: 1, activityId: 1, userName: 'Ana Silva', rating: 5, comment: 'As crianças adoraram! Muito interactivo e educativo.', date: '2023-10-26T10:00:00Z' },
    { id: 2, activityId: 1, userName: 'Carlos Pereira', rating: 4, comment: 'Espaço fantástico, mas um pouco cheio ao fim de semana.', date: '2023-10-22T14:30:00Z' },
    { id: 3, activityId: 2, userName: 'Mariana Costa', rating: 5, comment: 'Perfeito para um piquenique em família. Muito bem cuidado.', date: '2023-09-15T12:00:00Z' },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: 'Oceanário de Lisboa',
    category: 'Aquário',
    description: 'Mergulhe num mundo de maravilhas aquáticas no Oceanário de Lisboa, um dos maiores aquários da Europa. Ideal para todas as idades, oferece uma visão inesquecível da vida marinha.',
    imageUrl: 'https://picsum.photos/seed/oceanario/400/300',
    price: 19,
    rating: 4.8,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 1),
    location: { lat: 38.7634, lng: -9.0936 },
    accessibility: { wheelchair: 'total', stroller: 'total' },
    galleryImages: ['https://picsum.photos/seed/oceanario-1/400/300', 'https://picsum.photos/seed/oceanario-2/400/300', 'https://picsum.photos/seed/oceanario-3/400/300']
  },
  {
    id: 2,
    name: 'Parque da Pena',
    category: 'Ar Livre',
    description: 'Explore os jardins românticos e trilhos exóticos do Parque da Pena em Sintra. Um cenário de conto de fadas com vistas deslumbrantes e natureza exuberante.',
    imageUrl: 'https://picsum.photos/seed/pena/400/300',
    price: 13.5,
    rating: 4.9,
    reviews: MOCK_REVIEWS.filter(r => r.activityId === 2),
    location: { lat: 38.7883, lng: -9.3905 },
    accessibility: { wheelchair: 'parcial', stroller: 'parcial' },
    galleryImages: ['https://picsum.photos/seed/pena-1/400/300', 'https://picsum.photos/seed/pena-2/400/300', 'https://picsum.photos/seed/pena-3/400/300']
  },
  {
    id: 3,
    name: 'Pavilhão do Conhecimento',
    category: 'Museu',
    description: 'Ciência e diversão andam de mãos dadas no Pavilhão do Conhecimento. Um museu interativo onde as crianças podem tocar, experimentar e aprender.',
    imageUrl: 'https://picsum.photos/seed/conhecimento/400/300',
    price: 11,
    rating: 4.7,
    reviews: [],
    location: { lat: 38.7625, lng: -9.0950 },
    accessibility: { wheelchair: 'total', stroller: 'total' },
    galleryImages: ['https://picsum.photos/seed/conhecimento-1/400/300', 'https://picsum.photos/seed/conhecimento-2/400/300', 'https://picsum.photos/seed/conhecimento-3/400/300']
  },
   {
    id: 4,
    name: 'Jardim Zoológico de Lisboa',
    category: 'Ar Livre',
    description: 'Um dia de aventura espera por si no Zoo de Lisboa! Descubra centenas de espécies de todo o mundo e assista a apresentações de golfinhos e leões-marinhos.',
    imageUrl: 'https://picsum.photos/seed/zoo/400/300',
    price: 22.5,
    rating: 4.6,
    reviews: [],
    location: { lat: 38.7450, lng: -9.1751 },
    accessibility: { wheelchair: 'total', stroller: 'total' },
    galleryImages: ['https://picsum.photos/seed/zoo-1/400/300', 'https://picsum.photos/seed/zoo-2/400/300', 'https://picsum.photos/seed/zoo-3/400/300']
  },
   {
    id: 5,
    name: 'KidZania Lisboa',
    category: 'Parque Temático',
    description: 'A cidade onde as crianças são as protagonistas! Na KidZania, os mais pequenos podem experimentar mais de 60 profissões diferentes num ambiente divertido e seguro.',
    imageUrl: 'https://picsum.photos/seed/kidzania/400/300',
    price: 24.5,
    rating: 4.5,
    reviews: [],
    location: { lat: 38.7562, lng: -9.1848 },
    accessibility: { wheelchair: 'total', stroller: 'total' },
    galleryImages: ['https://picsum.photos/seed/kidzania-1/400/300', 'https://picsum.photos/seed/kidzania-2/400/300', 'https://picsum.photos/seed/kidzania-3/400/300']
  },
  {
    id: 6,
    name: 'Passeio de Barco no Tejo',
    category: 'Ar Livre',
    description: 'Descubra Lisboa de uma perspetiva diferente com um relaxante passeio de barco no rio Tejo. Vistas únicas sobre os principais monumentos da cidade.',
    imageUrl: 'https://picsum.photos/seed/tejo/400/300',
    price: 0,
    rating: 4.8,
    reviews: [],
    location: { lat: 38.7078, lng: -9.1352 },
    accessibility: { wheelchair: 'nenhum', stroller: 'parcial' },
    galleryImages: ['https://picsum.photos/seed/tejo-1/400/300', 'https://picsum.photos/seed/tejo-2/400/300', 'https://picsum.photos/seed/tejo-3/400/300']
  }
];

const MOCK_EVENTS: Event[] = [
    { id: 1, name: 'Festival de Marionetas', description: 'Um fim de semana mágico com espetáculos de marionetas de todo o mundo.', imageUrl: 'https://picsum.photos/seed/marionetas/400/300', location: 'Jardim da Estrela, Lisboa', price: 0, startDate: '2024-09-14T00:00:00Z', endDate: '2024-09-15T00:00:00Z'},
    { id: 2, name: 'Noites de Verão no Castelo', description: 'Concertos e cinema ao ar livre nas muralhas do Castelo de S. Jorge.', imageUrl: 'https://picsum.photos/seed/castelo/400/300', location: 'Castelo de S. Jorge, Lisboa', price: 15, startDate: '2024-08-01T00:00:00Z', endDate: '2024-08-31T00:00:00Z'},
];

const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'Party Animators', category: 'Animação', description: 'Animadores profissionais para festas infantis, com jogos, pinturas faciais e modelagem de balões.', imageUrl: 'https://picsum.photos/seed/animators/400/300', rating: 4.9, contact: { phone: '912345678', email: 'party@animators.pt' }, location: 'Lisboa' },
    { id: 2, name: 'Catering Delícia', category: 'Catering', description: 'Menus deliciosos e saudáveis para festas de crianças e adultos. Opções temáticas disponíveis.', imageUrl: 'https://picsum.photos/seed/catering/400/300', rating: 4.7, contact: { phone: '923456789', email: 'info@delicia.pt', website: 'https://delicia.pt' }, location: 'Porto' },
    { id: 3, name: 'Quinta dos Sonhos', category: 'Espaços', description: 'Um espaço idílico no campo com piscina, parque infantil e animais da quinta. Perfeito para eventos inesquecíveis.', imageUrl: 'https://picsum.photos/seed/quinta/400/300', rating: 5.0, contact: { phone: '934567890', email: 'eventos@quinta-sonhos.com' }, location: 'Sintra' }
];

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private activities = signal<Activity[]>(MOCK_ACTIVITIES);
  private events = signal<Event[]>(MOCK_EVENTS);
  private suppliers = signal<Supplier[]>(MOCK_SUPPLIERS);

  private filters = signal<ActivityFilters>({
    searchTerm: '',
    category: null,
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
  });

  allActivities = this.activities.asReadonly();
  upcomingEvents = this.events.asReadonly();
  allSuppliers = this.suppliers.asReadonly();

  filteredActivities = computed(() => {
    const all = this.activities();
    const f = this.filters();
    
    return all.filter(activity => {
      const searchTermMatch = f.searchTerm ? activity.name.toLowerCase().includes(f.searchTerm.toLowerCase()) || activity.description.toLowerCase().includes(f.searchTerm.toLowerCase()) : true;
      const categoryMatch = f.category ? activity.category === f.category : true;
      const priceMatch = activity.price <= f.maxPrice;
      const ratingMatch = activity.rating >= f.minRating;
      return searchTermMatch && categoryMatch && priceMatch && ratingMatch;
    });
  });

  uniqueCategories = computed(() => {
      const categories = this.activities().map(a => a.category);
      return [...new Set(categories)];
  });

  constructor() {}

  getActivityById(id: number): Activity | undefined {
    return this.activities().find(a => a.id === id);
  }

  getEventById(id: number): Event | undefined {
    return this.events().find(e => e.id === id);
  }

  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers().find(s => s.id === id);
  }

  applyFilters(newFilters: ActivityFilters): void {
    this.filters.set(newFilters);
  }

  addReview(review: Review): void {
    this.activities.update(activities => {
      return activities.map(activity => {
        if (activity.id === review.activityId) {
          const updatedReviews = [...activity.reviews, review];
          const newRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
          return { ...activity, reviews: updatedReviews, rating: parseFloat(newRating.toFixed(1)) };
        }
        return activity;
      });
    });
  }
}
