import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Album } from '../../models/album.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-print',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyPipe],
  template: `
    @if(album(); as alb) {
        <div class="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h1 class="text-3xl font-bold mb-6">Encomendar Impressão: {{ alb.name }}</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-xl font-bold mb-4">Detalhes da Encomenda</h2>
                    <form #orderForm="ngForm" (ngSubmit)="placeOrder()">
                        <div class="mb-4">
                            <label class="block text-gray-700 font-bold mb-2">Tipo de Capa</label>
                            <select name="coverType" [(ngModel)]="coverType" required class="w-full px-3 py-2 border rounded-md">
                                <option value="Capa Mole">Capa Mole</option>
                                <option value="Capa Dura">Capa Dura</option>
                            </select>
                        </div>
                        <h3 class="text-lg font-bold mt-6 mb-2">Morada de Entrega</h3>
                        <div class="space-y-4">
                            <input type="text" name="name" [(ngModel)]="shippingAddress.name" required placeholder="Nome Completo" class="w-full px-3 py-2 border rounded-md">
                            <input type="text" name="address" [(ngModel)]="shippingAddress.address" required placeholder="Morada" class="w-full px-3 py-2 border rounded-md">
                            <div class="flex space-x-4">
                                <input type="text" name="postalCode" [(ngModel)]="shippingAddress.postalCode" required placeholder="Código Postal" class="w-1/2 px-3 py-2 border rounded-md">
                                <input type="text" name="city" [(ngModel)]="shippingAddress.city" required placeholder="Cidade" class="w-1/2 px-3 py-2 border rounded-md">
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    <h2 class="text-xl font-bold mb-4">Resumo</h2>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="flex justify-between"><span>Álbum:</span> <strong>{{ alb.name }}</strong></p>
                        <p class="flex justify-between"><span>Nº de Fotos:</span> <strong>{{ alb.photos.length }}</strong></p>
                        <p class="flex justify-between"><span>Capa:</span> <strong>{{ coverType }}</strong></p>
                        <hr class="my-2">
                        <p class="flex justify-between text-lg font-bold"><span>Total:</span> <span>{{ totalPrice() | currency:'EUR' }}</span></p>
                    </div>
                     <button (click)="placeOrder()" [disabled]="orderForm.invalid" class="w-full mt-6 bg-teal-500 text-white py-3 rounded-md text-lg font-bold hover:bg-teal-600 disabled:bg-gray-400">Finalizar Encomenda</button>
                </div>
            </div>
        </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPrintComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);

    album = signal<Album | undefined>(undefined);
    
    coverType: 'Capa Mole' | 'Capa Dura' = 'Capa Mole';
    shippingAddress = {
        name: '',
        address: '',
        postalCode: '',
        city: ''
    };

    totalPrice = computed(() => {
        const basePrice = 15; // Base price for the album
        const photoPrice = this.album()?.photos.length || 0 * 0.5;
        const coverPrice = this.coverType === 'Capa Dura' ? 10 : 0;
        return basePrice + photoPrice + coverPrice;
    });

    constructor() {
        const albumId = Number(this.route.snapshot.paramMap.get('albumId'));
        this.album.set(this.authService.getAlbumById(albumId));
    }

    placeOrder(): void {
        const currentAlbum = this.album();
        if(!currentAlbum) return;

        const orderData: Omit<Order, 'id' | 'date'> = {
            album: currentAlbum,
            coverType: this.coverType,
            price: this.totalPrice(),
            shippingAddress: this.shippingAddress
        };

        const newOrder = this.authService.placeOrder(orderData);
        this.router.navigate(['/order-success'], { queryParams: { orderId: newOrder.id }});
    }
}
