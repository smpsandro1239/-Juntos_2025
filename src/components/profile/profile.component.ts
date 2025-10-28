import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe],
  template: `
    @if(currentUser()) {
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800">{{ 'hello' | l10n }}, {{ currentUser()!.name }}!</h1>
          @if(isPremium()) {
            <p class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{{ 'premiumMember' | l10n }} ✨</p>
          } @else {
            <p class="text-gray-600">{{ 'regularMember' | l10n }}</p>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Profile Links -->
          <a routerLink="/favorites" class="group block p-6 bg-gray-50 rounded-lg border hover:shadow-lg hover:border-teal-500 transition-all">
            <h2 class="font-bold text-xl text-gray-800 mb-2">❤️ {{ 'myFavorites' | l10n }}</h2>
            <p class="text-gray-600">{{ 'myFavoritesDesc' | l10n }}</p>
          </a>
          <a routerLink="/albums" class="group block p-6 bg-gray-50 rounded-lg border hover:shadow-lg hover:border-teal-500 transition-all">
            <h2 class="font-bold text-xl text-gray-800 mb-2">📸 {{ 'myAlbums' | l10n }}</h2>
            <p class="text-gray-600">{{ 'myAlbumsDesc' | l10n }}</p>
          </a>
          <a routerLink="/passport" class="group block p-6 bg-gray-50 rounded-lg border hover:shadow-lg hover:border-teal-500 transition-all">
            <h2 class="font-bold text-xl text-gray-800 mb-2">🛂 {{ 'myPassport' | l10n }}</h2>
            <p class="text-gray-600">{{ 'myPassportDesc' | l10n }}</p>
          </a>
          <a routerLink="/missions" class="group block p-6 bg-gray-50 rounded-lg border hover:shadow-lg hover:border-teal-500 transition-all">
            <h2 class="font-bold text-xl text-gray-800 mb-2">🎯 {{ 'myMissions' | l10n }}</h2>
            <p class="text-gray-600">{{ 'myMissionsDesc' | l10n }}</p>
          </a>
          <a routerLink="/points" class="group block p-6 bg-gray-50 rounded-lg border hover:shadow-lg hover:border-teal-500 transition-all">
            <h2 class="font-bold text-xl text-gray-800 mb-2">💰 {{ 'myPoints' | l10n }}</h2>
            <p class="text-gray-600">{{ 'myPointsDesc' | l10n }}</p>
          </a>
           <a routerLink="/orders" class="group block p-6 bg-gray-50 rounded-lg border hover:shadow-lg hover:border-teal-500 transition-all">
            <h2 class="font-bold text-xl text-gray-800 mb-2">📦 {{ 'orderHistory' | l10n }}</h2>
            <p class="text-gray-600">{{ 'orderHistoryDesc' | l10n }}</p>
          </a>
          <a routerLink="/saved-plans" class="group block p-6 bg-gray-50 rounded-lg border hover:shadow-lg hover:border-teal-500 transition-all">
            <h2 class="font-bold text-xl text-gray-800 mb-2">🗺️ {{ 'savedPlans' | l10n }}</h2>
            <p class="text-gray-600">{{ 'savedPlansDesc' | l10n }}</p>
          </a>
          @if(!isPremium()) {
             <a routerLink="/premium" class="group block p-6 rounded-lg border bg-gradient-to-r from-teal-50 to-cyan-50 hover:shadow-lg hover:border-teal-500 transition-all">
                <h2 class="font-bold text-xl text-gray-800 mb-2">🌟 {{ 'becomePremium' | l10n }}</h2>
                <p class="text-gray-600">{{ 'becomePremiumDesc' | l10n }}</p>
              </a>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  
  currentUser = this.authService.currentUser;
  isPremium = this.authService.isPremium;
}
