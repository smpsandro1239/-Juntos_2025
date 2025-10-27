import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Activity } from '../../models/activity.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-discover-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, StarRatingComponent, L10nPipe],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (activity of activities(); track activity.id) {
        <div [routerLink]="['/activity', activity.id]" class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
          <img [ngSrc]="activity.imageUrl" [alt]="activity.name" width="400" height="300" class="w-full h-48 object-cover" priority>
          <div class="p-4">
            <span class="inline-block bg-teal-100 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">{{ activity.category }}</span>
            <h3 class="font-bold text-xl mt-2 mb-1">{{ activity.name }}</h3>
            <div class="flex items-center justify-between">
              <app-star-rating [rating]="activity.rating" />
              @if(activity.price > 0) {
                 <p class="text-lg font-semibold text-gray-800">{{ activity.price | number:'1.2-2' }}€</p>
              } @else {
                 <p class="text-lg font-semibold text-green-600">{{ 'free' | l10n }}</p>
              }
            </div>
          </div>
        </div>
      }
      @if (activities().length === 0) {
        <p class="text-gray-600 col-span-full text-center">{{ 'noResults' | l10n }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverFeedComponent {
  activities = input.required<Activity[]>();
}
