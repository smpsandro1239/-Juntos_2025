import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Album, AlbumPhoto } from '../models/album.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = signal<User[]>([
    { 
      id: 1, 
      name: 'Família Aventura', 
      email: 'user@example.com', 
      isPremium: false, 
      visitedActivityIds: [1, 3],
      albums: [
        { id: 1, name: 'Verão em Lisboa', photos: [
            { imageUrl: 'https://picsum.photos/seed/oceanario/400/300', activityName: 'Oceanário de Lisboa' }
        ]},
        { id: 2, name: 'Fim de Semana Radical', photos: []}
      ],
      orders: []
    },
  ]);

  private loggedInUser = signal<User | null>(null);

  currentUser = this.loggedInUser.asReadonly();
  isLoggedIn = computed(() => !!this.loggedInUser());
  userAlbums = computed(() => this.loggedInUser()?.albums || []);
  userOrders = computed(() => this.loggedInUser()?.orders || []);

  constructor() {
    // Basic session persistence
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser.set(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): boolean {
    const userFromDb = this.users().find(u => u.email === email);
    if (userFromDb && password === 'password') {
      this.loggedInUser.set({...userFromDb});
      localStorage.setItem('loggedInUser', JSON.stringify(userFromDb));
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedInUser.set(null);
    localStorage.removeItem('loggedInUser');
  }

  upgradeToPremium(): void {
    this.updateUser(user => ({ ...user, isPremium: true }));
  }

  markAsVisited(activityId: number): void {
     this.updateUser(user => {
        if (!user.visitedActivityIds.includes(activityId)) {
          return { ...user, visitedActivityIds: [...user.visitedActivityIds, activityId] };
        }
        return user;
     });
  }

  getAlbumById(id: number): Album | undefined {
    return this.userAlbums().find(a => a.id === id);
  }

  addAlbum(name: string): void {
    const newAlbum: Album = {
      id: Date.now(),
      name,
      photos: []
    };
    this.updateUser(user => ({ ...user, albums: [...user.albums, newAlbum] }));
  }

  addPhotoToAlbum(albumId: number, photo: AlbumPhoto): void {
    this.updateUser(user => {
      const updatedAlbums = user.albums.map(album => {
        if (album.id === albumId) {
          return { ...album, photos: [...album.photos, photo] };
        }
        return album;
      });
      return { ...user, albums: updatedAlbums };
    });
  }

  placeOrder(orderData: Omit<Order, 'id' | 'date'>): Order {
    const newOrder: Order = {
        ...orderData,
        id: Date.now(),
        date: new Date().toISOString()
    };
    this.updateUser(user => ({...user, orders: [...user.orders, newOrder]}));
    return newOrder;
  }

  private updateUser(updateFn: (user: User) => User): void {
    const currentUser = this.loggedInUser();
    if (currentUser) {
        let updatedUser = updateFn(currentUser);
        this.loggedInUser.set(updatedUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        
        // Update the "database" as well
        this.users.update(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  }
}
