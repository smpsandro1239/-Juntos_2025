import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { PassportComponent } from '../passport/passport.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, PassportComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-3xl font-bold text-teal-600">Olá, {{ authService.currentUser()?.name }}!</h2>
        <p class="text-gray-600 mt-2">Este é o seu centro de controlo para todas as aventuras em família.</p>
        <div class="mt-4 flex flex-wrap gap-4">
            <a routerLink="/albums" class="bg-teal-100 text-teal-800 font-semibold py-2 px-4 rounded-lg hover:bg-teal-200">
                Meus Álbuns
            </a>
            @if (authService.currentUser()?.isPremium) {
                <span class="bg-yellow-100 text-yellow-800 font-semibold py-2 px-4 rounded-lg">
                    Membro Premium ⭐
                </span>
            } @else {
                 <a routerLink="/premium" class="bg-yellow-100 text-yellow-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-200">
                    Tornar-se Premium
                </a>
            }
        </div>
      </div>

      <app-passport></app-passport>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  authService = inject(AuthService);
}
