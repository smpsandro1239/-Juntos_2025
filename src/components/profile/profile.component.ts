import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

interface ProfileLink {
  path: string;
  labelKey: keyof import('../../i18n/en').en;
  icon: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe],
  template: `
    @if (currentUser(); as user) {
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div class="text-center mb-8">
            <div class="w-24 h-24 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center text-4xl mx-auto mb-4">
                {{ user.name.charAt(0) }}
            </div>
            <h1 class="text-3xl font-bold text-gray-800">{{ user.name }}</h1>
            <p class="text-gray-600">{{ user.email }}</p>
            @if (user.isPremium) {
                 <p class="mt-2 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full">⭐ Premium</p>
            }
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for(link of profileLinks; track link.path) {
                <a [routerLink]="link.path" class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-teal-100 hover:shadow-md transition-all">
                    <span class="text-2xl mr-4">{{ link.icon }}</span>
                    <span class="font-semibold text-gray-700">{{ link.labelKey | l10n }}</span>
                </a>
            }
        </div>

        <div class="mt-8 text-center">
             <button (click)="logout()" class="bg-red-500 text-white font-bold py-2 px-6 rounded hover:bg-red-600 transition-colors">
                {{ 'logout' | l10n }}
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

  currentUser = this.authService.currentUser;

  profileLinks: ProfileLink[] = [
    { path: '/albums', labelKey: 'yourAlbums', icon: '📸' },
    { path: '/passport', labelKey: 'myPassport', icon: '🛂' },
    { path: '/points', labelKey: 'myPoints', icon: '💰' },
    { path: '/favorites', labelKey: 'myFavorites', icon: '❤️' },
    { path: '/missions', labelKey: 'myMissions', icon: '🎯' },
    { path: '/saved-plans', labelKey: 'mySavedPlans', icon: '🗺️' },
    { path: '/order-history', labelKey: 'myOrders', icon: '📦' },
    { path: '/premium', labelKey: 'premiumMembership', icon: '⭐' },
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
