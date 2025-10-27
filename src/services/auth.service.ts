import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Album, AlbumPhoto } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { id: 1, name: 'Família Aventura', email: 'user@example.com', isPremium: false, visitedActivityIds: [1, 3] },
  ];

  private albums = signal<Album[]>([
    { id: 1, name: 'Verão em Lisboa', photos: [
        { imageUrl: 'https://picsum.photos/seed/oceanario/400/300', activityName: 'Oceanário de Lisboa' }
    ]},
    { id: 2, name: 'Fim de Semana Radical', photos: []}
  ]);

  private loggedInUser = signal<User | null>(null);

  currentUser = this.loggedInUser.asReadonly();
  isLoggedIn = computed(() => !!this.loggedInUser());
  userAlbums = this.albums.asReadonly();

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && password === 'password');
    if (user) {
      // Create a copy to avoid mutating the original user object
      this.loggedInUser.set({...user});
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedInUser.set(null);
  }

  upgradeToPremium(): void {
    this.loggedInUser.update(user => {
      if (user) {
        return { ...user, isPremium: true };
      }
      return user;
    });
     // Also update the "database"
    const userInDb = this.users.find(u => u.id === this.loggedInUser()?.id);
    if(userInDb) {
      userInDb.isPremium = true;
    }
  }

  markAsVisited(activityId: number): void {
     this.loggedInUser.update(user => {
      if (user && !user.visitedActivityIds.includes(activityId)) {
        const updatedIds = [...user.visitedActivityIds, activityId];
        
        // Also update the "database"
        const userInDb = this.users.find(u => u.id === user.id);
        if(userInDb) {
            userInDb.visitedActivityIds = updatedIds;
        }

        return { ...user, visitedActivityIds: updatedIds };
      }
      return user;
    });
  }

  getAlbumById(id: number): Album | undefined {
    return this.albums().find(a => a.id === id);
  }

  addAlbum(name: string): void {
    const newAlbum: Album = {
      id: Date.now(),
      name,
      photos: []
    };
    this.albums.update(albums => [...albums, newAlbum]);
  }

  addPhotoToAlbum(albumId: number, photo: AlbumPhoto): void {
    this.albums.update(albums => {
      const albumIndex = albums.findIndex(a => a.id === albumId);
      if (albumIndex > -1) {
        const updatedAlbum = { ...albums[albumIndex], photos: [...albums[albumIndex].photos, photo] };
        return albums.map(a => a.id === albumId ? updatedAlbum : a);
      }
      return albums;
    });
  }
}
