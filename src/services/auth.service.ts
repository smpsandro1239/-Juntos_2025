import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { Album, AlbumPhoto } from '../models/album.model';
import { TripPlan } from '../models/trip-plan.model';
import { ActivityService } from './activity.service';
import { L10nService } from './l10n.service';

const MOCK_USER: User = {
  id: 1,
  name: 'Utilizador Teste',
  email: 'teste@juntos.pt',
  isPremium: false,
  favorites: [1, 3],
  points: { balance: 1250, transactions: [{id: 1, date: '2025-01-01', description: 'Bónus de Boas-Vindas', points: 100}] },
  passport: { thematicSeries: [], stampsCollected: [1] },
  albums: [{ id: 1, name: 'Fim de Semana em Lisboa', photos: [{imageUrl: 'https://picsum.photos/seed/album1/400/400', activityName: 'Oceanário de Lisboa'}] }],
  orders: [],
  missions: [],
  savedPlans: [],
};

const MOCK_PREMIUM_USER: User = {
    id: 2,
    name: 'Família Premium',
    email: 'premium@juntos.pt',
    isPremium: true,
    favorites: [2, 4],
    points: { balance: 500, transactions: [] },
    passport: { thematicSeries: [], stampsCollected: [1,3] },
    albums: [],
    orders: [],
    missions: [],
    savedPlans: [],
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private l10n = inject(L10nService);
  
  currentUser = signal<User | null>(null);
  
  isLoggedIn = computed(() => !!this.currentUser());
  isPremium = computed(() => this.currentUser()?.isPremium ?? false);
  userAlbums = computed(() => this.currentUser()?.albums ?? []);
  userOrders = computed(() => this.currentUser()?.orders ?? []);
  savedPlans = computed(() => this.currentUser()?.savedPlans ?? []);
  
  // UI state signals, managed here for convenience
  langDropdownOpen = signal(false);
  mobileMenuOpen = signal(false);

  constructor() {
    // Check for logged-in user in storage on startup
    const storedUser = localStorage.getItem('juntos_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // In a real app, you'd fetch fresh data. Here we just set it.
      // We also need to populate dynamic data like missions and series
      const activityService = inject(ActivityService);
      user.missions = activityService.allMissions();
      user.passport.thematicSeries = activityService.allThematicSeries();
      this.currentUser.set(user);
    }
  }

  login(email: string, pass: string): boolean {
    let user: User | null = null;
    if (email.toLowerCase() === MOCK_USER.email) {
      user = MOCK_USER;
    } else if (email.toLowerCase() === MOCK_PREMIUM_USER.email) {
      user = MOCK_PREMIUM_USER;
    }

    if (user) {
      localStorage.setItem('juntos_user', JSON.stringify(user));
      const activityService = inject(ActivityService);
      user.missions = activityService.allMissions();
      user.passport.thematicSeries = activityService.allThematicSeries();
      this.currentUser.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('juntos_user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
  
  becomePremium(): void {
    this.currentUser.update(user => {
        if(!user) return null;
        const updatedUser = { ...user, isPremium: true };
        localStorage.setItem('juntos_user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  }

  toggleFavorite(activityId: number): void {
      this.currentUser.update(user => {
          if (!user) return null;
          const favorites = user.favorites.includes(activityId)
            ? user.favorites.filter(id => id !== activityId)
            : [...user.favorites, activityId];
          const updatedUser = { ...user, favorites };
          localStorage.setItem('juntos_user', JSON.stringify(updatedUser));
          return updatedUser;
      });
  }

  addAlbum(name: string): void {
      this.currentUser.update(user => {
          if (!user) return null;
          const newAlbum: Album = { id: Date.now(), name, photos: [] };
          const updatedUser = { ...user, albums: [...user.albums, newAlbum] };
          localStorage.setItem('juntos_user', JSON.stringify(updatedUser));
          return updatedUser;
      });
  }

  addPhotoToAlbum(albumId: number, photo: AlbumPhoto): void {
      this.currentUser.update(user => {
          if (!user) return null;
          const albums = user.albums.map(album => 
              album.id === albumId ? { ...album, photos: [...album.photos, photo] } : album
          );
          const updatedUser = { ...user, albums };
          localStorage.setItem('juntos_user', JSON.stringify(updatedUser));
          return updatedUser;
      });
  }
  
  getAlbumById = (id: number): Album | undefined => this.currentUser()?.albums.find(a => a.id === id);
  
  addOrder(order: Omit<Order, 'id'>): void {
      this.currentUser.update(user => {
          if (!user) return null;
          const newOrder: Order = { ...order, id: Date.now() };
          const updatedUser = { ...user, orders: [...user.orders, newOrder] };
          localStorage.setItem('juntos_user', JSON.stringify(updatedUser));
          return updatedUser;
      });
  }
  
  spendPoints(amount: number, description: string): boolean {
    if (!this.currentUser() || this.currentUser()!.points.balance < amount) {
      return false;
    }
    this.currentUser.update(user => {
        if (!user) return null;
        const newTransaction = { id: Date.now(), date: new Date().toISOString(), description, points: -amount };
        const updatedUser = { 
            ...user, 
            points: {
                balance: user.points.balance - amount,
                transactions: [...user.points.transactions, newTransaction]
            }
        };
        localStorage.setItem('juntos_user', JSON.stringify(updatedUser));
        return updatedUser;
    });
    return true;
  }
  
  saveTripPlan(plan: Omit<TripPlan, 'id'>): void {
    this.currentUser.update(user => {
        if (!user) return null;
        const newPlan: TripPlan = { ...plan, id: Date.now() };
        const updatedUser = { ...user, savedPlans: [...user.savedPlans, newPlan] };
        localStorage.setItem('juntos_user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  }

  getPlanById = (id: number): TripPlan | undefined => this.currentUser()?.savedPlans.find(p => p.id === id);

  translate = (key: keyof import('../i18n/en').en, ...args: any[]): string => this.l10n.translate(key, ...args);
}
