import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';
import { Event } from '../models/event.model';
import { Supplier } from '../models/supplier.model';

export interface ActivityFilters {
  searchTerm: string;
  category: 'Cultura' | 'Ar Livre' | 'Comida' | 'Oficinas' | null;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: 'Oceanário de Lisboa',
    category: 'Cultura',
    description: 'Explore a incrível diversidade da vida marinha no Oceanário de Lisboa, um dos maiores aquários da Europa.',
    imageUrl: 'https://picsum.photos/seed/oceanario/400/300',
    gallery: ['https://picsum.photos/seed/oceanario1/400/300', 'https://picsum.photos/seed/oceanario2/400/300', 'https://picsum.photos/seed/oceanario3/400/300', 'https://picsum.photos/seed/oceanario4/400/300'],
    price: 19,
    rating: 4.8,
    location: { address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa', lat: 38.7634, lng: -9.0945 },
    accessibility: { wheelchair: 'Total', stroller: 'Total' }
  },
  {
    id: 2,
    name: 'Passeio de Elétrico 28',
    category: 'Cultura',
    description: 'Viaje no tempo a bordo do icónico elétrico 28 e descubra os bairros históricos de Lisboa.',
    imageUrl: 'https://picsum.photos/seed/eletrico28/400/300',
    gallery: ['https://picsum.photos/seed/eletrico1/400/300', 'https://picsum.photos/seed/eletrico2/400/300', 'https://picsum.photos/seed/eletrico3/400/300', 'https://picsum.photos/seed/eletrico4/400/300'],
    price: 3,
    rating: 4.5,
    location: { address: 'Praça Martim Moniz, Lisboa', lat: 38.7163, lng: -9.1368 },
    accessibility: { wheelchair: 'None', stroller: 'Partial' },
    isSustainable: true
  },
  {
    id: 3,
    name: 'Aula de Culinária: Pastel de Nata',
    category: 'Comida',
    description: 'Aprenda a fazer o famoso Pastel de Nata com um chef pasteleiro profissional.',
    imageUrl: 'https://picsum.photos/seed/pastel/400/300',
    gallery: ['https://picsum.photos/seed/pastel1/400/300', 'https://picsum.photos/seed/pastel2/400/300', 'https://picsum.photos/seed/pastel3/400/300', 'https://picsum.photos/seed/pastel4/400/300'],
    price: 50,
    rating: 4.9,
    location: { address: 'Rua de Belém 84-92, 1300-085 Lisboa', lat: 38.6976, lng: -9.2033 },
    accessibility: { wheelchair: 'Partial', stroller: 'Total' }
  },
  {
    id: 4,
    name: 'Piquenique no Jardim da Estrela',
    category: 'Ar Livre',
    description: 'Desfrute de um piquenique relaxante num dos jardins mais charmosos de Lisboa, com um cesto cheio de iguarias locais.',
    imageUrl: 'https://picsum.photos/seed/jardim/400/300',
    gallery: ['https://picsum.photos/seed/jardim1/400/300', 'https://picsum.photos/seed/jardim2/400/300', 'https://picsum.photos/seed/jardim3/400/300', 'https://picsum.photos/seed/jardim4/400/300'],
    price: 35,
    rating: 4.6,
    location: { address: 'Praça da Estrela, 1200-667 Lisboa', lat: 38.7153, lng: -9.1594 },
    accessibility: { wheelchair: 'Total', stroller: 'Total' },
    isSustainable: true
  },
  {
    id: 5,
    name: 'Oficina de Azulejos',
    category: 'Oficinas',
    description: 'Crie o seu próprio azulejo tradicional português numa oficina de artesanato.',
    imageUrl: 'https://picsum.photos/seed/azulejo/400/300',
    gallery: ['https://picsum.photos/seed/azulejo1/400/300', 'https://picsum.photos/seed/azulejo2/400/300', 'https://picsum.photos/seed/azulejo3/400/300', 'https://picsum.photos/seed/azulejo4/400/300'],
    price: 40,
    rating: 4.7,
    location: { address: 'Rua das Janelas Verdes 70, 1200-691 Lisboa', lat: 38.7056, lng: -9.1558 },
    accessibility: { wheelchair: 'Partial', stroller: 'Partial' }
  },
  {
    id: 6,
    name: 'Passeio de Barco no Tejo ao Pôr do Sol',
    category: 'Ar Livre',
    description: 'Navegue pelo rio Tejo e admire as vistas deslumbrantes de Lisboa enquanto o sol se põe.',
    imageUrl: 'https://picsum.photos/seed/barco/400/300',
    gallery: ['https://picsum.photos/seed/barco1/400/300', 'https://picsum.photos/seed/barco2/400/300', 'https://picsum.photos/seed/barco3/400/300', 'https://picsum.photos/seed/barco4/400/300'],
    price: 45,
    rating: 4.9,
    location: { address: 'Doca do Bom Sucesso, 1400-038 Lisboa', lat: 38.6946, lng: -9.2081 },
    accessibility: { wheelchair: 'None', stroller: 'None' }
  }
];

