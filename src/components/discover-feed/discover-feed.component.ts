import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-discover-feed',
  standalone: true,
  imports: [RouterLink, StarRatingComponent],
  template: `
    @if (activities().length > 0) {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (activity of activities(); track activity.id) {
          <div [routerLink]="['/activity', activity.id]" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <img [src]="activity.imageUrl" [alt]="activity.name" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ activity.name }}</h3>
              <p class="text-gray-600 mb-2">{{ activity.category }}</p>
              <div class="flex justify-between items-center">
                <app-star-rating [rating]="activity.rating" [showRatingValue]="true" />
                <span class="text-lg font-bold text-gray-800">
                  {{ activity.price > 0 ? '$' + activity.price : 'Free' }}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">No activities found matching your criteria.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverFeedComponent {
  private activityService = inject(ActivityService);
  activities: Signal<Activity[]> = this.activityService.filteredActivities;
}
