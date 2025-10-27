import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-2 text-teal-600">Minhas Encomendas</h2>
      <p class="text-center text-gray-600 mb-8">O seu histórico de álbuns impressos.</p>

      @if (orders().length > 0) {
        <div class="space-y-4">
          @for(order of orders(); track order.id) {
            <div class="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img [src]="order.album.photos[0]?.imageUrl || ''" [alt]="order.album.name" class="w-full sm:w-24 h-24 object-cover rounded-md">
              <div class="flex-grow">
                <p class="font-bold text-lg">{{ order.album.name }}</p>
                <p class="text-sm text-gray-600">Encomendado em: {{ formatDate(order.date) }}</p>
                <p class="text-sm text-gray-600">Tipo: {{ order.coverType }}</p>
              </div>
              <div class="text-lg font-bold text-teal-600 self-start sm:self-center mt-2 sm:mt-0">
                {{ order.price }}€
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">Ainda não fez nenhuma encomenda.</p>
          <a routerLink="/albums" class="text-teal-600 hover:underline font-semibold mt-2 inline-block">Crie um álbum para imprimir!</a>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent {
  private authService = inject(AuthService);
  orders: Signal<Order[]> = this.authService.userOrders;

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
