import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';
import { Event } from '../models/event.model';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private activities = signal<Activity[]>([
    {
      id: 1,
      name: 'Oceanário de Lisboa',
      category: 'Aquário',
      description: 'Descubra a magia dos oceanos com milhares de espécies marinhas. Uma experiência educativa e divertida para toda a família, com tanques impressionantes e exposições interativas.',
      imageUrl: 'https://picsum.photos/seed/oceanario/400/300',
      galleryImages: [
        'https://picsum.photos/seed/oceanario1/400/300',
        'https://picsum.photos/seed/oceanario2/400/300',
        'https://picsum.photos/seed/oceanario3/400/300',
        'https://picsum.photos/seed/oceanario4/400/300',
        'https://picsum.photos/seed/oceanario5/400/300',
      ],
      price: 19,
      rating: 4.8,
      reviews: [
        { id: 101, activityId: 1, userName: 'Família Silva', rating: 5, comment: 'As crianças adoraram os pinguins e as lontras! Um dia muito bem passado.', date: '2023-07-15T10:00:00Z' },
        { id: 102, activityId: 1, userName: 'João P.', rating: 4, comment: 'Muito bonito, mas um pouco cheio ao fim de semana.', date: '2023-08-01T14:30:00Z' },
      ],
      location: { lat: 38.7634, lng: -9.0945 },
      accessibility: { wheelchair: 'total', stroller: 'total' },
    },
    {
      id: 2,
      name: 'Jardim Zoológico de Lisboa',
      category: 'Ar Livre',
      description: 'Um dia selvagem espera por si! Veja animais de todo o mundo, assista a espetáculos com golfinhos e explore o parque de teleférico.',
      imageUrl: 'https://picsum.photos/seed/zoo/400/300',
      galleryImages: [
        'https://picsum.photos/seed/zoo1/400/300',
        'https://picsum.photos/seed/zoo2/400/300',
      ],
      price: 22.5,
      rating: 4.6,
      reviews: [],
      location: { lat: 38.7441, lng: -9.1733 },
      accessibility: { wheelchair: 'parcial', stroller: 'total' },
    },
    {
      id: 3,
      name: 'Pavilhão do Conhecimento',
      category: 'Museu',
      description: 'Ciência divertida para todas as idades. Exposições interativas onde é proibido não tocar. Perfeito para mentes curiosas.',
      imageUrl: 'https://picsum.photos/seed/ciencia/400/300',
      galleryImages: [
        'https://picsum.photos/seed/ciencia1/400/300',
        'https://picsum.photos/seed/ciencia2/400/300',
        'https://picsum.photos/seed/ciencia3/400/300',
      ],
      price: 10,
      rating: 4.9,
      reviews: [
        { id: 103, activityId: 3, userName: 'Ana F.', rating: 5, comment: 'Os meus filhos não queriam vir embora. A exposição sobre o corpo humano é fantástica!', date: '2023-09-10T11:00:00Z' },
      ],
      location: { lat: 38.7628, lng: -9.0950 },
      accessibility: { wheelchair: 'total', stroller: 'total' },
    },
    {
      id: 4,
      name: 'KidZania Lisboa',
      category: 'Parque Temático',
      description: 'Uma cidade à escala das crianças, onde elas podem ser o que quiserem: bombeiros, médicos, jornalistas e muito mais. Uma experiência de "edutainment" única.',
      imageUrl: 'https://picsum.photos/seed/kidzania/400/300',
      galleryImages: [],
      price: 25,
      rating: 4.5,
      reviews: [],
      location: { lat: 38.7554, lng: -9.1628 },
      accessibility: { wheelchair: 'total', stroller: 'total' },
    },
    {
        id: 5,
        name: 'Quinta Pedagógica dos Olivais',
        category: 'Ar Livre',
        description: 'Um refúgio rural no coração da cidade. As crianças podem interagir com animais da quinta, aprender sobre hortas e participar em workshops.',
        imageUrl: 'https://picsum.photos/seed/quinta/400/300',
        galleryImages: [
            'https://picsum.photos/seed/quinta1/400/300',
            'https://picsum.photos/seed/quinta2/400/300',
        ],
        price: 0,
        rating: 4.7,
        reviews: [],
        location: { lat: 38.7709, lng: -9.1171 },
        accessibility: { wheelchair: 'parcial', stroller: 'parcial' },
    },
  ]);

  private events = signal<Event[]>([
    {
      id: 1,
      name: 'Festival Panda',
      description: 'O maior evento infantil do país está de volta com as personagens favoritas das crianças, muita música e animação.',
      imageUrl: 'https://picsum.photos/seed/panda/400/300',
      location: 'Estádio Nacional, Oeiras',
      price: 20,
      startDate: '2024-07-05T09:00:00Z',
      endDate: '2024-07-07T19:00:00Z',
    },
    {
      id: 2,
      name: 'Exposição Dinossauros',
      description: 'Uma viagem no tempo até à era dos gigantes. Veja réplicas animatrónicas em tamanho real e participe em escavações fósseis.',
      imageUrl: 'https://picsum.photos/seed/dino/400/300',
      location: 'Cordoaria Nacional, Lisboa',
      price: 15,
      startDate: '2024-06-15T10:00:00Z',
      endDate: '2024-09-30T18:00:00Z',
    },
  ]);

  private suppliers = signal<Supplier[]>([
    {
        id: 1,
        name: 'Animafestas',
        category: 'Animação',
        description: 'Insufláveis, palhaços, pinturas faciais e modelagem de balões. A diversão para a sua festa está garantida!',
        imageUrl: 'https://picsum.photos/seed/animafesta/400/300',
        rating: 4.8,
        contact: {
            phone: '912345678',
            email: 'contacto@animafestas.pt',
            website: 'https://animafestas.pt'
        },
        location: 'Lisboa'
    },
    {
        id: 2,
        name: 'Doce Magia Catering',
        category: 'Catering',
        description: 'Bolos de aniversário temáticos, cupcakes, cake pops e menus completos para festas infantis. Tudo delicioso e com um toque de magia.',
        imageUrl: 'https://picsum.photos/seed/catering/400/300',
        rating: 4.9,
        contact: {
            phone: '967654321',
            email: 'encomendas@docemagia.pt'
        },
        location: 'Porto'
    },
    {
        id: 3,
        name: 'Quinta do Sonho',
        category: 'Espaços',
        description: 'Um espaço amplo com jardim, parque infantil e uma sala interior perfeita para qualquer festa. O cenário ideal para um dia inesquecível.',
        imageUrl: 'https://picsum.photos/seed/espaco/400/300',
        rating: 4.7,
        contact: {
            phone: '933333333',
            email: 'reservas@quintadosonho.pt',
            website: 'https://quintadosonho.pt'
        },
        location: 'Sintra'
    },
  ]);

  // Filters
  categoryFilter = signal<string | null>(null);
  priceFilter = signal<number | null>(null);
  ratingFilter = signal<number | null>(null);
  searchQuery = signal<string>('');
  
  // Public readonly signals
  upcomingEvents = this.events.asReadonly();
  allSuppliers = this.suppliers.asReadonly();
  
  filteredActivities = computed(() => {
    const category = this.categoryFilter();
    const price = this.priceFilter();
    const rating = this.ratingFilter();
    const query = this.searchQuery().toLowerCase();

    return this.activities()
      .filter(a => !category || a.category === category)
      .filter(a => !price || a.price <= price)
      .filter(a => !rating || a.rating >= rating)
      .filter(a => !query || a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query));
  });

  uniqueCategories = computed(() => {
    const categories = this.activities().map(a => a.category);
    return [...new Set(categories)];
  });

  getActivityById(id: number): Activity | undefined {
    return this.activities().find(a => a.id === id);
  }

  getEventById(id: number): Event | undefined {
    return this.events().find(e => e.id === id);
  }

  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers().find(s => s.id === id);
  }

  addReview(review: Review): void {
    this.activities.update(activities => {
      const activityIndex = activities.findIndex(a => a.id === review.activityId);
      if (activityIndex > -1) {
        const activity = { ...activities[activityIndex] };
        activity.reviews = [...activity.reviews, review];
        
        // Recalculate rating
        const totalRating = activity.reviews.reduce((sum, r) => sum + r.rating, 0);
        activity.rating = totalRating / activity.reviews.length;
        
        const newActivities = [...activities];
        newActivities[activityIndex] = activity;
        return newActivities;
      }
      return activities;
    });
  }
}
