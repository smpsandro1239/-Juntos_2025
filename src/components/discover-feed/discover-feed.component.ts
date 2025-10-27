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
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (activity of activities(); track activity.id) {
          <a [routerLink]="['/activity', activity.id]" class="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img [src]="activity.imageUrl" [alt]="activity.name" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-xl mb-2 text-gray-800">{{ activity.name }}</h3>
                <span 
                  class="text-xs font-semibold px-2 py-1 rounded-full"
                  [class.bg-green-100]="activity.price === 0"
                  [class.text-green-800]="activity.price === 0"
                  [class.bg-blue-100]="activity.price > 0"
                  [class.text-blue-800]="activity.price > 0"
                  >
                  {{ activity.price === 0 ? 'Grátis' : 'R$ ' + activity.price }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-4">{{ activity.category }}</p>
              <div class="flex justify-between items-center">
                <app-star-rating [rating]="activity.rating" />
                <span class="text-sm text-gray-500">{{ activity.reviews.length }} avaliações</span>
              </div>
            </div>
          </a>
        } @empty {
          <div class="col-span-full text-center py-16">
            <p class="text-gray-500 text-lg">Nenhuma atividade encontrada com os filtros selecionados.</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverFeedComponent {
  private activityService = inject(ActivityService);
  activities: Signal<Activity[]> = this.activityService.filteredActivities;
}
