import { Component, ChangeDetectionStrategy, input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close()">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full" (click)="$event.stopPropagation()">
        <h2 class="text-2xl font-bold mb-4">Contactar {{ supplier().name }}</h2>
        <div class="space-y-2 text-gray-700">
            <p><strong>Telefone:</strong> <a [href]="'tel:' + supplier().contact.phone" class="text-teal-500 hover:underline">{{ supplier().contact.phone }}</a></p>
            <p><strong>Email:</strong> <a [href]="'mailto:' + supplier().contact.email" class="text-teal-500 hover:underline">{{ supplier().contact.email }}</a></p>
            @if(supplier().contact.website) {
                 <p><strong>Website:</strong> <a [href]="supplier().contact.website" target="_blank" class="text-teal-500 hover:underline">{{ supplier().contact.website }}</a></p>
            }
        </div>
        <button (click)="close()" class="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300">Fechar</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactModalComponent {
    supplier = input.required<Supplier>();
    closeModal = output<void>();

    close(): void {
        this.closeModal.emit();
    }
}
