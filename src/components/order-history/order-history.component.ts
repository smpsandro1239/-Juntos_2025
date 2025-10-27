import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'orderHistory' | l10n }}</h1>
      @if (orders().length > 0) {
        <div class="space-y-4">
            @for (order of orders(); track order.id) {
                <div class="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <h2 class="font-bold text-lg">{{ 'order' | l10n }} #{{ order.id }}</h2>
                        <p class="text-sm text-gray-500">{{ 'album' | l10n }}: {{ order.album.name }}</p>
                        <p class="text-sm text-gray-500">{{ 'date' | l10n }}: {{ order.date | date:'longDate' }}</p>
                    </div>
                    <div>
                        <p class="font-semibold text-lg">{{ order.price | currency:'EUR' }}</p>
                    </div>
                </div>
            }
        </div>
      } @else {
        <p class="text-gray-500 text-center py-8">{{ 'noOrders' | l10n }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent {
    private authService = inject(AuthService);
    orders = this.authService.userOrders;
}
