import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-40">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-teal-600">+JUNTOS</a>
        <div class="hidden md:flex items-center space-x-6">
          <a routerLink="/" routerLinkActive="text-teal-600" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 hover:text-teal-600">Descobrir</a>
          <a routerLink="/suppliers" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-600">Fornecedores</a>
          <a routerLink="/trip-planner" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-600">Roteiro IA</a>
        </div>
        <div class="flex items-center space-x-4">
          @if (authService.isLoggedIn()) {
            <a routerLink="/profile" class="flex items-center text-gray-600 hover:text-teal-600">
              <svg class="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Perfil
            </a>
            <button (click)="logout()" class="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 text-sm">Sair</button>
          } @else {
            <a routerLink="/login" class="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 text-sm">Entrar</a>
          }
           <button (click)="toggleMobileMenu()" class="md:hidden text-gray-600 focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </nav>
       <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden" (click)="closeMobileMenu()">
          <a routerLink="/" class="block py-2 px-4 text-sm text-gray-700 hover:bg-teal-50">Descobrir</a>
          <a routerLink="/suppliers" class="block py-2 px-4 text-sm text-gray-700 hover:bg-teal-50">Fornecedores</a>
          <a routerLink="/trip-planner" class="block py-2 px-4 text-sm text-gray-700 hover:bg-teal-50">Roteiro IA</a>
        </div>
      }
    </header>
    <main class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <footer class="bg-gray-800 text-white py-6">
        <div class="container mx-auto text-center">
            <p>&copy; 2024 +JUNTOS. Todos os direitos reservados.</p>
        </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);

  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
