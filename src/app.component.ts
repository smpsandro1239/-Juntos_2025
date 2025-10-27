import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-10">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-gray-800">+JUNTOS</a>
        <div>
          @if (authService.currentUser()) {
            <a routerLink="/profile" class="text-gray-800 mx-2 hover:text-teal-500">Perfil</a>
            <button (click)="logout()" class="text-gray-800 mx-2 hover:text-teal-500">Sair</button>
          } @else {
            <a routerLink="/login" class="text-gray-800 mx-2 hover:text-teal-500">Login</a>
          }
        </div>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-100 mt-8">
      <div class="container mx-auto px-6 py-4 text-center text-gray-600">
        <p>&copy; 2024 +JUNTOS. Todos os direitos reservados.</p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}