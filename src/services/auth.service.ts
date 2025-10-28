import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Album, AlbumPhoto } from '../models/album.model';
import { Order } from '../models/order.model';

const MOCK_USER: User = {
  id: 1,
  name: 'Ana Silva',
  email: 'user@juntos.com',
  isPremium: false,
  favorites: [1, 3],
  passport: {
    stampsCollected: [1, 5, 8, 10],
    thematicSeries: [
      {
        id: 1,
        name: 'Exploradores da Natureza',
        description: 'Descubra os espaços verdes de Lisboa.',
        stamps: [
          { id: 4, name: 'Jardim da Estrela', imageUrl: 'https://picsum.photos/seed/stamp-estrela/100/100', collected: false },
          { id: 8, name: 'Parque de Monsanto', imageUrl: 'https://picsum.photos/seed/stamp-monsanto/100/100', collected: false },
        ]
      },
      {
        id: 2,
        name: 'Mestres Culinários',
        description: 'Prove os sabores de Portugal.',
        stamps: [
          { id: 3, name: 'Pastel de Nata', imageUrl: 'https://picsum.photos/seed/stamp-pastel/100/100', collected: false },
          { id: 10, name: 'Mercado da Ribeira', imageUrl: 'https://picsum.photos/seed/stamp-ribeira/100/100', collected: false },
        ]
      },
    ]
  },
  points: {
    balance: 250,
    transactions: [
      { id: 1, date: '2024-07-20T10:00:00Z', description: 'Completou a missão "Primeira Avaliação"', points: 50 },
      { id: 2, date: '2024-07-21T14:00:00Z', description: 'Carimbo Passaporte: Oceanário', points: 100 },
      { id: 3, date: '2024-07-22T18:00:00Z', description: 'Tornou-se membro Premium', points: 100 },
    ]
  },
  albums: [
    {
      id: 1,
      name: 'Verão em Lisboa',
      photos: [
        { imageUrl: 'https://picsum.photos/seed/album1-1/400/400', activityName: 'Oceanário de Lisboa' },
        { imageUrl: 'https://picsum.photos/seed/album1-2/400/400', activityName: 'Passeio de Elétrico 28' }
      ]
    },
    {
      id: 2,
      name: 'Fim de Semana',
      photos: []
    }
  ],
  orders: [],
  missions: [
    { id: 1, title: 'Primeira Avaliação', description: 'Deixe a sua primeira avaliação numa atividade.', points: 50, isCompleted: true, activityId: 1 },
    { id: 2, title: 'Explorador', description: 'Visite 3 locais da categoria "Ar Livre".', points: 100, isCompleted: false },
    { id: 3, title: 'Fotógrafo', description: 'Adicione 5 fotos a um álbum.', points: 75, isCompleted: false },
  ]
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);

  // Public signals
  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = computed(() => !!this.currentUserSignal());
  isPremium = computed(() => this.currentUserSignal()?.isPremium ?? false);
  userAlbums = computed(() => this.currentUserSignal()?.albums ?? []);
  userOrders = computed(() => this.currentUserSignal()?.orders ?? []);

  constructor() {
    // Check for logged-in user in session storage to persist login
    const storedUser = sessionStorage.getItem('juntos-user');
    if (storedUser) {
      this.currentUserSignal.set(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): boolean {
    if (email.toLowerCase() === MOCK_USER.email.toLowerCase() && password === '123456') {
      this.currentUserSignal.set(JSON.parse(JSON.stringify(MOCK_USER))); // Deep copy to avoid mutation issues
      this.updateStoredUser();
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem('juntos-user');
  }

  toggleFavorite(activityId: number): void {
    this.currentUserSignal.update(user => {
      if (!user) return null;
      const favorites = user.favorites;
      const index = favorites.indexOf(activityId);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(activityId);
      }
      return { ...user, favorites: [...favorites] };
    });
    this.updateStoredUser();
  }

  addAlbum(name: string): void {
    this.currentUserSignal.update(user => {
      if (!user) return null;
      const newAlbum: Album = {
        id: Date.now(),
        name,
        photos: []
      };
      return { ...user, albums: [...user.albums, newAlbum] };
    });
    this.updateStoredUser();
  }

  getAlbumById(albumId: number): Album | undefined {
    return this.userAlbums().find(album => album.id === albumId);
  }

  addPhotoToAlbum(albumId: number, photo: AlbumPhoto): void {
    this.currentUserSignal.update(user => {
      if (!user) return null;
      const albums = user.albums.map(album => {
        if (album.id === albumId) {
          return { ...album, photos: [...album.photos, photo] };
        }
        return album;
      });
      return { ...user, albums };
    });
    this.updateStoredUser();
  }

  addOrder(orderData: Omit<Order, 'id'>): void {
    this.currentUserSignal.update(user => {
        if (!user) return null;
        const newOrder: Order = {
            id: Date.now(),
            ...orderData
        };
        return { ...user, orders: [newOrder, ...user.orders] };
    });
    this.updateStoredUser();
  }
  
  becomePremium(): void {
    this.currentUserSignal.update(user => {
      if (!user) return null;
      return { ...user, isPremium: true };
    });
    this.updateStoredUser();
  }
  
  private updateStoredUser(): void {
    const currentUser = this.currentUser();
    if (currentUser) {
      sessionStorage.setItem('juntos-user', JSON.stringify(currentUser));
    }
  }
}
