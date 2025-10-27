import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" (click)="close.emit()">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold">Contactar {{ supplier().name }}</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <div class="space-y-4">
          <div>
            <p class="font-semibold text-gray-700">Telefone:</p>
            <a [href]="'tel:' + supplier().contact.phone" class="text-teal-600 hover:underline">{{ supplier().contact.phone }}</a>
          </div>
          <div>
            <p class="font-semibold text-gray-700">Email:</p>
            <a [href]="'mailto:' + supplier().contact.email" class="text-teal-600 hover:underline">{{ supplier().contact.email }}</a>
          </div>
          @if (supplier().contact.website) {
            <div>
              <p class="font-semibold text-gray-700">Website:</p>
              <a [href]="supplier().contact.website" target="_blank" rel="noopener noreferrer" class="text-teal-600 hover:underline">{{ supplier().contact.website }}</a>
            </div>
          }
        </div>
        <div class="mt-6 text-right">
            <button (click)="close.emit()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                Fechar
            </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactModalComponent {
  supplier = input.required<Supplier>();
  close = output<void>();
}
