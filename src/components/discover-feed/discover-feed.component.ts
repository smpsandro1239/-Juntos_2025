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
        <div [routerLink]="['/activity', activity.id]" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col">
          <img [ngSrc]="activity.imageUrl" [alt]="activity.name" width="400" height="300" class="w-full h-48 object-cover">
          <div class="p-4 flex flex-col flex-grow">
            <span class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">{{ activity.category }}</span>
            <h3 class="mt-2 font-bold text-xl text-gray-800">{{ activity.name }}</h3>
            <div class="flex items-center mt-2">
              <app-star-rating [rating]="activity.rating" />
              <span class="text-gray-600 ml-2 text-sm">({{ activity.reviews.length }} avaliações)</span>
            </div>
            <div class="mt-auto pt-2 text-right">
              <p class="font-bold text-lg text-gray-700">
                  @if (activity.price > 0) {
                      {{ 'from' | l10n }} {{ activity.price | currency:'EUR' }}
                  } @else {
                      {{ 'priceFree' | l10n }}
                  }
              </p>
            </div>
          </div>
        </div>
      } @empty {
        <p class="text-gray-500 col-span-full">Nenhuma atividade encontrada com os filtros selecionados.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverFeedComponent {
  activities = input.required<Activity[]>();
}
