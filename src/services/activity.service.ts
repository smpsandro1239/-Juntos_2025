import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Event } from '../models/event.model';
import { Supplier } from '../models/supplier.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private reviews = signal<Review[]>([
    { id: 1, activityId: 1, userName: 'Família Exploradora', rating: 5, comment: 'As crianças adoraram ver os peixes! Muito bem organizado.', date: new Date('2023-07-20').toISOString() },
    { id: 2, activityId: 1, userName: 'Aventureiros Urbanos', rating: 4, comment: 'Uma ótima tarde, embora um pouco cheio ao fim de semana.', date: new Date('2023-08-01').toISOString() },
    { id: 3, activityId: 2, userName: 'Amantes da Natureza', rating: 5, comment: 'Vistas incríveis de Lisboa. Perfeito para um piquenique.', date: new Date('2023-09-10').toISOString() },
    { id: 4, activityId: 3, userName: 'Grupo Ciência Divertida', rating: 5, comment: 'Exposições interativas fantásticas. Aprendemos imenso!', date: new Date('2023-10-05').toISOString() },
    { id: 5, activityId: 4, userName: 'Família Radical', rating: 4, comment: 'Muita adrenalina e diversão para todas as idades.', date: new Date('2023-06-15').toISOString() },
  ]);

  private activities = signal<Activity[]>([
    {
      id: 1,
      name: 'Oceanário de Lisboa',
      category: 'Aquário',
      description: 'Mergulhe num mundo de maravilhas aquáticas no Oceanário de Lisboa, um dos maiores aquários da Europa. Descubra pinguins, tubarões, lontras marinhas e uma incrível variedade de peixes coloridos. Uma experiência educativa e divertida para toda a família.',
      imageUrl: 'https://picsum.photos/seed/oceanario/400/300',
      galleryImages: ['https://picsum.photos/seed/oceanario1/800/600', 'https://picsum.photos/seed/oceanario2/800/600', 'https://picsum.photos/seed/oceanario3/800/600'],
      price: 19.00,
      rating: 4.8,
      rainyDayOk: true,
      location: { lat: 38.7634, lng: -9.0936, address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa' },
      reviews: this.reviews().filter(r => r.activityId === 1),
      accessibility: { wheelchair: 'total', stroller: 'total' }
    },
    {
      id: 2,
      name: 'Parque e Palácio da Pena',
      category: 'Ar Livre',
      description: 'Explore os jardins exóticos e o palácio de contos de fadas da Pena, em Sintra. Um local mágico com passagens secretas, vistas deslumbrantes e uma arquitetura colorida que vai encantar miúdos e graúdos.',
      imageUrl: 'https://picsum.photos/seed/pena/400/300',
      galleryImages: ['https://picsum.photos/seed/pena1/800/600', 'https://picsum.photos/seed/pena2/800/600'],
      price: 14.00,
      rating: 4.9,
      rainyDayOk: false,
      location: { lat: 38.7876, lng: -9.3905, address: 'Estrada da Pena, 2710-609 Sintra' },
      reviews: this.reviews().filter(r => r.activityId === 2),
      accessibility: { wheelchair: 'parcial', stroller: 'parcial' }
    },
    {
      id: 3,
      name: 'Pavilhão do Conhecimento',
      category: 'Museu',
      description: 'Ciência viva e interativa para todas as idades. No Pavilhão do Conhecimento, as crianças podem tocar, experimentar e aprender sobre o mundo da ciência de uma forma muito divertida. Ideal para mentes curiosas.',
      imageUrl: 'https://picsum.photos/seed/ciencia/400/300',
      galleryImages: ['https://picsum.photos/seed/ciencia1/800/600', 'https://picsum.photos/seed/ciencia2/800/600', 'https://picsum.photos/seed/ciencia3/800/600'],
      price: 10.00,
      rating: 4.7,
      rainyDayOk: true,
      location: { lat: 38.7623, lng: -9.0949, address: 'Largo José Mariano Gago nº1, 1990-073 Lisboa' },
      reviews: this.reviews().filter(r => r.activityId === 3),
      accessibility: { wheelchair: 'total', stroller: 'total' }
    },
    {
      id: 4,
      name: 'Dino Parque Lourinhã',
      category: 'Parque Temático',
      description: 'Viaje no tempo até à era dos dinossauros! O Dino Parque é o maior museu ao ar livre de Portugal, com mais de 180 modelos de dinossauros à escala real. Uma aventura jurássica para toda a família.',
      imageUrl: 'https://picsum.photos/seed/dino/400/300',
      galleryImages: ['https://picsum.photos/seed/dino1/800/600', 'https://picsum.photos/seed/dino2/800/600'],
      price: 13.00,
      rating: 4.6,
      rainyDayOk: false,
      location: { lat: 39.2398, lng: -9.3142, address: 'Rua Vale dos Dinossauros 25, 2530-059 Lourinhã' },
      reviews: this.reviews().filter(r => r.activityId === 4),
       accessibility: { wheelchair: 'parcial', stroller: 'total' }
    },
    {
        id: 5,
        name: 'Zoomarine',
        category: 'Parque Temático',
        description: 'Um dia repleto de diversão no Algarve, com apresentações de golfinhos e focas, escorregas aquáticos, uma praia artificial e muitas outras atrações. O Zoomarine combina entretenimento com educação ambiental.',
        imageUrl: 'https://picsum.photos/seed/zoomarine/400/300',
        galleryImages: ['https://picsum.photos/seed/zoomarine1/800/600', 'https://picsum.photos/seed/zoomarine2/800/600', 'https://picsum.photos/seed/zoomarine3/800/600'],
        price: 29.00,
        rating: 4.5,
        rainyDayOk: false,
        location: { lat: 37.1278, lng: -8.3146, address: 'N125, KM 65, 8201-864 Guia' },
        reviews: [],
        accessibility: { wheelchair: 'total', stroller: 'total' }
    }
  ]);

  private events = signal<Event[]>([
    {
        id: 1,
        name: 'Festival Panda',
        description: 'O maior evento infantil do país está de volta com muita música, dança e as personagens preferidas das crianças.',
        imageUrl: 'https://picsum.photos/seed/panda/400/300',
        location: 'Estádio Nacional, Oeiras',
        price: 20.00,
        startDate: '2024-07-05T10:00:00Z',
        endDate: '2024-07-07T18:00:00Z'
    },
    {
        id: 2,
        name: 'Workshop de Magia',
        description: 'Aprende truques de magia incríveis e surpreende os teus amigos e família! Para crianças dos 6 aos 12 anos.',
        imageUrl: 'https://picsum.photos/seed/magia/400/300',
        location: 'Museu da Imaginação, Lisboa',
        price: 15.00,
        startDate: '2024-08-12T15:00:00Z',
        endDate: '2024-08-12T17:00:00Z'
    }
  ]);

  private suppliers = signal<Supplier[]>([
    {
        id: 1, name: 'AnimaFestas', category: 'Animação',
        description: 'Levamos a diversão à sua festa! Insufláveis, pinturas faciais, modelagem de balões e jogos para todas as idades.',
        imageUrl: 'https://picsum.photos/seed/animafestas/400/300',
        rating: 4.9,
        contact: { phone: '912345678', email: 'geral@animafestas.pt', website: 'https://animafestas.pt' },
        location: 'Lisboa'
    },
    {
        id: 2, name: 'Bolos & Doces da Maria', category: 'Catering',
        description: 'Bolos de aniversário personalizados, cupcakes temáticos, cake pops e tudo o que precisa para uma mesa de doces de sonho.',
        imageUrl: 'https://picsum.photos/seed/bolos/400/300',
        rating: 4.8,
        contact: { phone: '934567890', email: 'encomendas@bolosdamaria.pt' },
        location: 'Porto'
    },
    {
        id: 3, name: 'Quinta da Aventura', category: 'Espaços',
        description: 'Um espaço amplo ao ar livre com parque infantil, campo de futebol e zona de piquenique. Ideal para festas de aniversário inesquecíveis.',
        imageUrl: 'https://picsum.photos/seed/quinta/400/300',
        rating: 4.7,
        contact: { phone: '965678901', email: 'eventos@quintaaventura.com', website: 'https://quintaaventura.com' },
        location: 'Sintra'
    },
    {
        id: 4, name: 'Balões Mágicos', category: 'Decoração',
        description: 'Decoração temática com balões para festas de aniversário, batizados e outros eventos. Arcos, colunas e centros de mesa personalizados.',
        imageUrl: 'https://picsum.photos/seed/baloes/400/300',
        rating: 4.9,
        contact: { phone: '926789012', email: 'info@baloesmagicos.pt' },
        location: 'Coimbra'
    }
  ]);

  // Filters state
  private searchTerm = signal('');
  private selectedCategories = signal<string[]>([]);
  private priceRange = signal<number>(50);
  private showWheelchairAccessible = signal(false);
  private showStrollerAccessible = signal(false);

  // Public Signals
  allSuppliers = this.suppliers.asReadonly();
  upcomingEvents = this.events.asReadonly();
  uniqueCategories = computed(() => [...new Set(this.activities().map(a => a.category))]);

  filteredActivities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const categories = this.selectedCategories();
    const price = this.priceRange();
    const wheelchair = this.showWheelchairAccessible();
    const stroller = this.showStrollerAccessible();

    return this.activities().filter(activity => {
      const matchesSearchTerm = activity.name.toLowerCase().includes(term);
      const matchesCategory = categories.length === 0 || categories.includes(activity.category);
      const matchesPrice = activity.price <= price;
      const matchesWheelchair = !wheelchair || ['total', 'parcial'].includes(activity.accessibility.wheelchair);
      const matchesStroller = !stroller || ['total', 'parcial'].includes(activity.accessibility.stroller);
      return matchesSearchTerm && matchesCategory && matchesPrice && matchesWheelchair && matchesStroller;
    });
  });

  // Public methods
  getActivityById(id: number): Activity | undefined {
    // Return a deep copy to avoid mutation issues outside the service
    const activity = this.activities().find(a => a.id === id);
    return activity ? JSON.parse(JSON.stringify(activity)) : undefined;
  }

  getEventById(id: number): Event | undefined {
    return this.events().find(e => e.id === id);
  }

  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers().find(s => s.id === id);
  }

  addReview(review: Review): void {
    this.reviews.update(reviews => [...reviews, review]);
    this.activities.update(activities => activities.map(activity => {
      if (activity.id === review.activityId) {
        const newReviews = [...activity.reviews, review].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
        return { ...activity, reviews: newReviews, rating: newRating };
      }
      return activity;
    }));
  }

  // Filter update methods
  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  toggleCategory(category: string): void {
    this.selectedCategories.update(categories => {
      const index = categories.indexOf(category);
      if (index > -1) {
        return categories.filter(c => c !== category);
      } else {
        return [...categories, category];
      }
    });
  }

  setPriceRange(price: number): void {
    this.priceRange.set(price);
  }

  toggleWheelchairAccessible(): void {
    this.showWheelchairAccessible.update(v => !v);
  }

  toggleStrollerAccessible(): void {
    this.showStrollerAccessible.update(v => !v);
  }

  // Get current filter values for filter component initialization
  getCurrentFilters() {
    return {
      searchTerm: this.searchTerm(),
      selectedCategories: this.selectedCategories(),
      priceRange: this.priceRange(),
      wheelchair: this.showWheelchairAccessible(),
      stroller: this.showStrollerAccessible()
    };
  }
}