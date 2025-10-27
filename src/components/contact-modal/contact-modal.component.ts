import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [L10nPipe],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" (click)="$event.stopPropagation()">
        <h3 class="text-xl font-bold mb-4">{{ 'contact' | l10n }} {{ supplier().name }}</h3>
        
        <div class="space-y-3">
            <p><strong>{{ 'email' | l10n }}:</strong> <a [href]="'mailto:' + supplier().contact.email" class="text-teal-600 hover:underline">{{ supplier().contact.email }}</a></p>
            <p><strong>{{ 'phone' | l10n }}:</strong> <a [href]="'tel:' + supplier().contact.phone" class="text-teal-600 hover:underline">{{ supplier().contact.phone }}</a></p>
            @if(supplier().contact.website) {
                <p><strong>{{ 'website' | l10n }}:</strong> <a [href]="supplier().contact.website" target="_blank" rel="noopener noreferrer" class="text-teal-600 hover:underline">{{ supplier().contact.website }}</a></p>
            }
        </div>

        <div class="mt-6 flex justify-end">
          <button (click)="close.emit()" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Fechar</button>
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
