import { Component, ChangeDetectionStrategy, output, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, CommonModule, L10nPipe],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center">
      <div class="flex-grow w-full">
        <label for="search" class="sr-only">{{ 'search' | l10n }}</label>
        <input 
          type="text" 
          id="search"
          [(ngModel)]="filters.searchTerm" 
          (ngModelChange)="applyFilters()"
          placeholder="{{ 'searchPlaceholder' | l10n }}"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
        >
      </div>
      <div class="w-full sm:w-48">
        <label for="category" class="sr-only">{{ 'filtersCategory' | l10n }}</label>
        <select 
          id="category" 
          [(ngModel)]="filters.category" 
          (ngModelChange)="applyFilters()"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">{{ 'allCategories' | l10n }}</option>
          @for(category of uniqueCategories(); track category) {
            <option [value]="category">{{ category }}</option>
          }
        </select>
      </div>
      <div class="w-full sm:w-40">
        <label for="price" class="sr-only">{{ 'price' | l10n }}</label>
        <select 
          id="price"
          [(ngModel)]="filters.price" 
          (ngModelChange)="applyFilters()"
          class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="all">{{ 'allPrices' | l10n }}</option>
          <option value="free">{{ 'free' | l10n }}</option>
          <option value="paid">{{ 'paid' | l10n }}</option>
        </select>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private activityService = inject(ActivityService);
  filtersChanged = output<{searchTerm: string, category: string, price: string}>();

  filters = {
    searchTerm: '',
    category: 'all',
    price: 'all',
  };

  uniqueCategories = computed(() => {
    const categories = this.activityService.allActivities().map(a => a.category);
    return [...new Set(categories)].sort();
  });

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }
}
