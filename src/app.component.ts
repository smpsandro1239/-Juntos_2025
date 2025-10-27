import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-40">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-teal-600">
          <span class="text-yellow-500">Juntos</span>+
        </a>
        <div class="flex items-center space-x-4">
          <a routerLink="/suppliers" class="text-gray-600 hover:text-teal-600">Fornecedores</a>
          <a routerLink="/sos" class="text-gray-600 hover:text-teal-600">SOS</a>
          @if (isLoggedIn()) {
            <a routerLink="/profile" class="px-4 py-2 text-white bg-teal-500 rounded-full hover:bg-teal-600">
              {{ currentUser()?.name }}
            </a>
            <button (click)="logout()" class="text-gray-600 hover:text-teal-600">Sair</button>
          } @else {
            <a routerLink="/login" class="px-4 py-2 text-white bg-teal-500 rounded-full hover:bg-teal-600">
              Entrar
            </a>
          }
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-800 text-white py-6">
        <div class="container mx-auto text-center">
            <p>&copy; 2024 Juntos+. Todos os direitos reservados.</p>
        </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
