import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Supplier } from '../../models/supplier.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [RouterLink, StarRatingComponent],
  template: `
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-2 text-teal-600">Fornecedores</h2>
      <p class="text-center text-gray-600 mb-8">Encontre os melhores parceiros para as suas festas e eventos.</p>
      
      <!-- Filters -->
      <div class="flex justify-center gap-2 mb-8 flex-wrap">
        <button (click)="selectedCategory.set(null)"
                [class]="!selectedCategory() ? 'bg-teal-500 text-white' : 'bg-white text-gray-700'"
                class="px-4 py-2 rounded-full font-semibold shadow-sm hover:bg-teal-400 hover:text-white transition-colors">
          Todos
        </button>
        @for(category of uniqueCategories(); track category) {
          <button (click)="selectedCategory.set(category)"
                  [class]="selectedCategory() === category ? 'bg-teal-500 text-white' : 'bg-white text-gray-700'"
                  class="px-4 py-2 rounded-full font-semibold shadow-sm hover:bg-teal-400 hover:text-white transition-colors">
            {{ category }}
          </button>
        }
      </div>

      <!-- Grid -->
      @if (filteredSuppliers().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (supplier of filteredSuppliers(); track supplier.id) {
            <a [routerLink]="['/supplier', supplier.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <img [src]="supplier.imageUrl" [alt]="supplier.name" class="w-full h-48 object-cover">
              <div class="p-4">
                <span class="text-sm font-semibold text-teal-600">{{ supplier.category }}</span>
                <h3 class="text-xl font-semibold mb-2 mt-1">{{ supplier.name }}</h3>
                <p class="text-gray-600 mb-2 text-sm h-10 line-clamp-2">{{ supplier.description }}</p>
                <div class="flex justify-between items-center mt-4">
                  <app-star-rating [rating]="supplier.rating" [showRatingValue]="true" />
                  <span class="text-sm text-gray-500">{{ supplier.location }}</span>
                </div>
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">Nenhum fornecedor encontrado com os critérios selecionados.</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersPageComponent {
  private activityService = inject(ActivityService);

  allSuppliers = this.activityService.allSuppliers;
  selectedCategory = signal<string | null>(null);

  uniqueCategories = computed(() => {
    const categories = this.allSuppliers().map(s => s.category);
    return [...new Set(categories)];
  });

  filteredSuppliers = computed(() => {
    const category = this.selectedCategory();
    if (!category) {
      return this.allSuppliers();
    }
    return this.allSuppliers().filter(s => s.category === category);
  });
}
