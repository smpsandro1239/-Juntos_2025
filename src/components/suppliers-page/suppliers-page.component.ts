import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, StarRatingComponent, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'allSuppliers' | l10n }}</h1>

      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">{{ 'supplierCategories' | l10n }}</h2>
        <div class="flex space-x-2">
            <button (click)="selectedCategory.set(null)" [class.bg-teal-500]="selectedCategory() === null" [class.text-white]="selectedCategory() === null" class="px-4 py-2 rounded-full border hover:bg-teal-100 transition-colors">
              {{ 'all' | l10n }}
            </button>
            @for(category of categories(); track category) {
                <button (click)="selectedCategory.set(category)" [class.bg-teal-500]="selectedCategory() === category" [class.text-white]="selectedCategory() === category" class="px-4 py-2 rounded-full border hover:bg-teal-100 transition-colors">
                  {{ category }}
                </button>
            }
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (supplier of filteredSuppliers(); track supplier.id) {
          <div [routerLink]="['/supplier', supplier.id]" class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <img [ngSrc]="supplier.imageUrl" [alt]="supplier.name" width="400" height="250" class="w-full h-48 object-cover">
            <div class="p-4">
              <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">{{ supplier.category }}</span>
              <h3 class="font-bold text-xl mt-2 mb-1">{{ supplier.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ supplier.location }}</p>
              <app-star-rating [rating]="supplier.rating" />
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersPageComponent {
  private activityService = inject(ActivityService);
  
  suppliers = this.activityService.allSuppliers;
  selectedCategory = signal<string | null>(null);

  categories = computed(() => {
    const cats = this.suppliers().map(s => s.category);
    return [...new Set(cats)];
  });

  filteredSuppliers = computed(() => {
    const category = this.selectedCategory();
    if (!category) {
      return this.suppliers();
    }
    return this.suppliers().filter(s => s.category === category);
  });
}
