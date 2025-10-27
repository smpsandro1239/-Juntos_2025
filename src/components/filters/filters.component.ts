import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md mb-6 sticky top-20 z-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700">Pesquisar</label>
          <input 
            type="text" 
            id="search" 
            placeholder="Nome da atividade..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            (input)="onSearchChange($event)">
        </div>
        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Categoria</label>
          <select 
            id="category" 
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
            (change)="onCategoryChange($event)">
            <option value="">Todas</option>
            @for (category of uniqueCategories(); track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </div>
        <!-- Price -->
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">Preço Máximo: <span class="font-bold text-teal-600">{{ currentPrice() }}€</span></label>
          <input 
            type="range" 
            id="price" 
            min="0" 
            max="50" 
            step="5"
            [value]="currentPrice()"
            class="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            (input)="onPriceChange($event)">
        </div>
        <!-- Rating -->
        <div>
          <label for="rating" class="block text-sm font-medium text-gray-700">Avaliação Mínima: <span class="font-bold text-teal-600">{{ currentRating() }} ★</span></label>
           <input 
            type="range" 
            id="rating" 
            min="0" 
            max="5" 
            step="0.5"
            [value]="currentRating()"
            class="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            (input)="onRatingChange($event)">
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private activityService = inject(ActivityService);
  
  uniqueCategories = this.activityService.uniqueCategories;
  currentPrice = computed(() => this.activityService.priceFilter() ?? 50);
  currentRating = computed(() => this.activityService.ratingFilter() ?? 0);

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.activityService.searchQuery.set(value);
  }
  
  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.activityService.categoryFilter.set(value || null);
  }

  onPriceChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    // Set to null if it's the max value to disable filter
    this.activityService.priceFilter.set(value === 50 ? null : value);
  }

  onRatingChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    // Set to null if it's the min value to disable filter
    this.activityService.ratingFilter.set(value === 0 ? null : value);
  }
}
