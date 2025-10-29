import { Injectable, signal, computed } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';
import { Event } from '../models/event.model';
import { Supplier } from '../models/supplier.model';
import { CommunityPost, CommunityPostComment } from '../models/community-post.model';
import { Mission } from '../models/mission.model';
import { ThematicSeries } from '../models/thematic-series.model';

// MOCK DATA (Should be replaced by API calls)
const MOCK_ACTIVITIES: Activity[] = [
  { id: 1, name: 'Oceanário de Lisboa', category: 'Museu', description: 'Mergulhe num mundo de maravilhas marinhas no Oceanário de Lisboa...', imageUrl: 'https://picsum.photos/seed/oceanario/400/300', gallery: ['https://picsum.photos/seed/oceanario1/400/300', 'https://picsum.photos/seed/oceanario2/400/300'], price: 19, rating: 4.8, location: { address: 'Esplanada Dom Carlos I s/nº, 1990-005 Lisboa', lat: 38.7634, lng: -9.0935 }, accessibility: { wheelchair: 'Total', stroller: 'Total' }, isSustainable: true, rainyDayOk: true },
  { id: 2, name: 'Jardim Zoológico de Lisboa', category: 'Ar Livre', description: 'Descubra animais de todo o mundo no coração de Lisboa.', imageUrl: 'https://picsum.photos/seed/zoo/400/300', gallery: [], price: 22, rating: 4.6, location: { address: 'Praça Marechal Humberto Delgado, 1549-004 Lisboa', lat: 38.744, lng: -9.173 }, accessibility: { wheelchair: 'Parcial', stroller: 'Total' }, isSustainable: false, rainyDayOk: false },
  { id: 3, name: 'Pavilhão do Conhecimento', category: 'Museu', description: 'Um museu de ciência interativo para todas as idades.', imageUrl: 'https://picsum.photos/seed/pavcon/400/300', gallery: [], price: 10, rating: 4.7, location: { address: 'Largo José Mariano Gago nº1, 1990-073 Lisboa', lat: 38.761, lng: -9.095 }, accessibility: { wheelchair: 'Total', stroller: 'Total' }, isSustainable: true, rainyDayOk: true },
  { id: 4, name: 'Parque das Nações', category: 'Ar Livre', description: 'Uma vasta área verde com jardins, teleférico e muitas atividades.', imageUrl: 'https://picsum.photos/seed/parque/400/300', gallery: [], price: 0, rating: 4.5, location: { address: 'Parque das Nações, Lisboa', lat: 38.768, lng: -9.095 }, accessibility: { wheelchair: 'Total', stroller: 'Total' }, isSustainable: true, rainyDayOk: false },
  { id: 5, name: 'Castelo de S. Jorge', category: 'Cultura', description: 'Explore a história de Lisboa com vistas deslumbrantes.', imageUrl: 'https://picsum.photos/seed/castelo/400/300', gallery: [], price: 10, rating: 4.7, location: { address: 'R. de Santa Cruz do Castelo, 1100-129 Lisboa', lat: 38.713, lng: -9.133 }, accessibility: { wheelchair: 'Nenhum', stroller: 'Parcial' }, isSustainable: false, rainyDayOk: false },
  { id: 6, name: 'KidZania Lisboa', category: 'Parque Temático', description: 'Uma cidade à escala onde as crianças podem experimentar profissões.', imageUrl: 'https://picsum.photos/seed/kidzania/400/300', gallery: [], price: 25, rating: 4.4, location: { address: 'Av. Cruzeiro Seixas 7, 2650-504 Amadora', lat: 38.756, lng: -9.227 }, accessibility: { wheelchair: 'Total', stroller: 'Total' }, isSustainable: false, rainyDayOk: true },
];

const MOCK_REVIEWS: Review[] = [
  { id: 1, activityId: 1, userName: 'Ana Silva', rating: 5, comment: 'As crianças adoraram os pinguins! Muito bem organizado.', date: '2025-05-20T00:00:00Z' },
  { id: 2, activityId: 1, userName: 'Manuel Dias', rating: 4, comment: 'É um pouco caro, mas vale a pena a visita.', date: '2025-05-18T00:00:00Z' },
];

const MOCK_EVENTS: Event[] = [
  { id: 1, name: 'Teatro de Marionetas', description: 'Um espetáculo mágico de marionetas para toda a família.', imageUrl: 'https://picsum.photos/seed/marionetas/400/300', location: 'Jardim da Estrela', price: 5, startDate: '2025-08-10T15:00:00Z', endDate: '2025-08-10T16:00:00Z' },
  { id: 2, name: 'Workshop de Culinária Infantil', description: 'Pequenos chefs a fazer bolachas!', imageUrl: 'https://picsum.photos/seed/culinaria/400/300', location: 'Time Out Market', price: 15, startDate: '2025-08-15T10:00:00Z', endDate: '2025-08-15T12:00:00Z' },
];

const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'Palhaços & Companhia', category: 'Animação', description: 'Animação de festas com palhaços, magia e modelagem de balões.', imageUrl: 'https://picsum.photos/seed/palhacos/400/300', rating: 4.9, contact: { phone: '912345678', email: 'geral@palhacos.pt', whatsapp: '351912345678' }, location: 'Lisboa' },
    { id: 2, name: 'Bolos da Maria', category: 'Catering', description: 'Bolos de aniversário personalizados e deliciosos.', imageUrl: 'https://picsum.photos/seed/bolos/400/300', rating: 4.8, contact: { phone: '912345679', email: 'bolos@maria.pt' }, location: 'Porto' }
];

