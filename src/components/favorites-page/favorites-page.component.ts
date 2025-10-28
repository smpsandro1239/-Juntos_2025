import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivityService } from '../../services/activity.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, CurrencyPipe, L10nPipe, StarRatingComponent],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'myFavorites' | l10n }}</h1>
      
      @if (favoriteActivities().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (activity of favoriteActivities(); track activity.id) {
            <a [routerLink]="['/activity', activity.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img [ngSrc]="activity.imageUrl" [alt]="activity.name" width="400" height="300" class="w-full h-48 object-cover">
              <div class="p-4">
                <p class="text-sm text-gray-500">{{ activity.category }}</p>
                <h3 class="font-bold text-lg text-gray-800 truncate">{{ activity.name }}</h3>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-lg font-bold text-teal-600">{{ activity.price > 0 ? (activity.price | currency:'EUR') : ('free' | l10n) }}</span>
                  <app-star-rating [rating]="activity.rating" />
                </div>
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="text-center py-12">
            <p class="text-gray-500">{{ 'noFavorites' | l10n }}</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPageComponent {
    private authService = inject(AuthService);
    private activityService = inject(ActivityService);
    
    favoriteActivities = computed(() => {
        const favoriteIds = this.authService.currentUser()?.favorites ?? [];
        return this.activityService.allActivities().filter(activity => favoriteIds.includes(activity.id));
    });
}
