import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Album, AlbumPhoto } from '../models/album.model';
import { Order } from '../models/order.model';
import { TripPlan } from '../models/trip-plan.model';
import { L10nService } from './l10n.service';

const MOCK_USER: User = {
  id: 1,
  name: 'Ana Silva',
  email: 'ana@juntos.pt',
  isPremium: false,
  favorites: [1, 3],
  points: {
    balance: 1250,
    transactions: [
      { id: 1, date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Completou a missão "Primeira Avaliação"', points: 50 },
      { id: 2, date: new Date(Date.now() - 86400000).toISOString(), description: 'Adicionou 5 fotos ao álbum "Férias de Verão"', points: 100 },
    ],
  },
  missions: [
    { id: 1, title: 'Primeira Avaliação', description: 'Deixe a sua primeira avaliação numa atividade', points: 50, isCompleted: true, activityId: 3 },
    { id: 2, title: 'Fotógrafo de Verão', description: 'Adicione 5 fotos a um álbum', points: 100, isCompleted: true },
    { id: 3, title: 'Explorador Cultural', description: 'Visite 3 locais culturais', points: 150, isCompleted: false },
  ],
  passport: {
    stampsCollected: [1, 5],
    thematicSeries: [
      {
        id: 1,
        name: 'Descobridor de Lisboa',
        description: 'Colecione selos dos locais mais icónicos da cidade.',
        stamps: [
          { id: 1, name: 'Oceanário', imageUrl: 'https://picsum.photos/seed/stamp1/100/100', collected: false },
          { id: 2, name: 'Elétrico 28', imageUrl: 'https://picsum.photos/seed/stamp2/100/100', collected: false },
          { id: 5, name: 'Azulejos', imageUrl: 'https://picsum.photos/seed/stamp5/100/100', collected: false },
          { id: 6, name: 'Passeio de Barco', imageUrl: 'https://picsum.photos/seed/stamp6/100/100', collected: false },
        ]
      }
    ]
  },
  albums: [
    { id: 1, name: 'Férias de Verão', photos: [
      { imageUrl: 'https://picsum.photos/seed/album1-1/400/400', activityName: 'Oceanário de Lisboa' },
      { imageUrl: 'https://picsum.photos/seed/album1-2/400/400', activityName: 'Piquenique no Jardim' },
      { imageUrl: 'https://picsum.photos/seed/album1-3/400/400', activityName: 'Passeio de Barco' },
      { imageUrl: 'https://picsum.photos/seed/album1-4/400/400', activityName: 'Passeio de Barco' },
      { imageUrl: 'https://picsum.photos/seed/album1-5/400/400', activityName: 'Oceanário de Lisboa' },
    ]},
    { id: 2, name: 'Aniversário do Zé', photos: [] }
  ],
  orders: [],
  savedPlans: []
};


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = new Router();
  private l10n = new L10nService();

  private currentUserSignal = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.currentUserSignal());
  currentUser = this.currentUserSignal.asReadonly();
  isPremium = computed(() => this.currentUserSignal()?.isPremium ?? false);
  userAlbums = computed(() => this.currentUserSignal()?.albums ?? []);
  userOrders = computed(() => this.currentUserSignal()?.orders.slice().reverse() ?? []);
  savedPlans = computed(() => this.currentUserSignal()?.savedPlans ?? []);

  constructor() {
    // Check local storage for a logged-in user on startup
    const storedUser = localStorage.getItem('juntos_user');
    if (storedUser) {
      this.currentUserSignal.set(JSON.parse(storedUser));
    }

    // Persist user data to local storage on change
    effect(() => {
        const user = this.currentUserSignal();
        if(user) {
            localStorage.setItem('juntos_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('juntos_user');
        }
    });
  }
  
  translate(key: any, ...args: any[]): string {
    return this.l10n.translate(key, ...args);
  }

  login(email: string, password: string): boolean {
    if (email.toLowerCase() === 'ana@juntos.pt' && password === '1234') {
      this.currentUserSignal.set(MOCK_USER);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  toggleFavorite(activityId: number): void {
    this.currentUserSignal.update(user => {
        if (!user) return user;
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
  
  addAlbum(name: string): void {
      this.currentUserSignal.update(user => {
          if (!user) return user;
          const newAlbum: Album = {
              id: Date.now(),
              name,
              photos: []
          };
          return { ...user, albums: [...user.albums, newAlbum] };
      });
  }

  getAlbumById(id: number): Album | undefined {
      return this.currentUserSignal()?.albums.find(a => a.id === id);
  }

  addPhotoToAlbum(albumId: number, photo: AlbumPhoto): void {
      this.currentUserSignal.update(user => {
          if (!user) return user;
          const albums = user.albums.map(album => {
              if (album.id === albumId) {
                  return { ...album, photos: [...album.photos, photo] };
              }
              return album;
          });
          return { ...user, albums };
      });
  }

  addOrder(newOrderData: Omit<Order, 'id'>) {
      this.currentUserSignal.update(user => {
        if (!user) return user;
        const newOrder: Order = {
            ...newOrderData,
            id: Date.now(),
        };
        return { ...user, orders: [...user.orders, newOrder] };
      });
  }

  spendPoints(amount: number, description: string): boolean {
    let success = false;
    this.currentUserSignal.update(user => {
        if (!user || user.points.balance < amount) {
            success = false;
            return user;
        }
        const newTransaction = {
            id: Date.now(),
            date: new Date().toISOString(),
            description,
            points: -amount,
        };
        const newBalance = user.points.balance - amount;
        success = true;
        return { 
            ...user, 
            points: {
                balance: newBalance,
                transactions: [...user.points.transactions, newTransaction]
            }
        };
    });
    return success;
  }

  becomePremium(): void {
    this.currentUserSignal.update(user => {
        if (!user) return user;
        return { ...user, isPremium: true };
    });
  }

  addSavedPlan(plan: TripPlan): void {
      this.currentUserSignal.update(user => {
          if (!user) return user;
          return { ...user, savedPlans: [...user.savedPlans, plan] };
      });
  }

  getPlanById(id: number): TripPlan | undefined {
      return this.currentUserSignal()?.savedPlans.find(p => p.id === id);
  }
}
