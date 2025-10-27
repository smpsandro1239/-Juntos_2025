import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Supplier } from '../../models/supplier.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [RouterLink, StarRatingComponent, ContactModalComponent],
  template: `
    @if (supplier()) {
      <div class="max-w-4xl mx-auto">
        <a routerLink="/suppliers" class="inline-flex items-center text-teal-600 hover:underline mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            Voltar aos Fornecedores
        </a>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="supplier()!.imageUrl" [alt]="supplier()!.name" class="w-full h-64 object-cover">
          <div class="p-6">
            <span class="text-sm font-semibold text-teal-600">{{ supplier()!.category }}</span>
            <h1 class="text-3xl font-bold mt-1 mb-2">{{ supplier()!.name }}</h1>
            
            <div class="flex justify-between items-start mb-4">
              <app-star-rating [rating]="supplier()!.rating" [showRatingValue]="true" />
              <div class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{{ supplier()!.location }}</span>
              </div>
            </div>
            
            <p class="text-gray-700 mb-6">{{ supplier()!.description }}</p>
            
            <div class="text-center">
                <button (click)="showContactModal.set(true)" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full text-lg">
                    Contactar
                </button>
            </div>
          </div>
        </div>
      </div>

      @if (showContactModal()) {
        <app-contact-modal [supplier]="supplier()!" (close)="showContactModal.set(false)" />
      }

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
  showContactModal = signal(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.supplier.set(this.activityService.getSupplierById(id) ?? null);
    }
  }
}
