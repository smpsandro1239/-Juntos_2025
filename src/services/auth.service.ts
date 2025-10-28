import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { ThematicSeries } from '../models/thematic-series.model';
import { PointTransaction } from '../models/point-transaction.model';
import { Order } from '../models/order.model';
import { Album } from '../models/album.model';
import { TripPlan } from '../models/trip-plan.model';
import { L10nService } from './l10n.service';

const MOCK_THEMATIC_SERIES: ThematicSeries[] = [
    {
        id: 1, name: 'Maravilhas de Lisboa', description: 'Descubra os ícones da cidade.',
        stamps: [
            { id: 2, name: 'Elétrico 28', imageUrl: 'https://picsum.photos/seed/stamp2/100/100', collected: false },
            { id: 4, name: 'Pastéis de Belém', imageUrl: 'https://picsum.photos/seed/stamp4/100/100', collected: false },
            { id: 6, name: 'Passeio no Tejo', imageUrl: 'https://picsum.photos/seed/stamp6/100/100', collected: false },
        ]
    },
    {
        id: 2, name: 'Amigos dos Animais', description: 'Conheça a vida selvagem.',
        stamps: [
            { id: 1, name: 'Oceanário', imageUrl: 'https://picsum.photos/seed/stamp1/100/100', collected: false },
        ]
    }
];


const MOCK_USER: User = {
  id: 1,
  name: 'Ana Silva',
  email: 'user@juntos.com',
  isPremium: false,
  favorites: [1, 3],
  points: {
    balance: 850,
    transactions: [
      { id: 1, date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Completou a missão "Primeira Avaliação"', points: 50 },
      { id: 2, date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Completou a missão "Explorador de Fim de Semana"', points: 100 },
    ]
  },
  passport: {
    thematicSeries: MOCK_THEMATIC_SERIES,
    stampsCollected: [2]
  },
  albums: [
    { id: 1, name: 'Fim de Semana em Belém', photos: [{ imageUrl: 'https://picsum.photos/seed/belem1/400/400', activityName: 'Fábrica de Pastéis de Belém' }, { imageUrl: 'https://picsum.photos/seed/belem2/400/400', activityName: 'Mosteiro dos Jerónimos' }] },
    { id: 2, name: 'Verão 2024', photos: [] }
  ],
  orders: [],
  missions: [
      { id: 1, title: 'Primeira Avaliação', description: 'Deixe uma avaliação numa atividade', points: 50, isCompleted: true },
      { id: 2, title: 'Explorador de Fim de Semana', description: 'Adicione 3 atividades aos favoritos', points: 100, isCompleted: true },
      { id: 3, title: 'Fotógrafo Amador', description: 'Crie o seu primeiro álbum de fotos', points: 75, isCompleted: false },
      { id: 4, title: 'Membro da Comunidade', description: 'Faça o seu primeiro post na comunidade', points: 50, isCompleted: false },
  ],
  savedPlans: [],
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private l10nService = inject(L10nService);
  
  private user = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.user());
  currentUser = this.user.asReadonly();
  isPremium = computed(() => this.user()?.isPremium ?? false);
  userAlbums = computed(() => this.user()?.albums ?? []);
  userOrders = computed(() => this.user()?.orders ?? []);
  savedPlans = computed(() => this.user()?.savedPlans ?? []);

  constructor() {
    // In a real app, you would check for a stored token/session
  }
  
  translate(key: any, ...args: any[]): string {
    return this.l10nService.translate(key, ...args);
  }

  login(email: string, password: string): boolean {
    if (email.toLowerCase() === 'user@juntos.com' && password === '123456') {
      this.user.set(MOCK_USER);
      return true;
    }
    return false;
  }

  logout(): void {
    this.user.set(null);
  }

  toggleFavorite(activityId: number): void {
    this.user.update(user => {
      if (!user) return null;
      const favorites = user.favorites;
      const index = favorites.indexOf(activityId);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(activityId);
      }
      return { ...user, favorites };
    });
  }
  
  becomePremium(): void {
      this.user.update(user => user ? ({ ...user, isPremium: true }) : null);
  }

  spendPoints(amount: number, description: string): boolean {
    if (!this.user() || this.user()!.points.balance < amount) {
        return false;
    }
    this.user.update(user => {
        if (!user) return null;
        const newTransaction: PointTransaction = {
            id: Date.now(),
            date: new Date().toISOString(),
            description: description,
            points: -amount
        };
        return { 
            ...user, 
            points: {
                balance: user.points.balance - amount,
                transactions: [...user.points.transactions, newTransaction]
            }
        };
    });
    return true;
  }

  addAlbum(name: string): void {
      this.user.update(user => {
          if (!user) return null;
          const newAlbum: Album = { id: Date.now(), name, photos: [] };
          return { ...user, albums: [...user.albums, newAlbum] };
      });
  }

  getAlbumById(id: number): Album | undefined {
      return this.user()?.albums.find(a => a.id === id);
  }
  
  addPhotoToAlbum(albumId: number, photo: { imageUrl: string; activityName: string; }): void {
      this.user.update(user => {
          if (!user) return null;
          const albums = user.albums.map(album => {
              if (album.id === albumId) {
                  return { ...album, photos: [...album.photos, photo] };
              }
              return album;
          });
          return { ...user, albums };
      });
  }
  
  addOrder(order: Omit<Order, 'id'>): void {
      this.user.update(user => {
          if (!user) return null;
          const newOrder: Order = { ...order, id: Date.now() };
          return { ...user, orders: [...user.orders, newOrder] };
      });
  }

  getPlanById(id: number): TripPlan | undefined {
    return this.user()?.savedPlans.find(p => p.id === id);
  }

  savePlan(plan: Omit<TripPlan, 'id'>): void {
    this.user.update(user => {
      if (!user) return null;
      const newPlan: TripPlan = { ...plan, id: Date.now() };
      return { ...user, savedPlans: [newPlan, ...user.savedPlans] };
    });
  }
}
