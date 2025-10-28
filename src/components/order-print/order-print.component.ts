import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Album } from '../../models/album.model';
import { Order } from '../../models/order.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

const DISCOUNT_IN_POINTS = 500;
const DISCOUNT_AMOUNT_EUR = 5;

@Component({
  selector: 'app-order-print',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgOptimizedImage, L10nPipe, CurrencyPipe],
  template: `
    @if(album()) {
        @let alb = album()!;
         <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'orderPrintTitle' | l10n }}: {{ alb.name }}</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Order Summary -->
                <div class="bg-gray-50 p-6 rounded-lg border">
                    <h2 class="text-2xl font-semibold mb-4">{{ 'orderSummary' | l10n }}</h2>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">{{ 'basePrice' | l10n }}</span>
                            <span class="font-semibold">{{ 10 | currency:'EUR' }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">{{ alb.photos.length }} {{ 'photos' | l10n }} (0,50€/foto)</span>
                            <span class="font-semibold">{{ alb.photos.length * 0.5 | currency:'EUR' }}</span>
                        </div>
                         <div class="flex justify-between items-center">
                            <span class="text-gray-600">{{ 'coverType' | l10n }}: {{ coverType() === 'soft' ? ('softCover' | l10n) : ('hardCover' | l10n) }}</span>
                            <span class="font-semibold">{{ (coverType() === 'soft' ? 15 : 25) | currency:'EUR' }}</span>
                        </div>
                        @if(applyDiscount()) {
                           <div class="flex justify-between items-center text-green-600">
                                <span class="font-semibold">{{ 'discount' | l10n }} ({{ DISCOUNT_IN_POINTS }} {{ 'points' | l10n }})</span>
                                <span class="font-bold">-{{ DISCOUNT_AMOUNT_EUR | currency:'EUR' }}</span>
                            </div>
                        }
                    </div>
                    <div class="border-t pt-4 mt-4">
                         <div class="flex justify-between items-center text-xl font-bold">
                            <span>{{ 'total' | l10n }}</span>
                            <span>{{ totalPrice() | currency:'EUR' }}</span>
                        </div>
                    </div>
                     <div class="mt-6 grid grid-cols-3 gap-2 h-32">
                        @for (photo of alb.photos.slice(0, 3); track photo.imageUrl) {
                           <img [ngSrc]="photo.imageUrl" [alt]="photo.activityName" width="100" height="100" class="w-full h-full object-cover rounded">
                        }
                    </div>
                </div>

                <!-- Form -->
                <form #form="ngForm" (ngSubmit)="placeOrder(form.value)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">{{ 'coverType' | l10n }}</label>
                        <div class="flex space-x-4">
                            <label class="flex items-center p-4 border rounded-lg cursor-pointer" [class.border-teal-500]="coverType() === 'soft'" [class.bg-teal-50]="coverType() === 'soft'">
                                <input type="radio" name="coverType" value="soft" [(ngModel)]="coverType" class="mr-2">
                                <div>
                                    <p class="font-semibold">{{ 'softCover' | l10n }}</p>
                                    <p class="text-sm text-gray-600">+15,00 €</p>
                                </div>
                            </label>
                             <label class="flex items-center p-4 border rounded-lg cursor-pointer" [class.border-teal-500]="coverType() === 'hard'" [class.bg-teal-50]="coverType() === 'hard'">
                                <input type="radio" name="coverType" value="hard" [(ngModel)]="coverType" class="mr-2">
                                <div>
                                    <p class="font-semibold">{{ 'hardCover' | l10n }}</p>
                                    <p class="text-sm text-gray-600">+25,00 €</p>
                                </div>
                            </label>
                        </div>
                    </div>

                     <!-- Points Discount -->
                    <div class="my-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <label class="flex items-center">
                            <input type="checkbox" [disabled]="!canAffordDiscount()" (change)="applyDiscount.set($any($event.target).checked)" class="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500">
                            <span class="ml-3 text-gray-700">
                                {{ 'applyDiscount' | l10n:DISCOUNT_IN_POINTS:DISCOUNT_AMOUNT_EUR }}
                                <span class="block text-sm text-gray-500">{{ 'yourBalance' | l10n }}: {{ userPoints() }} {{ 'points' | l10n }}</span>
                            </span>
                        </label>
                    </div>

                    <h3 class="text-xl font-semibold mb-3">{{ 'shippingAddress' | l10n }}</h3>
                    <div class="space-y-4">
                         <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">{{ 'fullName' | l10n }}</label>
                            <input type="text" name="name" id="name" required ngModel class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                        </div>
                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700">{{ 'address' | l10n }}</label>
                            <input type="text" name="address" id="address" required ngModel class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="postalCode" class="block text-sm font-medium text-gray-700">{{ 'postalCode' | l10n }}</label>
                                <input type="text" name="postalCode" id="postalCode" required ngModel class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                             <div>
                                <label for="city" class="block text-sm font-medium text-gray-700">{{ 'city' | l10n }}</label>
                                <input type="text" name="city" id="city" required ngModel class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" [disabled]="form.invalid" class="w-full mt-8 bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400">
                        {{ 'placeOrder' | l10n }}
                    </button>
                </form>
            </div>
         </div>
    } @else {
        <p>A carregar álbum...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPrintComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);

    DISCOUNT_IN_POINTS = DISCOUNT_IN_POINTS;
    DISCOUNT_AMOUNT_EUR = DISCOUNT_AMOUNT_EUR;

    albumId = signal(0);
    album = signal<Album | undefined>(undefined);
    coverType = signal<'soft' | 'hard'>('soft');
    applyDiscount = signal(false);
    
    userPoints = computed(() => this.authService.currentUser()?.points.balance ?? 0);
    canAffordDiscount = computed(() => this.userPoints() >= this.DISCOUNT_IN_POINTS);

    constructor() {
        const id = Number(this.route.snapshot.paramMap.get('albumId'));
        this.albumId.set(id);
        if (id) {
            this.album.set(this.authService.getAlbumById(id));
        }
    }

    totalPrice = computed(() => {
        const basePrice = 10; // Base price for the book
        const photoPrice = this.album()?.photos.length ? this.album()!.photos.length * 0.5 : 0;
        const coverPrice = this.coverType() === 'soft' ? 15 : 25;
        let total = basePrice + photoPrice + coverPrice;
        if (this.applyDiscount()) {
            total -= this.DISCOUNT_AMOUNT_EUR;
        }
        return total;
    });

    placeOrder(formValue: {name: string, address: string, postalCode: string, city: string}) {
        const album = this.album();
        if (!album) {
            this.toastService.show('Álbum não encontrado.', 'error');
            return;
        }

        if (this.applyDiscount()) {
            const success = this.authService.spendPoints(this.DISCOUNT_IN_POINTS, `Desconto na encomenda do álbum "${album.name}"`);
            if (!success) {
                this.toastService.show('Não foi possível aplicar o desconto de pontos.', 'error');
                return;
            }
        }

        const newOrder: Omit<Order, 'id'> = {
            date: new Date().toISOString(),
            album,
            coverType: this.coverType() === 'soft' ? 'Capa Mole' : 'Capa Dura',
            price: this.totalPrice(),
            shippingAddress: {
                name: formValue.name,
                address: formValue.address,
                postalCode: formValue.postalCode,
                city: formValue.city,
            }
        };
        
        this.authService.addOrder(newOrder);
        this.router.navigate(['/order-success']);
    }
}
