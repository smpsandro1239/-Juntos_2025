import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Supplier } from '../../models/supplier.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, StarRatingComponent, ContactModalComponent],
  template: `
    @if (supplier(); as sup) {
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img [ngSrc]="sup.imageUrl" [alt]="sup.name" width="600" height="400" class="w-full h-auto rounded-lg shadow-md">
                </div>
                <div>
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 rounded-full uppercase font-semibold">{{ sup.category }}</span>
                    <h1 class="text-4xl font-bold text-gray-800 my-2">{{ sup.name }}</h1>
                    <app-star-rating [rating]="sup.rating" [showRatingValue]="true" class="mb-4" />
                    <p class="text-gray-700 mb-4">{{ sup.description }}</p>
                    <p class="text-gray-600 font-semibold mb-6">📍 {{ sup.location }}</p>
                    <button (click)="showContactModal.set(true)" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600">Contactar</button>
                </div>
            </div>
        </div>
    } @else {
        <p>A carregar fornecedor...</p>
    }

    @if(showContactModal() && supplier()) {
        <app-contact-modal [supplier]="supplier()!" (closeModal)="showContactModal.set(false)" />
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
        this.supplier.set(this.activityService.getSupplierById(supplierId));
    }
}
