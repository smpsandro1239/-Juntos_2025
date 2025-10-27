import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, StarRatingComponent],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-2">Fornecedores para Festas e Eventos</h1>
      <p class="text-gray-600 mb-6">Encontre os melhores parceiros para tornar a sua festa inesquecível.</p>

       <div class="mb-6 flex space-x-2 border-b">
        @for (category of categories(); track category) {
          <button 
            (click)="selectedCategory.set(category)"
            class="py-2 px-4 -mb-px"
            [class.border-b-2]="selectedCategory() === category"
            [class.border-teal-500]="selectedCategory() === category"
            [class.text-teal-600]="selectedCategory() === category"
            [class.text-gray-500]="selectedCategory() !== category">
            {{ category }}
          </button>
        }
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (supplier of filteredSuppliers(); track supplier.id) {
          <a [routerLink]="['/supplier', supplier.id]" class="block bg-white rounded-lg shadow border hover:shadow-lg transition-shadow">
            <img [ngSrc]="supplier.imageUrl" [alt]="supplier.name" width="400" height="250" class="w-full h-48 object-cover rounded-t-lg">
            <div class="p-4">
              <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 rounded-full uppercase font-semibold">{{ supplier.category }}</span>
              <h3 class="mt-2 font-bold text-xl">{{ supplier.name }}</h3>
              <p class="text-sm text-gray-600">{{ supplier.location }}</p>
              <app-star-rating [rating]="supplier.rating" class="mt-2" />
            </div>
          </a>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersPageComponent {
    private activityService = inject(ActivityService);
    
    suppliers = this.activityService.allSuppliers;
    selectedCategory = signal<string>('Todos');

    categories = computed(() => {
        const cats = this.suppliers().map(s => s.category);
        return ['Todos', ...new Set(cats)];
    });

    filteredSuppliers = computed(() => {
        const suppliers = this.suppliers();
        const category = this.selectedCategory();
        if (category === 'Todos') {
            return suppliers;
        }
        return suppliers.filter(s => s.category === category);
    });
}
