import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, NgOptimizedImage, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Activity } from '../../models/activity.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-discover-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, StarRatingComponent, L10nPipe, CurrencyPipe],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (activity of activities(); track activity.id) {
        <a [routerLink]="['/activity', activity.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="relative">
            <img [ngSrc]="activity.imageUrl" [alt]="activity.name" width="400" height="300" class="w-full h-48 object-cover">
            @if (activity.isSustainable) {
              <span class="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">💚 {{ 'sustainable' | l10n }}</span>
            }
          </div>
          <div class="p-4">
            <p class="text-sm text-gray-500">{{ activity.category }}</p>
            <h3 class="font-bold text-lg text-gray-800 truncate">{{ activity.name }}</h3>
            <div class="flex justify-between items-center mt-2">
              <span class="text-lg font-bold text-teal-600">{{ activity.price > 0 ? (activity.price | currency:'EUR') : ('free' | l10n) }}</span>
              <app-star-rating [rating]="activity.rating" />
            </div>
          </div>
        </a>
      } @empty {
        <div class="sm:col-span-2 lg:col-span-3 text-center py-12">
            <p class="text-gray-500">{{ 'noResults' | l10n }}</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverFeedComponent {
  activities = input.required<Activity[]>();
}
