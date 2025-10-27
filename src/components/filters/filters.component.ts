import { Component, ChangeDetectionStrategy, inject, output, signal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityService, ActivityFilters } from '../../services/activity.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, L10nPipe, CommonModule, CurrencyPipe],
  template: `
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="font-bold text-lg mb-4">{{ 'filtersTitle' | l10n }}</h3>
      <form (submit)="applyFilters(); $event.preventDefault()">
        <div class="mb-4">
          <label for="search" class="sr-only">{{ 'searchPlaceholder' | l10n }}</label>
          <input type="text" id="search" name="search" [(ngModel)]="filtersSignal().searchTerm" placeholder="{{ 'searchPlaceholder' | l10n }}" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
        </div>
        <div class="mb-4">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">{{ 'filtersCategory' | l10n }}</label>
          <select id="category" name="category" [(ngModel)]="filtersSignal().category" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
            <option [ngValue]="null">{{ 'filtersAllCategories' | l10n }}</option>
            @for (category of categories(); track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </div>
        <div class="mb-4">
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">{{ 'filtersPrice' | l10n }}: {{ filtersSignal().maxPrice | currency:'EUR' }}</label>
          <input type="range" id="price" name="price" min="0" max="100" [(ngModel)]="filtersSignal().maxPrice" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div class="mb-4">
          <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">{{ 'filtersRating' | l10n }}: {{ filtersSignal().minRating }} ★</label>
          <input type="range" id="rating" name="rating" min="0" max="5" step="0.5" [(ngModel)]="filtersSignal().minRating" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <button type="submit" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors">{{ 'filtersApply' | l10n }}</button>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private activityService = inject(ActivityService);
  filtersChanged = output<ActivityFilters>();
  
  categories = this.activityService.uniqueCategories;
  
  filtersSignal = signal<ActivityFilters>({
    searchTerm: '',
    category: null,
    minPrice: 0,
    maxPrice: 100,
    minRating: 0
  });

  applyFilters(): void {
    this.filtersChanged.emit(this.filtersSignal());
  }
}
