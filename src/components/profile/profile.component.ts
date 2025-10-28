import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe],
  template: `
    @if(user()) {
      @let u = user()!;
      <div class="space-y-8">
        <header class="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 class="text-4xl font-extrabold text-gray-800">{{ u.name }}</h1>
          <p class="text-gray-600">{{ u.email }}</p>
          @if(isPremium()) {
            <span class="mt-2 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full">⭐ {{ 'premiumMember' | l10n }}</span>
          }
          <div class="mt-4">
             <button (click)="logout()" class="text-sm text-gray-500 hover:underline">{{ 'logout' | l10n }}</button>
          </div>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for(item of menuItems; track item.link) {
                <a [routerLink]="item.link" class="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:border-teal-400 border-transparent border-2 transition-all duration-300">
                    <div class="flex items-center">
                        <span class="text-3xl mr-4">{{ item.icon }}</span>
                        <div>
                            <h2 class="font-bold text-lg text-gray-800">{{ item.title | l10n }}</h2>
                            <p class="text-sm text-gray-600">{{ item.description | l10n }}</p>
                        </div>
                    </div>
                </a>
            }
             <a routerLink="/premium" class="block bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-white">
                <div class="flex items-center">
                    <span class="text-3xl mr-4">✨</span>
                    <div>
                        <h2 class="font-bold text-lg">{{ 'becomePremium' | l10n }}</h2>
                        <p class="text-sm text-yellow-100">{{ 'premiumCta' | l10n }}</p>
                    </div>
                </div>
            </a>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    
    user = this.authService.currentUser;
    isPremium = this.authService.isPremium;
    
    menuItems = [
      { link: '/favorites', icon: '❤️', title: 'myFavorites', description: 'favoritesDesc' },
      { link: '/albums', icon: '📸', title: 'yourAlbums', description: 'albumsDesc' },
      { link: '/passport', icon: '✈️', title: 'passport', description: 'passportDesc' },
      { link: '/missions', icon: '🎯', title: 'missions', description: 'missionsDesc' },
      // FIX: Changed l10n key from 'points' to 'pointsMenuTitle' to avoid duplicate key in i18n files.
      { link: '/points', icon: '💰', title: 'pointsMenuTitle', description: 'pointsDesc' },
      { link: '/order-history', icon: '📦', title: 'orderHistory', description: 'orderHistoryDesc' },
      { link: '/saved-plans', icon: '🗺️', title: 'savedPlans', description: 'savedPlansDesc' },
    ];

    logout() {
      this.authService.logout();
      this.toastService.show(this.authService.translate('loggedOut'), 'info');
    }
}