const MOCK_POSTS: CommunityPost[] = [
    { id: 1, authorName: 'Joana F.', date: '2025-07-20T00:00:00Z', title: 'Dica para visitar o Oceanário com bebés', content: 'Levem um marsúpio! É mais fácil de circular do que com o carrinho, especialmente quando está cheio. Os aquários grandes prendem a atenção deles por muito tempo!', category: 'Dicas', likes: 15, comments: [] }
];

const MOCK_MISSIONS: Mission[] = [
    { id: 1, title: 'Validador de Acessibilidade', description: 'Confirme o nível de acesso para carrinhos de bebé no Jardim Zoológico.', points: 20, isCompleted: false, activityId: 2 },
    { id: 2, title: 'Fotógrafo Comunitário', description: 'Tire uma foto do novo escorrega no Parque das Nações.', points: 15, isCompleted: false, activityId: 4 }
];

const MOCK_THEMATIC_SERIES: ThematicSeries[] = [
    { id: 1, name: 'Explorador de Museus', description: 'Visite os museus mais icónicos.', stamps: [ { id: 1, name: 'Oceanário', imageUrl: 'https://picsum.photos/seed/stamp1/100/100', collected: false }, { id: 3, name: 'Pav. Conhecimento', imageUrl: 'https://picsum.photos/seed/stamp3/100/100', collected: false }] }
];


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private _isOffline = signal(false);
  
  private activities = signal<Activity[]>([]);
  private reviews = signal<Review[]>([]);
  private events = signal<Event[]>([]);
  private suppliers = signal<Supplier[]>([]);
  private posts = signal<CommunityPost[]>([]);
  private missions = signal<Mission[]>([]);
  private thematicSeries = signal<ThematicSeries[]>([]);

  // Filter signals
  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);
  maxPrice = signal(30);
  minRating = signal(0);
  showOnlyFree = signal(false);
  showRainyDayOk = signal(false);
  showWheelchairAccessible = signal(false);
  showStrollerAccessible = signal(false);

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const cachedData = localStorage.getItem('juntos_data');
    if (cachedData) {
      const data = JSON.parse(cachedData);
      this.activities.set(data.activities);
      this.reviews.set(data.reviews);
      this.events.set(data.events);
      this.suppliers.set(data.suppliers);
      this.posts.set(data.posts);
      this.missions.set(data.missions);
      this.thematicSeries.set(data.thematicSeries);
      this._isOffline.set(true);
    } else {
      // Simulate API fetch
      setTimeout(() => {
        this.activities.set(MOCK_ACTIVITIES);
        this.reviews.set(MOCK_REVIEWS);
        this.events.set(MOCK_EVENTS);
        this.suppliers.set(MOCK_SUPPLIERS);
        this.posts.set(MOCK_POSTS);
        this.missions.set(MOCK_MISSIONS);
        this.thematicSeries.set(MOCK_THEMATIC_SERIES);
        this.saveDataToCache();
        this._isOffline.set(false);
      }, 500);
    }
  }

  private saveDataToCache(): void {
    const dataToCache = {
      activities: this.activities(),
      reviews: this.reviews(),
      events: this.events(),
      suppliers: this.suppliers(),
      posts: this.posts(),
      missions: this.missions(),
      thematicSeries: this.thematicSeries(),
    };
    localStorage.setItem('juntos_data', JSON.stringify(dataToCache));
  }
  
  isOffline = this._isOffline.asReadonly();

  // Activities
  allActivities = this.activities.asReadonly();
  filteredActivities = computed(() => {
    return this.activities()
      .filter(act => act.name.toLowerCase().includes(this.searchQuery().toLowerCase()))
      .filter(act => !this.selectedCategory() || act.category === this.selectedCategory())
      .filter(act => act.price <= this.maxPrice())
      .filter(act => act.rating >= this.minRating())
      .filter(act => !this.showOnlyFree() || act.price === 0)
      .filter(act => !this.showRainyDayOk() || act.rainyDayOk)
      .filter(act => !this.showWheelchairAccessible() || act.accessibility.wheelchair === 'Total')
      .filter(act => !this.showStrollerAccessible() || act.accessibility.stroller === 'Total');
  });

  getActivityById = (id: number): Activity | undefined => this.activities().find(a => a.id === id);
  getUniqueCategories = computed(() => [...new Set(this.activities().map(a => a.category))]);

  // Reviews
  getReviewsByActivityId = (id: number): Review[] => this.reviews().filter(r => r.activityId === id);
  addReview = (review: Review): void => this.reviews.update(r => [...r, review]);
  
  // Events
  upcomingEvents = computed(() => this.events().filter(e => new Date(e.startDate) > new Date()).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
  getEventById = (id: number): Event | undefined => this.events().find(e => e.id === id);

  // Suppliers
  allSuppliers = this.suppliers.asReadonly();
  getSupplierById = (id: number): Supplier | undefined => this.suppliers().find(s => s.id === id);
  
  // Community Posts
  allPosts = this.posts.asReadonly();
  getPostById = (id: number): CommunityPost | undefined => this.posts().find(p => p.id === id);
  addPost = (post: Omit<CommunityPost, 'id' | 'likes' | 'comments'>): void => this.posts.update(p => [...p, { ...post, id: Date.now(), likes: 0, comments: [] }]);
  addCommentToPost = (postId: number, comment: Omit<CommunityPostComment, 'id'>): void => {
      this.posts.update(posts => posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, { ...comment, id: Date.now() }] } : p));
  };

  // Missions & Series
  allMissions = this.missions.asReadonly();
  allThematicSeries = this.thematicSeries.asReadonly();
}
