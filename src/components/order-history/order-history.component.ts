import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-6">Histórico de Encomendas</h1>
        @if (orders().length > 0) {
            <div class="space-y-4">
                @for (order of orders(); track order.id) {
                    <div class="border rounded-lg p-4">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="font-bold text-lg">Encomenda #{{order.id}}</h2>
                                <p class="text-sm text-gray-500">Realizada em {{ order.date | date:'dd/MM/yyyy' }}</p>
                            </div>
                            <span class="font-bold text-lg">{{ order.price | currency:'EUR' }}</span>
                        </div>
                        <hr class="my-2">
                        <div>
                            <p><strong>Álbum:</strong> {{ order.album.name }}</p>
                            <p><strong>Capa:</strong> {{ order.coverType }}</p>
                            <p><strong>Enviado para:</strong> {{ order.shippingAddress.name }}, {{ order.shippingAddress.address }}</p>
                        </div>
                    </div>
                }
            </div>
        } @else {
            <p class="text-gray-500">Ainda não tem encomendas.</p>
        }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent {
    authService = inject(AuthService);
    orders = this.authService.userOrders;
}
