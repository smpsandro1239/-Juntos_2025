import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): boolean {
    // Mock login logic
    if (email === 'user@example.com' && password === 'password') {
      const user: User = { id: '1', name: 'Utilizador Teste', email: 'user@example.com' };
      this.currentUser.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/profile']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }
}
