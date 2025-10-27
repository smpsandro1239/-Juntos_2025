import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <!-- Search -->
        <div class="md:col-span-1">
          <label for="search" class="block text-gray-700 font-bold mb-2">Procurar por nome</label>
          <input type="text" id="search" [ngModel]="currentFilters.searchTerm" (ngModelChange)="onSearchChange($event)"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 placeholder="Ex: Oceanário">
        </div>

        <!-- Price -->
        <div class="md:col-span-2">
          <label for="price" class="block text-gray-700 font-bold mb-2">Preço máximo: {{ currentFilters.priceRange }}€</label>
          <input type="range" id="price" min="0" max="50" [ngModel]="currentFilters.priceRange" (ngModelChange)="onPriceChange($event)"
                 class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500">
        </div>
      </div>
      
      <!-- Categories -->
      <div class="mt-6">
        <h3 class="block text-gray-700 font-bold mb-2">Categorias</h3>
        <div class="flex flex-wrap gap-3">
          @for (category of uniqueCategories(); track category) {
            <button (click)="onCategoryToggle(category)"
                    [class]="isCategorySelected(category) ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-teal-400 hover:text-white">
              {{ category }}
            </button>
          }
        </div>
      </div>

      <!-- Accessibility -->
      <div class="mt-6 pt-4 border-t">
        <h3 class="block text-gray-700 font-bold mb-2">Acessibilidade</h3>
        <div class="flex flex-wrap gap-3">
            <button (click)="onWheelchairToggle()"
                    [class]="currentFilters.wheelchair ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-blue-400 hover:text-white flex items-center gap-2">
              ♿ Cadeira de Rodas
            </button>
             <button (click)="onStrollerToggle()"
                    [class]="currentFilters.stroller ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-green-400 hover:text-white flex items-center gap-2">
              👶 Carrinho de Bebé
            </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private activityService = inject(ActivityService);
  
  uniqueCategories: Signal<string[]> = this.activityService.uniqueCategories;
  currentFilters = this.activityService.getCurrentFilters();

  onSearchChange(term: string): void {
    this.activityService.setSearchTerm(term);
  }

  onPriceChange(price: any): void { // Can be string or number
    this.activityService.setPriceRange(Number(price));
    this.currentFilters = this.activityService.getCurrentFilters();
  }
  
  onCategoryToggle(category: string): void {
    this.activityService.toggleCategory(category);
    this.currentFilters = this.activityService.getCurrentFilters();
  }

  isCategorySelected(category: string): boolean {
    return this.currentFilters.selectedCategories.includes(category);
  }

  onWheelchairToggle(): void {
    this.activityService.toggleWheelchairAccessible();
    this.currentFilters = this.activityService.getCurrentFilters();
  }

  onStrollerToggle(): void {
    this.activityService.toggleStrollerAccessible();
    this.currentFilters = this.activityService.getCurrentFilters();
  }
}