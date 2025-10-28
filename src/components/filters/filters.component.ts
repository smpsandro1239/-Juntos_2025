
import { Component, ChangeDetectionStrategy, output, input, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';

export interface ActivityFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, L10nPipe, CommonModule, CurrencyPipe],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700">{{ 'search' | l10n }}</label>
          <input type="text" id="search" name="search" [ngModel]="filters().search" (ngModelChange)="onFilterChange('search', $event)" class="mt-1 w-full border-gray-300 rounded-md shadow-sm" placeholder="{{ 'searchPlaceholder' | l10n }}">
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">{{ 'filtersCategory' | l10n }}</label>
          <select id="category" name="category" [ngModel]="filters().category" (ngModelChange)="onFilterChange('category', $event)" class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
            <option value="all">{{ 'all' | l10n }}</option>
            @for(category of categories(); track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </div>

        <!-- Price -->
        <div>
          <label for="maxPrice" class="block text-sm font-medium text-gray-700">{{ 'maxPrice' | l10n }} ({{ filters().maxPrice | currency:'EUR' }})</label>
          <input type="range" id="maxPrice" name="maxPrice" min="0" [max]="maxPrice()" [ngModel]="filters().maxPrice" (ngModelChange)="onFilterChange('maxPrice', +$event)" class="mt-1 w-full">
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  allCategories = input.required<string[]>();
  maxPrice = input.required<number>();
  filtersChanged = output<ActivityFilters>();

  filters = input.required<ActivityFilters>();

  categories = computed(() => [...new Set(this.allCategories())]);

  onFilterChange<K extends keyof ActivityFilters>(key: K, value: ActivityFilters[K]): void {
    this.filtersChanged.emit({
      ...this.filters(),
      [key]: value
    });
  }
}
