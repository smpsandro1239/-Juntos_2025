import { Injectable, signal, computed, effect } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MOCK_USER: User = { id: 1, name: 'Utilizador Teste', email: 'user@example.com', isPremium: false };
  
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  
  constructor() {
    effect(() => {
        const user = this.currentUserSignal();
        if (typeof window !== 'undefined' && window.localStorage) {
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('currentUser');
            }
        }
    });
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  }

  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());

  login(email: string, password: string): boolean {
    if (email === 'user@example.com' && password === 'password') {
      this.currentUserSignal.set(this.MOCK_USER);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
  
  upgradeToPremium(): void {
    this.currentUserSignal.update(user => {
      if (user) {
        return { ...user, isPremium: true };
      }
      return null;
    });
  }
}