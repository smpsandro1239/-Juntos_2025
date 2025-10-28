import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Supplier } from '../../models/supplier.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { L10nService } from '../../services/l10n.service';

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
                <div class="bg-gray-50 p-6 rounded-lg border sticky top-24">
                    <h3 class="text-xl font-bold mb-4">{{ 'details' | l10n }}</h3>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <span class="text-lg mr-3">🏷️</span>
                            <span>{{ sup.category }}</span>
                        </div>
                         <div class="flex items-center">
                            <span class="text-lg mr-3">⭐</span>
                            <app-star-rating [rating]="sup.rating" [showRatingValue]="true" />
                        </div>
                    </div>
                    <div class="mt-6 space-y-3">
                        @if(sup.contact.whatsapp) {
                            <a [href]="whatsappLink()" target="_blank" class="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors font-semibold">
                               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.515 1.931 6.42l-.456 1.654 1.657-.457z"/></svg>
                               <span>{{ 'contactViaWhatsApp' | l10n }}</span>
                            </a>
                        }
                        <button (click)="showContactModal.set(true)" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors">
                            {{ 'contactSupplier' | l10n }}
                        </button>
                    </div>
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
  private l10nService = inject(L10nService);
  
  supplier = signal<Supplier | undefined>(undefined);
  showContactModal = signal(false);

  constructor() {
    const supplierId = Number(this.route.snapshot.paramMap.get('id'));
    if (supplierId) {
      this.supplier.set(this.activityService.getSupplierById(supplierId));
    }
  }

  whatsappLink = computed(() => {
    const sup = this.supplier();
    if (!sup?.contact.whatsapp) {
      return '';
    }
    
    // Sanitize phone number (remove non-digits)
    const phone = sup.contact.whatsapp.replace(/\D/g, '');
    const message = this.l10nService.translate('whatsappMessage', sup.name);
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  });
}