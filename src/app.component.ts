import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-20">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex-shrink-0">
            <a routerLink="/" class="text-2xl font-bold text-teal-600">+JUNTOS</a>
          </div>
          <div class="hidden md:flex md:items-center md:space-x-8">
            <a routerLink="/" routerLinkActive="text-teal-600" [routerLinkActiveOptions]="{ exact: true }" class="text-gray-500 hover:text-gray-700">Descobrir</a>
            <a routerLink="/suppliers" routerLinkActive="text-teal-600" class="text-gray-500 hover:text-gray-700">Fornecedores</a>
            @if (isLoggedIn() && isPremium()) {
              <a routerLink="/trip-planner" routerLinkActive="text-teal-600" class="text-gray-500 hover:text-gray-700">Roteiro IA</a>
            }
          </div>
          <div class="flex items-center">
            @if (isLoggedIn()) {
              <a routerLink="/profile" class="mr-4 text-gray-500 hover:text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clip-rule="evenodd" /></svg>
                <span>Perfil</span>
              </a>
              <button (click)="logout()" class="text-gray-500 hover:text-gray-700">Sair</button>
            } @else {
              <a routerLink="/login" class="bg-teal-500 text-white font-bold py-2 px-4 rounded-full hover:bg-teal-600">Entrar</a>
            }
          </div>
        </div>
      </nav>
    </header>
    
    <main class="py-8 bg-gray-50 min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {{ currentYear }} +JUNTOS. Todos os direitos reservados.</p>
        <p class="text-sm text-gray-400 mt-2">Ajudando famílias a criar memórias felizes.</p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  isPremium = computed(() => this.authService.currentUser()?.isPremium ?? false);
  currentYear = new Date().getFullYear();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
