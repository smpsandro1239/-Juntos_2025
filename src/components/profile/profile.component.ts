import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, L10nPipe],
  template: `
    @if (user()) {
      @let u = user()!;
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-3xl font-bold text-gray-800">{{ 'welcome' | l10n }}, {{ u.name }}!</h1>
            @if(u.isPremium) {
                <span class="bg-yellow-200 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">⭐ Premium</span>
            }
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Profile Info -->
            <div class="bg-gray-50 p-6 rounded-lg border">
                <h2 class="text-xl font-semibold mb-4">{{ 'profileInfo' | l10n }}</h2>
                <p><strong>{{ 'name' | l10n }}:</strong> {{ u.name }}</p>
                <p><strong>{{ 'email' | l10n }}:</strong> {{ u.email }}</p>
                <p><strong>{{ 'membership' | l10n }}:</strong> {{ u.isPremium ? ('premium' | l10n) : ('standard' | l10n) }}</p>
            </div>
            
            <!-- Quick Links -->
            <div class="bg-gray-50 p-6 rounded-lg border">
                <h2 class="text-xl font-semibold mb-4">{{ 'quickLinks' | l10n }}</h2>
                <ul class="space-y-2">
                    <li><a routerLink="/passport" class="text-teal-600 hover:underline">{{ 'myPassport' | l10n }}</a></li>
                    <li><a routerLink="/albums" class="text-teal-600 hover:underline">{{ 'myAlbums' | l10n }}</a></li>
                    <li><a routerLink="/orders" class="text-teal-600 hover:underline">{{ 'orderHistory' | l10n }}</a></li>
                </ul>
            </div>
            
             <!-- Premium Upgrade -->
            @if(!u.isPremium) {
                <div class="bg-teal-50 p-6 rounded-lg border border-teal-200">
                    <h2 class="text-xl font-semibold mb-2">{{ 'upgradeToPremium' | l10n }}</h2>
                    <p class="text-gray-600 mb-4">{{ 'premiumDescriptionShort' | l10n }}</p>
                    <a routerLink="/premium" class="inline-block bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition-colors">{{ 'learnMore' | l10n }}</a>
                </div>
            }

        </div>

         <div class="mt-8 text-center">
            <button (click)="logout()" class="text-gray-500 hover:text-red-600 hover:underline">{{ 'logout' | l10n }}</button>
        </div>

      </div>
    } @else {
      <p>A carregar perfil...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  user = this.authService.currentUser;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
