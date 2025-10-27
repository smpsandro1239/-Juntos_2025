import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-teal-600">
          +JUNTOS
        </a>
        <div class="flex items-center space-x-4">
          <a routerLink="/" routerLinkActive="text-teal-600" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 hover:text-teal-600">Descobrir</a>
          <a routerLink="/suppliers" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-600">Fornecedores</a>
          <a routerLink="/trip-planner" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-600">Roteiro IA</a>
          @if (isLoggedIn()) {
            <a routerLink="/profile" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-600">
              <span class="hidden sm:inline">Perfil de {{ currentUser()?.name }}</span>
              <span class="inline sm:hidden">Perfil</span>
            </a>
            <button (click)="logout()" class="text-gray-600 hover:text-teal-600">Sair</button>
          } @else {
            <a routerLink="/login" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-600">Entrar</a>
          }
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-white mt-8 py-6">
        <div class="container mx-auto px-6 text-center text-gray-500">
            <p>&copy; 2024 +JUNTOS. Todos os direitos reservados.</p>
        </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;
  currentUser: Signal<User | null> = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
