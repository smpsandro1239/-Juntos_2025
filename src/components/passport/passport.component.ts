import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-passport',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, L10nPipe, StarRatingComponent],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ 'passportTitle' | l10n }}</h1>
      <p class="text-gray-600 mb-8">{{ 'passportDescription' | l10n }}</p>

      <h2 class="text-2xl font-semibold mb-4">{{ 'visitedActivities' | l10n }} ({{ visitedActivities().length }})</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (activity of visitedActivities(); track activity.id) {
          <a [routerLink]="['/activity', activity.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
            <img [ngSrc]="activity.imageUrl" [alt]="activity.name" width="400" height="300" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="font-bold text-lg text-gray-800 truncate">{{ activity.name }}</h3>
              <div class="flex justify-between items-center mt-2">
                <app-star-rating [rating]="activity.rating" />
              </div>
            </div>
          </a>
        } @empty {
            <div class="sm:col-span-2 lg:col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                <p class="text-gray-500">{{ 'noVisitedActivities' | l10n }}</p>
            </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportComponent {
    private authService = inject(AuthService);
    private activityService = inject(ActivityService);
    
    visitedActivities = computed(() => {
        const user = this.authService.currentUser();
        if (!user) return [];
        
        const allActivities = this.activityService.allActivities();
        return allActivities.filter(activity => user.visitedActivityIds.includes(activity.id));
    });
}
