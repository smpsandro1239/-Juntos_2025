import { Component, ChangeDetectionStrategy, inject, Signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (user()) {
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
        <h2 class="text-2xl font-bold mb-6 text-center">O seu Perfil</h2>
        <div class="space-y-4">
          <div>
            <p class="text-gray-600"><strong>Nome:</strong> {{ user()?.name }}</p>
          </div>
          <div>
            <p class="text-gray-600"><strong>Email:</strong> {{ user()?.email }}</p>
          </div>
          <div>
            <p class="text-gray-600">
              <strong>Estado da Conta:</strong> 
              @if (user()?.isPremium) {
                <span class="font-semibold text-teal-600">Membro Premium</span>
              } @else {
                <span class="font-semibold text-gray-700">Utilizador Gratuito</span>
              }
            </p>
          </div>
        </div>

        <div class="mt-8 border-t pt-6 flex flex-col items-center space-y-4">
           <a routerLink="/passport" class="w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Ver Passaporte Família
          </a>
          <button (click)="logout()" class="w-full text-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sair
          </button>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: Signal<User | null> = this.authService.currentUser;

  constructor() {
    effect(() => {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
