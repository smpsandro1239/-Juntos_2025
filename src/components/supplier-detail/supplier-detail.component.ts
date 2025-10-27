import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Supplier } from '../../models/supplier.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [RouterLink, StarRatingComponent],
  template: `
    @if (supplier()) {
      <div class="max-w-4xl mx-auto">
        <a routerLink="/suppliers" class="inline-flex items-center text-teal-600 hover:underline mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            Voltar a Fornecedores
        </a>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="supplier()?.imageUrl" [alt]="supplier()?.name" class="w-full h-64 object-cover">
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="bg-teal-100 text-teal-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">{{ supplier()?.category }}</span>
                    <h1 class="text-3xl font-bold mt-2">{{ supplier()?.name }}</h1>
                </div>
                <div class="text-right">
                    <app-star-rating [rating]="supplier()!.rating" [showRatingValue]="true" />
                </div>
            </div>
            
            <p class="text-gray-700 mb-6">{{ supplier()?.description }}</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 border-t pt-6">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                <span>{{ supplier()?.contact.phone }}</span>
              </div>
               <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                <span>{{ supplier()?.contact.email }}</span>
              </div>
              @if(supplier()?.contact.website) {
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" /></svg>
                    <a [href]="supplier()?.contact.website" target="_blank" class="hover:underline break-all">{{ supplier()!.contact.website }}</a>
                </div>
              }
              <div class="flex items-center">
                <svg class="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{{ supplier()?.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">Fornecedor não encontrado.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);

  supplier = signal<Supplier | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.supplier.set(this.activityService.getSupplierById(id) ?? null);
    }
  }
}
