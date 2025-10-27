import { Component, inject, ChangeDetectionStrategy, Signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-teal-600 text-white shadow-md">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold hover:text-teal-200">KidsGo</a>
        <div class="flex items-center space-x-4">
          <a routerLink="/" routerLinkActive="font-bold" [routerLinkActiveOptions]="{ exact: true }" class="hover:text-teal-200">Descobrir</a>
          @if (isLoggedIn()) {
            <a routerLink="/trip-planner" routerLinkActive="font-bold" class="hover:text-teal-200">Planeador IA</a>
            <a routerLink="/profile" routerLinkActive="font-bold" class="hover:text-teal-200">Perfil</a>
            <a routerLink="/premium" routerLinkActive="font-bold" class="hover:text-teal-200">Premium</a>
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
            <p>&copy; 2024 KidsGo. Todos os direitos reservados.</p>
        </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