const MOCK_REVIEWS: Review[] = [
    { id: 1, activityId: 1, userName: 'Maria Costa', rating: 5, comment: 'Uma experiência fantástica para toda a família! Os meus filhos adoraram.', date: '2024-07-20T10:00:00Z' },
    { id: 2, activityId: 1, userName: 'João Pereira', rating: 4, comment: 'Muito bem organizado, mas um pouco cheio ao fim de semana.', date: '2024-07-18T15:30:00Z' },
    { id: 3, activityId: 3, userName: 'Sofia Martins', rating: 5, comment: 'A aula foi super divertida e os pastéis de nata ficaram deliciosos!', date: '2024-07-19T11:00:00Z' },
    { id: 4, activityId: 4, userName: 'Carlos Rodrigues', rating: 5, comment: 'Cesto de piquenique maravilhoso e o jardim é lindo. Recomendo!', date: '2024-07-21T13:00:00Z' }
];

const MOCK_EVENTS: Event[] = [
    { 
      id: 1, 
      name: 'Festival de Verão Juntos', 
      description: 'Um festival de música e comida para toda a família com artistas nacionais e internacionais.',
      imageUrl: 'https://picsum.photos/seed/festival/320/180', 
      location: 'Parque das Nações', 
      price: 25, 
      startDate: '2024-08-15T10:00:00Z', 
      endDate: '2024-08-17T23:00:00Z' 
    },
    { 
      id: 2, 
      name: 'Cinema ao Ar Livre no Parque', 
      description: 'Sessões de cinema ao ar livre com clássicos para toda a família.',
      imageUrl: 'https://picsum.photos/seed/cinema/320/180', 
      location: 'Jardim da Estrela', 
      price: 0, 
      startDate: '2024-08-20T21:00:00Z', 
      endDate: '2024-08-20T23:00:00Z' 
    },
    { 
      id: 3, 
      name: 'Feira do Livro Infantil', 
      description: 'Descubra novos mundos na feira do livro dedicada aos mais pequenos.',
      imageUrl: 'https://picsum.photos/seed/livro/320/180', 
      location: 'Praça do Comércio', 
      price: 0, 
      startDate: '2024-09-01T10:00:00Z', 
      endDate: '2024-09-05T20:00:00Z'
    }
];

const MOCK_SUPPLIERS: Supplier[] = [
    {
        id: 1,
        name: 'Party Animators',
        category: 'Animação',
        description: 'Especialistas em animação para festas de aniversário infantis. Pinturas faciais, modelagem de balões, jogos e muito mais!',
        imageUrl: 'https://picsum.photos/seed/party/400/300',
        rating: 4.8,
        contact: { phone: '912345678', email: 'geral@partyanimators.pt', whatsapp: '351912345678', website: 'https://partyanimators.pt' },
        location: 'Lisboa'
    },
    {
        id: 2,
        name: 'Bolos & Doces da Avó',
        category: 'Catering',
        description: 'Bolos de aniversário personalizados, cupcakes, e todo o tipo de doces para tornar a sua festa mais saborosa.',
        imageUrl: 'https://picsum.photos/seed/bolos/400/300',
        rating: 4.9,
        contact: { phone: '923456789', email: 'encomendas@bolosdaavo.pt' },
        location: 'Lisboa e arredores'
    },
    {
        id: 3,
        name: 'Quinta Feliz',
        category: 'Espaços',
        description: 'Um espaço amplo com jardim, parque infantil e uma pequena quinta pedagógica. Ideal para festas e eventos ao ar livre.',
        imageUrl: 'https://picsum.photos/seed/quinta/400/300',
        rating: 4.7,
        contact: { phone: '934567890', email: 'eventos@quintafeliz.pt', whatsapp: '351934567890' },
        location: 'Sintra'
    }
];


@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private activities = signal<Activity[]>(MOCK_ACTIVITIES);
  private reviews = signal<Review[]>(MOCK_REVIEWS);
  private events = signal<Event[]>(MOCK_EVENTS);
  private suppliers = signal<Supplier[]>(MOCK_SUPPLIERS);

  private currentFilters = signal<ActivityFilters>({
    searchTerm: '',
    category: null,
    minPrice: 0,
    maxPrice: 100,
    minRating: 0
  });

  allActivities = this.activities.asReadonly();
  upcomingEvents = this.events.asReadonly();
  allSuppliers = this.suppliers.asReadonly();

  uniqueCategories = computed(() => {
    const categories = this.activities().map(a => a.category);
    return [...new Set(categories)] as ('Cultura' | 'Ar Livre' | 'Comida' | 'Oficinas')[];
  });

  filteredActivities = computed(() => {
    const activities = this.activities();
    const filters = this.currentFilters();
    
    return activities.filter(activity => {
      const searchTermMatch = filters.searchTerm ? activity.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) : true;
      const categoryMatch = filters.category ? activity.category === filters.category : true;
      const priceMatch = activity.price >= filters.minPrice && activity.price <= filters.maxPrice;
      const ratingMatch = activity.rating >= filters.minRating;

      return searchTermMatch && categoryMatch && priceMatch && ratingMatch;
    });
  });

  applyFilters(filters: ActivityFilters): void {
    this.currentFilters.set(filters);
  }

  getActivityById(id: number): Activity | undefined {
    return this.activities().find(a => a.id === id);
  }

  getReviewsForActivity(activityId: number): Review[] {
    return this.reviews().filter(r => r.activityId === activityId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addReview(review: Review): void {
    this.reviews.update(reviews => [...reviews, review]);
  }

  getEventById(id: number): Event | undefined {
    return this.events().find(e => e.id === id);
  }

  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers().find(s => s.id === id);
  }

}
