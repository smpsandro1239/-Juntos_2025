import { Component, inject, ChangeDetectionStrategy, Signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-teal-600 text-white shadow-md">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold hover:text-teal-200">+JUNTOS</a>
        <div class="flex items-center space-x-4">
          <a routerLink="/" routerLinkActive="font-bold" [routerLinkActiveOptions]="{ exact: true }" class="hover:text-teal-200">Descobrir</a>
          @if (currentUser()) {
            <a routerLink="/trip-planner" routerLinkActive="font-bold" class="hover:text-teal-200">Roteiro IA</a>
            <a routerLink="/profile" routerLinkActive="font-bold" class="hover:text-teal-200">
              {{ currentUser()?.name }}
            </a>
             @if (!currentUser()?.isPremium) {
                <a routerLink="/premium" routerLinkActive="font-bold" class="bg-yellow-400 text-teal-800 px-3 py-1 rounded hover:bg-yellow-500">Seja Premium</a>
             }
            <button (click)="logout()" class="bg-teal-700 hover:bg-teal-800 px-3 py-1 rounded">Sair</button>
          } @else {
            <a routerLink="/login" routerLinkActive="font-bold" class="hover:text-teal-200">Entrar</a>
            <a routerLink="/premium" routerLinkActive="font-bold" class="bg-yellow-400 text-teal-800 px-3 py-1 rounded hover:bg-yellow-500">Premium</a>
          }
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-100 mt-8 py-4">
        <div class="container mx-auto px-6 text-center text-gray-600">
            <p>&copy; 2024 +JUNTOS. Todos os direitos reservados.</p>
        </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser: Signal<User | null> = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}