import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Supplier } from '../../models/supplier.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, StarRatingComponent, ContactModalComponent, L10nPipe],
  template: `
    @if (supplier()) {
      @let sup = supplier()!;
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <button routerLink="/suppliers" class="text-teal-500 hover:text-teal-700 mb-4">&larr; {{ 'allSuppliers' | l10n }}</button>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
                <img [ngSrc]="sup.imageUrl" [alt]="sup.name" width="800" height="500" class="w-full rounded-lg shadow-md mb-6" priority>
                <h1 class="text-4xl font-extrabold text-gray-800 mb-2">{{ sup.name }}</h1>
                <p class="text-gray-600 text-lg">{{ sup.location }}</p>
                 <section class="mt-8">
                    <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'description' | l10n }}</h2>
                    <p class="text-gray-600 leading-relaxed">{{ sup.description }}</p>
                </section>
            </div>
            <aside>
                <div class="bg-gray-50 p-6 rounded-lg border">
                    <h3 class="text-xl font-bold mb-4">{{ 'details' | l10n }}</h3>
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <span class="text-lg mr-3">🏷️</span>
                            <span>{{ sup.category }}</span>
                        </div>
                         <div class="flex items-center">
                            <span class="text-lg mr-3">⭐</span>
                            <app-star-rating [rating]="sup.rating" [showRatingValue]="true" />
                        </div>
                    </div>
                    <button (click)="showContactModal.set(true)" class="w-full mt-6 bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors">
                        {{ 'contactSupplier' | l10n }}
                    </button>
                </div>
            </aside>
        </div>
      </div>

      @if(showContactModal()) {
        <app-contact-modal [supplier]="sup" (close)="showContactModal.set(false)" />
      }

    } @else {
      <p>A carregar fornecedor...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  
  supplier = signal<Supplier | undefined>(undefined);
  showContactModal = signal(false);

  constructor() {
    const supplierId = Number(this.route.snapshot.paramMap.get('id'));
    if (supplierId) {
      this.supplier.set(this.activityService.getSupplierById(supplierId));
    }
  }
}
