import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivityService, ActivityFilters } from '../../services/activity.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md">
      <form [formGroup]="filterForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700">Pesquisar</label>
          <input type="text" id="search" formControlName="searchTerm" placeholder="Nome da atividade..."
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm">
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Categoria</label>
          <select id="category" formControlName="category"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm">
            <option [ngValue]="null">Todas</option>
            @for(category of uniqueCategories(); track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </div>

        <!-- Rating -->
        <div>
          <label for="rating" class="block text-sm font-medium text-gray-700">Avaliação Mínima</label>
          <select id="rating" formControlName="minRating"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm">
            <option value="0">Qualquer</option>
            <option value="3">3+ Estrelas</option>
            <option value="4">4+ Estrelas</option>
            <option value="5">5 Estrelas</option>
          </select>
        </div>

        <!-- Price Range -->
        <div class="lg:col-span-2">
          <label for="maxPrice" class="block text-sm font-medium text-gray-700">Preço (até {{ filterForm.get('maxPrice')?.value }}€)</label>
           <input type="range" id="maxPrice" formControlName="maxPrice" min="0" max="100" step="5"
                 class="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500">
        </div>

         <!-- Free only -->
         <div class="flex items-center">
            <input id="freeOnly" type="checkbox" formControlName="freeOnly" class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500">
            <label for="freeOnly" class="ml-2 block text-sm text-gray-900">Apenas Grátis</label>
        </div>

        <!-- Reset Button -->
        <div>
            <button type="button" (click)="resetFilters()" class="w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              Limpar
            </button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private activityService = inject(ActivityService);
  private destroy$ = new Subject<void>();

  uniqueCategories = this.activityService.uniqueCategories;

  filterForm = this.fb.group({
    searchTerm: [''],
    category: [null as string | null],
    minRating: [0],
    maxPrice: [100],
    freeOnly: [false],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(values => {
        if (values.freeOnly) {
            this.filterForm.get('maxPrice')?.disable({ emitEvent: false });
        } else {
            this.filterForm.get('maxPrice')?.enable({ emitEvent: false });
        }
        
        const filters: ActivityFilters = {
          searchTerm: values.searchTerm ?? '',
          category: values.category ?? null,
          minRating: Number(values.minRating ?? 0),
          maxPrice: values.freeOnly ? 0 : Number(values.maxPrice ?? 100),
          minPrice: 0
        };
        this.activityService.applyFilters(filters);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetFilters(): void {
    this.filterForm.reset({
      searchTerm: '',
      category: null,
      minRating: 0,
      maxPrice: 100,
      freeOnly: false
    });
  }
}
