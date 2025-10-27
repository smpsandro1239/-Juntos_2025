import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Supplier } from '../../models/supplier.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, StarRatingComponent, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'allSuppliers' | l10n }}</h1>
      
      <!-- Category Filters -->
      <div class="flex space-x-2 mb-8 border-b pb-4">
        <button 
          (click)="selectedCategory.set(null)"
          [class.bg-teal-500]="selectedCategory() === null"
          [class.text-white]="selectedCategory() === null"
          class="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-teal-100"
        >
          {{ 'all' | l10n }}
        </button>
        @for(category of uniqueCategories(); track category) {
           <button 
            (click)="selectedCategory.set(category)"
            [class.bg-teal-500]="selectedCategory() === category"
            [class.text-white]="selectedCategory() === category"
            class="px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-teal-100"
          >
            {{ category }}
          </button>
        }
      </div>

      <!-- Suppliers Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (supplier of filteredSuppliers(); track supplier.id) {
          <a [routerLink]="['/supplier', supplier.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
            <img [ngSrc]="supplier.imageUrl" [alt]="supplier.name" width="400" height="300" class="w-full h-48 object-cover">
            <div class="p-4">
              <p class="text-sm text-gray-500">{{ supplier.category }}</p>
              <h3 class="font-bold text-lg text-gray-800 truncate">{{ supplier.name }}</h3>
              <p class="text-sm text-gray-600">{{ supplier.location }}</p>
              <div class="mt-2">
                <app-star-rating [rating]="supplier.rating" />
              </div>
            </div>
          </a>
        } @empty {
          <div class="sm:col-span-2 lg:col-span-3 text-center py-12">
            <p class="text-gray-500">{{ 'noResults' | l10n }}</p>
          </div>
        }
      </div>
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
    const suppliers = this.allSuppliers();
    const category = this.selectedCategory();
    if (!category) {
      return suppliers;
    }
    return suppliers.filter(s => s.category === category);
  });
}
